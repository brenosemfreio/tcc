import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  LuArrowLeft, LuSave, LuSend, LuCalendarClock, LuImage,
} from 'react-icons/lu'
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaLinkedin } from 'react-icons/fa'
import {
  getPostById, NETWORK_META, minMaxChars, needsTitle as needsTitleFn,
} from '../../../services/posts'
import { useAuth } from '../../../contexts/AuthContext'
import PhonePreview from './components/PhonePreview'
import MediaUploader from './components/MediaUploader'
import DateTimePicker from './components/DateTimePicker'
import './Composer.css'

const NETWORK_ICONS = {
  instagram: FaInstagram,
  tiktok:    FaTiktok,
  youtube:   FaYoutube,
  facebook:  FaFacebook,
  linkedin:  FaLinkedin,
}

const NETWORK_IDS = ['instagram', 'tiktok', 'youtube', 'facebook', 'linkedin']

export default function Composer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const isEditing = Boolean(id)

  // Suporta pré-agendamento via querystring (?date=YYYY-MM-DDTHH:MM)
  // usado quando o usuário clica num dia vazio na view de calendário
  const initialDate = searchParams.get('date') || ''

  const [form, setForm] = useState({
    title: '',
    content: '',
    networks: [],
    typesByNetwork: {},     // { instagram: 'feed', tiktok: 'video' }
    scheduledFor: initialDate,
    media: [],              // [{ id, file, name, type, url }]
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Carrega o post quando estamos em modo edição
  useEffect(() => {
    if (!id) return
    getPostById(id).then(post => {
      if (post) {
        // Mapeia o `type` antigo (string única) pra `typesByNetwork` por rede.
        // No mock antigo o tipo era global — atribui ele a cada rede selecionada.
        const typesByNetwork = {}
        ;(post.networks || []).forEach(n => {
          const meta = NETWORK_META[n]
          if (meta) {
            const matched = meta.types.find(t => t.id === post.type)
            typesByNetwork[n] = matched ? matched.id : meta.types[0].id
          }
        })

        setForm({
          title: post.title || '',
          content: post.content || '',
          networks: post.networks || [],
          typesByNetwork,
          scheduledFor: post.scheduledFor ? post.scheduledFor.slice(0, 16) : '',
        })
      }
    })
  }, [id])

  const updateField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  // Toggle de rede: ao adicionar, escolhe o primeiro tipo por padrão. Ao remover,
  // limpa o tipo daquela rede.
  const toggleNetwork = (networkId) => {
    setForm(f => {
      const isSelected = f.networks.includes(networkId)
      if (isSelected) {
        const { [networkId]: _omit, ...rest } = f.typesByNetwork
        return {
          ...f,
          networks: f.networks.filter(n => n !== networkId),
          typesByNetwork: rest,
        }
      }
      const meta = NETWORK_META[networkId]
      const defaultType = meta?.types[0]?.id
      return {
        ...f,
        networks: [...f.networks, networkId],
        typesByNetwork: { ...f.typesByNetwork, [networkId]: defaultType },
      }
    })
  }

  const setTypeForNetwork = (networkId, typeId) => {
    setForm(f => ({
      ...f,
      typesByNetwork: { ...f.typesByNetwork, [networkId]: typeId },
    }))
  }

  // Caracteres permitidos = menor maxChars entre as redes selecionadas
  const maxChars = useMemo(() => minMaxChars(form.networks), [form.networks])
  const titleRequired = useMemo(
    () => needsTitleFn(form.networks, form.typesByNetwork),
    [form.networks, form.typesByNetwork],
  )

  const hasContent = form.content.trim().length > 0
  const hasTitle = !titleRequired || form.title.trim().length > 0
  const hasNetworks = form.networks.length > 0
  const canSubmit = hasContent && hasTitle && hasNetworks

  // Salva o post (mock — futuramente bate no backend)
  const handleSave = async (status) => {
    setLoading(true)
    setFeedback('')
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)

    const msg = {
      draft:     'Rascunho salvo!',
      scheduled: 'Post agendado!',
      pending:   'Submetido pra aprovação!',
    }[status] || 'Salvo!'
    setFeedback(msg)
    setTimeout(() => navigate('/dashboard/posts'), 700)
  }

  return (
    <div className="composer">
      <div className="composer__topbar">
        <button
          type="button"
          className="composer__back"
          onClick={() => navigate('/dashboard/posts')}
        >
          <LuArrowLeft size={16} /> Voltar
        </button>
        <h1>{isEditing ? 'Editar post' : 'Novo post'}</h1>
      </div>

      <div className="composer__layout">
        {/* Coluna esquerda — formulário */}
        <div className="composer__form">

          {/* PASSO 1 — Redes */}
          <div className="composer__step">
            <div className="composer__step-head">
              <span className="composer__step-num">1</span>
              <h3>Em quais redes você quer publicar?</h3>
            </div>
            <div className="composer__networks">
              {NETWORK_IDS.map(id => {
                const meta = NETWORK_META[id]
                const Icon = NETWORK_ICONS[id]
                const selected = form.networks.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    className={`composer__network-pill${selected ? ' composer__network-pill--active' : ''}`}
                    style={selected ? { borderColor: meta.color, color: meta.color } : {}}
                    onClick={() => toggleNetwork(id)}
                  >
                    <Icon size={18} />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* PASSO 2 — Tipo de conteúdo por rede (só aparece após escolher rede) */}
          {hasNetworks && (
            <div className="composer__step">
              <div className="composer__step-head">
                <span className="composer__step-num">2</span>
                <h3>Que tipo de conteúdo em cada rede?</h3>
              </div>
              <div className="composer__type-groups">
                {form.networks.map(networkId => {
                  const meta = NETWORK_META[networkId]
                  const Icon = NETWORK_ICONS[networkId]
                  const selectedType = form.typesByNetwork[networkId]
                  return (
                    <div key={networkId} className="composer__type-group">
                      <span className="composer__type-group-label">
                        <Icon size={14} style={{ color: meta.color }} />
                        {meta.label}
                      </span>
                      <div className="composer__type-pills">
                        {meta.types.map(t => (
                          <button
                            key={t.id}
                            type="button"
                            className={`composer__type-pill${selectedType === t.id ? ' composer__type-pill--active' : ''}`}
                            style={selectedType === t.id ? { borderColor: meta.color, color: meta.color, background: `${meta.color}10` } : {}}
                            onClick={() => setTypeForNetwork(networkId, t.id)}
                          >
                            {t.label}
                            <span className="composer__type-pill-orient">
                              {t.orientation === 'vertical' && '9:16'}
                              {t.orientation === 'square' && '1:1'}
                              {t.orientation === 'horizontal' && '16:9'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PASSO 3 — Conteúdo (título + texto) */}
          {hasNetworks && (
            <div className="composer__step">
              <div className="composer__step-head">
                <span className="composer__step-num">3</span>
                <h3>Conteúdo da publicação</h3>
              </div>

              {titleRequired && (
                <div className="composer__field">
                  <label htmlFor="title">
                    Título <span className="composer__required">obrigatório pro YouTube/Artigo</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Ex: Como crescer no Instagram em 2026"
                    value={form.title}
                    onChange={e => updateField('title', e.target.value.slice(0, 100))}
                  />
                  <span className="composer__counter">{form.title.length} / 100</span>
                </div>
              )}

              <div className="composer__field">
                <label htmlFor="content">
                  {titleRequired ? 'Descrição' : 'Legenda'}
                </label>
                <textarea
                  id="content"
                  placeholder="Escreva aqui... pode usar emojis, hashtags e quebras de linha"
                  value={form.content}
                  onChange={e => updateField('content', e.target.value.slice(0, maxChars))}
                  rows={8}
                />
                <span className="composer__counter">
                  {form.content.length} / {maxChars}
                  {form.networks.length > 1 && ' (limite da rede mais restrita)'}
                </span>
              </div>
            </div>
          )}

          {/* PASSO 4 — Mídia */}
          {hasNetworks && (
            <div className="composer__step">
              <div className="composer__step-head">
                <span className="composer__step-num">4</span>
                <h3>Mídia</h3>
                <span className="composer__step-hint">
                  <LuImage size={12} /> Imagens ou vídeos pra acompanhar o post
                </span>
              </div>
              <MediaUploader
                media={form.media}
                onChange={(media) => updateField('media', media)}
              />
            </div>
          )}

          {/* PASSO 5 — Agendamento */}
          {hasNetworks && (
            <div className="composer__step">
              <div className="composer__step-head">
                <span className="composer__step-num">5</span>
                <h3>Quando publicar?</h3>
              </div>
              <div className="composer__field">
                <label>
                  <LuCalendarClock size={14} /> Data e hora
                </label>
                <DateTimePicker
                  value={form.scheduledFor}
                  onChange={(v) => updateField('scheduledFor', v)}
                  placeholder="Escolha quando publicar"
                />
                <span className="composer__hint">
                  Deixe vazio pra salvar como rascunho sem agendar.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Coluna direita — preview */}
        <aside className="composer__preview-wrap">
          <PhonePreview
            networks={form.networks}
            typesByNetwork={form.typesByNetwork}
            title={form.title}
            content={form.content}
            user={user}
          />
        </aside>
      </div>

      {/* Barra fixa de ações */}
      <div className="composer__actions">
        {feedback && <span className="composer__feedback">{feedback}</span>}

        <button
          type="button"
          className="composer__btn composer__btn--ghost"
          onClick={() => handleSave('draft')}
          disabled={loading || !hasContent}
        >
          <LuSave size={15} /> Salvar rascunho
        </button>

        <button
          type="button"
          className="composer__btn composer__btn--outline"
          onClick={() => handleSave('pending')}
          disabled={loading || !canSubmit}
          title="Em modo equipe, envia para aprovação do gerente"
        >
          <LuSend size={15} /> Submeter pra aprovação
        </button>

        <button
          type="button"
          className="composer__btn composer__btn--primary"
          onClick={() => handleSave('scheduled')}
          disabled={loading || !canSubmit || !form.scheduledFor}
        >
          <LuCalendarClock size={15} /> Agendar
        </button>
      </div>
    </div>
  )
}

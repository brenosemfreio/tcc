import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LuArrowLeft, LuSave, LuSend, LuCalendarClock,
  LuImage, LuVideo, LuLayoutGrid, LuFileText,
} from 'react-icons/lu'
import { getPostById } from '../../../services/posts'
import { useAuth } from '../../../contexts/AuthContext'
import NetworkPills from './components/NetworkPills'
import './Composer.css'

const NETWORK_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'youtube',   label: 'YouTube' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'linkedin',  label: 'LinkedIn' },
]

const TYPE_OPTIONS = [
  { value: 'post',     label: 'Post',      icon: LuFileText },
  { value: 'reel',     label: 'Reel',      icon: LuVideo },
  { value: 'carousel', label: 'Carrossel', icon: LuLayoutGrid },
  { value: 'image',    label: 'Imagem',    icon: LuImage },
]

const MAX_CHARS = 2200

export default function Composer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    content: '',
    networks: [],
    type: 'post',
    scheduledFor: '',
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Carrega o post quando estamos em modo edição
  useEffect(() => {
    if (!id) return
    getPostById(id).then(post => {
      if (post) {
        setForm({
          title: post.title || '',
          content: post.content || '',
          networks: post.networks || [],
          type: post.type || 'post',
          scheduledFor: post.scheduledFor ? post.scheduledFor.slice(0, 16) : '',
        })
      }
    })
  }, [id])

  const updateField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const toggleNetwork = (value) => {
    setForm(f => ({
      ...f,
      networks: f.networks.includes(value)
        ? f.networks.filter(n => n !== value)
        : [...f.networks, value],
    }))
  }

  const canSubmit = form.content.trim().length > 0 && form.networks.length > 0

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
          <div className="composer__field">
            <label htmlFor="title">Título interno (não é publicado)</label>
            <input
              id="title"
              type="text"
              placeholder="Ex: Promo Black Friday"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
            />
          </div>

          <div className="composer__field">
            <label htmlFor="content">Texto da publicação</label>
            <textarea
              id="content"
              placeholder="Escreva sua legenda aqui... use quebras de linha, emojis, hashtags."
              value={form.content}
              onChange={e => updateField('content', e.target.value.slice(0, MAX_CHARS))}
              rows={10}
            />
            <span className="composer__counter">
              {form.content.length} / {MAX_CHARS}
            </span>
          </div>

          <div className="composer__field">
            <label>Tipo de conteúdo</label>
            <div className="composer__types">
              {TYPE_OPTIONS.map(opt => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`composer__type${form.type === opt.value ? ' composer__type--active' : ''}`}
                    onClick={() => updateField('type', opt.value)}
                  >
                    <Icon size={18} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="composer__field">
            <label>Redes onde publicar</label>
            <div className="composer__networks">
              {NETWORK_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`composer__network${form.networks.includes(opt.value) ? ' composer__network--active' : ''}`}
                  onClick={() => toggleNetwork(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="composer__field">
            <label htmlFor="schedule">
              <LuCalendarClock size={14} /> Quando publicar
            </label>
            <input
              id="schedule"
              type="datetime-local"
              value={form.scheduledFor}
              onChange={e => updateField('scheduledFor', e.target.value)}
            />
            <span className="composer__hint">
              Deixe vazio pra salvar como rascunho sem data.
            </span>
          </div>
        </div>

        {/* Coluna direita — preview */}
        <aside className="composer__preview">
          <div className="composer__preview-card">
            <div className="composer__preview-head">
              <div className="composer__preview-avatar">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <strong>{user?.name || 'Você'}</strong>
                <span>Pré-visualização</span>
              </div>
            </div>
            <div className="composer__preview-body">
              {form.content
                ? form.content.split('\n').map((line, i) => <p key={i}>{line || ' '}</p>)
                : <p className="composer__preview-empty">Sua legenda vai aparecer aqui...</p>
              }
            </div>
            {form.networks.length > 0 && (
              <div className="composer__preview-footer">
                <span>Publicará em:</span>
                <NetworkPills networks={form.networks} size={16} />
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Barra fixa de ações */}
      <div className="composer__actions">
        {feedback && <span className="composer__feedback">{feedback}</span>}

        <button
          type="button"
          className="composer__btn composer__btn--ghost"
          onClick={() => handleSave('draft')}
          disabled={loading || !form.content.trim()}
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

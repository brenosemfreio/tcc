import { useState } from 'react'
import { motion } from 'framer-motion'
import { LuUser, LuBell, LuCreditCard, LuCamera } from 'react-icons/lu'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../../components/Button/Button'
import './Configuracoes.css'

const TABS = [
  { id: 'perfil',        label: 'Perfil Pessoal', icon: LuUser       },
  { id: 'notificacoes',  label: 'Notificações',   icon: LuBell       },
  { id: 'pagamento',     label: 'Pagamento',      icon: LuCreditCard },
]

const NOTIFICATIONS = [
  { id: 'approval',  label: 'Solicitações de Aprovação de Publicação', desc: 'Receba notificações quando um membro da equipe enviar um rascunho para revisão.' },
  { id: 'failure',   label: 'Falha programada na postagem',             desc: 'Alertas imediatos caso uma publicação não seja compartilhada nas redes sociais.' },
  { id: 'summary',   label: 'Resumo analítico semanal',                 desc: 'Receba um relatório completo sobre o desempenho do seu conteúdo todas as segundas-feiras.' },
]

function Toggle({ value, onChange }) {
  return (
    <button
      className={`toggle ${value ? 'toggle--on' : ''}`}
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
    >
      <span className="toggle__thumb" />
    </button>
  )
}

export default function Configuracoes() {
  const { user } = useAuth()
  const [tab, setTab] = useState('perfil')
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', birthday: '' })
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ approval: true, failure: true, summary: false })

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleNotif = (id) => setNotifs(n => ({ ...n, [id]: !n[id] }))

  return (
    <div className="config-page">
      <div className="config-page__header">
        <h1>Configurações.</h1>
        <p>Análise precisa sobre seu perfil e rendimentos mensais</p>
      </div>

      <div className="config-page__layout">
        {/* Sidebar tabs */}
        <nav className="config-tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`config-tab ${tab === id ? 'config-tab--active' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <motion.div
          key={tab}
          className="config-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Perfil */}
          {tab === 'perfil' && (
            <div className="config-section">
              <h2>Atualize suas informações pessoais e seu perfil público.</h2>
              <div className="config-card">
                <form onSubmit={handleSave}>
                  <div className="config-avatar-row">
                    <div className="config-avatar">
                      <span>{form.name?.[0]?.toUpperCase() || 'U'}</span>
                      <button type="button" className="config-avatar__edit">
                        <LuCamera size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="config-form-grid">
                    <div className="config-field config-field--full">
                      <label>Nome ou apelido</label>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="config-field">
                      <label>E-mail:</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="config-field">
                      <label>Aniversário:</label>
                      <input
                        type="date"
                        value={form.birthday}
                        onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="config-form-actions">
                    <Button type="submit" loading={false}>
                      {saved ? '✓ Salvo!' : 'Salvar alterações'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Notificações */}
          {tab === 'notificacoes' && (
            <div className="config-section">
              <h2>Preferências de notificações</h2>
              <p className="config-section__sub">Mantenha-se atualizado(a) sobre sua programação editorial e as atividades da equipe.</p>
              <div className="config-card">
                {NOTIFICATIONS.map(({ id, label, desc }) => (
                  <div key={id} className="notif-item">
                    <div>
                      <strong>{label}</strong>
                      <p>{desc}</p>
                    </div>
                    <Toggle value={notifs[id]} onChange={() => toggleNotif(id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagamento */}
          {tab === 'pagamento' && (
            <div className="config-section">
              <h2>Gerencie seus meios de pagamento</h2>
              <p className="config-section__sub">Visualize seu histórico de faturas e atualize seus dados de cobrança com segurança.</p>
              <div className="config-payment-grid">
                <div className="config-card payment-card">
                  <span className="payment-card__label">PLANO ATUAL</span>
                  <h3>Criador Pro</h3>
                  <div className="payment-card__price">
                    <span>$</span><strong>79</strong><span>/mês</span>
                  </div>
                  <Button fullWidth>UPDATE DO PLANO</Button>
                </div>

                <div className="config-card payment-card">
                  <div className="payment-card__header">
                    <span className="payment-card__label">FORMA DE PAGAMENTO</span>
                    <button className="payment-card__edit">Editar</button>
                  </div>
                  <div className="payment-card__method">
                    <span className="payment-card__visa">VISA</span>
                    <span>Visa final 0000</span>
                  </div>
                  <p className="payment-card__next">
                    Sua próxima data de faturamento é <strong>01 de maio de 2026.</strong>
                  </p>
                  <Button fullWidth>UPDATE DO PLANO</Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

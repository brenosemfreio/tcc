import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LuInstagram, LuTwitter, LuYoutube, LuShieldCheck,
  LuCircleCheck, LuCircleAlert, LuWifiOff, LuPlus,
  LuCheck,
} from 'react-icons/lu'
import { FaTiktok, FaFacebook, FaPinterest } from 'react-icons/fa'
import Button from '../../../components/Button/Button'
import './Redes.css'

const NETWORKS = [
  { id: 'instagram', name: 'Instagram', icon: LuInstagram, color: '#E1306C', status: 'connected',     message: 'Sua conta está vinculada!' },
  { id: 'tiktok',   name: 'TikTok',    icon: FaTiktok,    color: '#010101', status: 'expired',       message: 'Sua sessão expirou.' },
  { id: 'facebook', name: 'Facebook',  icon: FaFacebook,  color: '#1877F2', status: 'connected',     message: 'Sua conta está vinculada!' },
  { id: 'twitter',  name: 'Twitter',   icon: LuTwitter,   color: '#1DA1F2', status: 'disconnected',  message: 'Desconectado.' },
  { id: 'pinterest',name: 'Pinterest', icon: FaPinterest, color: '#E60023', status: 'disconnected',  message: 'Desconectado.' },
]

const STATUS_CONFIG = {
  connected:    { label: 'Conectado',    color: 'success', icon: LuCircleCheck, btnLabel: 'Postar',     btnVariant: 'primary' },
  expired:      { label: 'Expirado',     color: 'warning', icon: LuCircleAlert,  btnLabel: 'Reconectar', btnVariant: 'outline' },
  disconnected: { label: 'Desconectado', color: 'error',   icon: LuWifiOff,      btnLabel: 'Conectar',   btnVariant: 'outline' },
}

const PERMISSIONS = [
  { label: 'Adicionar nova rede social', desc: 'Não encontrou sua plataforma favorita? Acione-a', done: true },
  { label: 'Publicação de conteúdo', desc: 'Crie, agende e exclua publicações em perfis vinculados.', done: true },
  { label: 'Análises e Insights', desc: 'Veja dados sobre crescimento do perfil, taxas de engajamento e desempenho.', done: false },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

export default function Redes() {
  const [networks, setNetworks] = useState(NETWORKS)

  const handleAction = (id, status) => {
    if (status === 'connected') return
    setNetworks(prev => prev.map(n =>
      n.id === id ? { ...n, status: 'connected', message: 'Sua conta está vinculada!' } : n
    ))
  }

  return (
    <div className="redes-page">
      <div className="redes-page__header">
        <h1>Conecte suas redes sociais</h1>
        <p>Análise precisa sobre seu perfil e rendimentos mensais</p>
      </div>

      <div className="redes-page__grid">
        {networks.map(({ id, name, icon: Icon, color, status, message }, i) => {
          const cfg = STATUS_CONFIG[status]
          const StatusIcon = cfg.icon
          return (
            <motion.div
              key={id}
              className="network-card"
              style={{ '--net-color': color }}
              variants={fadeUp} initial="hidden" animate="visible" custom={i}
            >
              <div className="network-card__header">
                <div className="network-card__icon" style={{ background: `${color}15`, color }}>
                  <Icon size={24} />
                </div>
                <span className={`network-card__status network-card__status--${cfg.color}`}>
                  <StatusIcon size={12} /> {cfg.label}
                </span>
              </div>
              <h3>{name}</h3>
              <p>{message}</p>
              <Button
                variant={cfg.btnVariant}
                size="sm"
                fullWidth
                onClick={() => handleAction(id, status)}
              >
                {cfg.btnLabel}
              </Button>
            </motion.div>
          )
        })}

        {/* Add new network card */}
        <motion.div
          className="network-card network-card--add"
          variants={fadeUp} initial="hidden" animate="visible" custom={networks.length}
        >
          <p>Tem alguma nova ideia?<br /><strong>Adicione!</strong></p>
          <button className="network-card__add-btn">
            <LuPlus size={28} />
          </button>
        </motion.div>
      </div>

      {/* Permissions section */}
      <div className="redes-page__bottom">
        <motion.div
          className="permissions-card"
          variants={fadeUp} initial="hidden" animate="visible" custom={7}
        >
          <div className="permissions-card__header">
            <div className="permissions-card__icon">
              <LuShieldCheck size={20} />
            </div>
            <div>
              <h3>Permissões concedidas</h3>
              <p>Priorizamos a sua segurança, solicitando apenas os recursos essenciais. Veja mais.</p>
            </div>
          </div>

          <div className="permissions-card__security">
            <LuShieldCheck size={18} />
            <div>
              <strong>Segurança</strong>
              <p>Todos os tokens são criptografados usando o padrão XXXX. O curador nunca armazena suas senhas de redes sociais em formato bruto.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="permissions-list"
          variants={fadeUp} initial="hidden" animate="visible" custom={8}
        >
          {PERMISSIONS.map(({ label, desc, done }) => (
            <div key={label} className="permissions-item">
              <div>
                <strong>{label}</strong>
                <p>{desc}</p>
              </div>
              <div className={`permissions-item__check ${done ? 'permissions-item__check--done' : 'permissions-item__check--lock'}`}>
                {done ? <LuCheck size={16} /> : '🔒'}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

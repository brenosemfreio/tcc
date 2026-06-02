import { motion } from 'framer-motion'
import { LuTrendingUp, LuTrendingDown } from 'react-icons/lu'
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { dashFadeUp as fadeUp } from '../../../../styles/animations'

// Mock — quando o backend chegar, vira service `getNetworkComparison()`.
const NETWORKS = [
  { id: 'instagram', name: 'Instagram',   icon: FaInstagram, color: '#E1306C', followers: '8.6K', growth: '+12.4%', trend: 'up'   },
  { id: 'tiktok',    name: 'TikTok',      icon: FaTiktok,    color: '#010101', followers: '4.2K', growth: '+24.8%', trend: 'up'   },
  { id: 'youtube',   name: 'YouTube',     icon: FaYoutube,   color: '#FF0000', followers: '1.8K', growth: '+6.1%',  trend: 'up'   },
  { id: 'twitter',   name: 'X (Twitter)', icon: FaXTwitter,  color: '#000000', followers: '912',  growth: '-2.3%',  trend: 'down' },
]

const PERIOD_LABELS = {
  '24h':  'Crescimento nas últimas 24h',
  '7d':   'Crescimento nos últimos 7 dias',
  '30d':  'Crescimento nos últimos 30 dias',
  'all':  'Crescimento acumulado total',
}

export default function NetworkComparison({ period = '30d' }) {
  return (
    <motion.div
      className="net-compare"
      variants={fadeUp} initial="hidden" animate="visible" custom={5}
    >
      <div className="net-compare__header">
        <h3>Comparação entre redes</h3>
        <span className="net-compare__sub">{PERIOD_LABELS[period] ?? PERIOD_LABELS['30d']}</span>
      </div>
      <div className="net-compare__grid">
        {NETWORKS.map(({ id, name, icon: Icon, color, followers, growth, trend }) => {
          const TrendIcon = trend === 'up' ? LuTrendingUp : LuTrendingDown
          return (
            <div key={id} className="net-compare__card" style={{ '--net': color }}>
              <div className="net-compare__icon" style={{ background: `${color}15`, color }}>
                <Icon size={18} />
              </div>
              <div className="net-compare__body">
                <span className="net-compare__name">{name}</span>
                <strong className="net-compare__value">{followers}</strong>
                <span className={`net-compare__growth net-compare__growth--${trend}`}>
                  <TrendIcon size={11} /> {growth}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

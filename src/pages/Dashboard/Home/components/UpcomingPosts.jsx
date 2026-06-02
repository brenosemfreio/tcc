import { motion } from 'framer-motion'
import { LuClock, LuArrowRight } from 'react-icons/lu'
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { dashFadeUp as fadeUp } from '../../../../styles/animations'

const NET_META = {
  instagram: { icon: FaInstagram, color: '#E1306C' },
  tiktok:    { icon: FaTiktok,    color: '#111827' },
  youtube:   { icon: FaYoutube,   color: '#FF0000' },
  facebook:  { icon: FaFacebook,  color: '#1877F2' },
  linkedin:  { icon: FaLinkedin,  color: '#0A66C2' },
  twitter:   { icon: FaXTwitter,  color: '#000000' },
}

export default function UpcomingPosts({ posts = [], onSeeAll }) {
  return (
    <motion.div
      className="chart-card upcoming"
      variants={fadeUp} initial="hidden" animate="visible" custom={3}
    >
      <div className="chart-card__header">
        <h3><LuClock size={16} /> Próximos agendamentos</h3>
        <button type="button" className="chart-card__link" onClick={onSeeAll}>Ver todos</button>
      </div>

      {posts.length === 0 ? (
        <div className="chart-card__empty">Nada agendado por enquanto.</div>
      ) : (
        <ul className="upcoming__list">
          {posts.map(p => {
            const net = NET_META[p.network] ?? NET_META.instagram
            const Icon = net.icon
            return (
              <li key={p.id} className="upcoming__item">
                <span className="upcoming__icon" style={{ background: `${net.color}18`, color: net.color }}>
                  <Icon size={15} />
                </span>
                <div className="upcoming__body">
                  <span className="upcoming__title">{p.title}</span>
                  <span className="upcoming__when">{p.date} · {p.time}</span>
                </div>
                <span className="upcoming__countdown">{p.countdown}</span>
              </li>
            )
          })}
        </ul>
      )}
    </motion.div>
  )
}

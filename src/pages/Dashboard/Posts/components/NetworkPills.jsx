import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaLinkedin } from 'react-icons/fa'

const NETWORK_ICONS = {
  instagram: { Icon: FaInstagram, color: '#E1306C' },
  tiktok:    { Icon: FaTiktok,    color: '#010101' },
  youtube:   { Icon: FaYoutube,   color: '#FF0000' },
  facebook:  { Icon: FaFacebook,  color: '#1877F2' },
  linkedin:  { Icon: FaLinkedin,  color: '#0A66C2' },
}

export default function NetworkPills({ networks = [], size = 14 }) {
  return (
    <div className="net-pills">
      {networks.map(n => {
        const meta = NETWORK_ICONS[n]
        if (!meta) return null
        const { Icon, color } = meta
        return (
          <span key={n} className="net-pills__item" style={{ color }} title={n}>
            <Icon size={size} />
          </span>
        )
      })}
    </div>
  )
}

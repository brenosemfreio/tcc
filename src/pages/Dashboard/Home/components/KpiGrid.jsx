import { motion } from 'framer-motion'
import { LuEye, LuUsers, LuHeart, LuTrendingUp, LuTrendingDown, LuUserPlus } from 'react-icons/lu'
import { dashFadeUp as fadeUp } from '../../../../styles/animations'

const STAT_ICONS = {
  views: LuEye, followers: LuUsers, likes: LuHeart, newFollowers: LuUserPlus,
}
const STAT_LABELS = {
  views: 'Crescimento de visualizações',
  followers: 'Crescimento de seguidores',
  likes: 'Total de curtidas',
  newFollowers: 'Novos seguidores',
}

function Skeleton() {
  return (
    <div className="kpi-card kpi-card--skeleton">
      <div className="skeleton kpi-card__icon-skeleton" />
      <div className="kpi-card__body-skeleton">
        <div className="skeleton skeleton--label" />
        <div className="skeleton skeleton--value" />
      </div>
    </div>
  )
}

export default function KpiGrid({ stats }) {
  if (!stats) {
    return (
      <div className="dash-home__kpis">
        {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="dash-home__kpis">
      {Object.entries(stats).map(([key, val], i) => {
        const Icon = STAT_ICONS[key]
        const TrendIcon = val.trend === 'down' ? LuTrendingDown : LuTrendingUp
        const isFeatured = i < 2
        return (
          <motion.div
            key={key}
            className={`kpi-card${isFeatured ? ' kpi-card--featured' : ''}`}
            variants={fadeUp} initial="hidden" animate="visible" custom={i}
          >
            <div className="kpi-card__top">
              <div className="kpi-card__icon"><Icon size={18} /></div>
              <span className={`kpi-card__change kpi-card__change--${val.trend}`}>
                <TrendIcon size={12} /> {val.change}
              </span>
            </div>
            <div className="kpi-card__body">
              <span className="kpi-card__value">{val.value}</span>
              <span className="kpi-card__label">{STAT_LABELS[key]}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

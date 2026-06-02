import { motion } from 'framer-motion'
import { LuTarget } from 'react-icons/lu'

// Mock — quando o backend chegar, vira service `getGoals()` ou similar.
const GOALS = [
  { id: 'followers', label: 'Seguidores',    current: 8642,   target: 10000, color: '#4F35E8' },
  { id: 'posts',     label: 'Posts no mês',  current: 18,     target: 30,    color: '#E1306C' },
  { id: 'reach',     label: 'Alcance',       current: 127800, target: 200000,color: '#10B981' },
]

const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toLocaleString('pt-BR')

export default function GoalsCard() {
  return (
    <div className="goals">
      <div className="chart-card__header">
        <h3><LuTarget size={16} /> Metas do mês</h3>
      </div>
      <div className="goals__list">
        {GOALS.map(g => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100))
          return (
            <div key={g.id} className="goal">
              <div className="goal__meta">
                <span className="goal__label">{g.label}</span>
                <span className="goal__pct">{pct}%</span>
              </div>
              <div className="goal__track">
                <motion.div
                  className="goal__fill"
                  style={{ background: g.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                />
              </div>
              <span className="goal__values">
                {fmt(g.current)} / {fmt(g.target)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

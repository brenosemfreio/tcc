import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { dashFadeUp as fadeUp } from '../../../../styles/animations'
import ChartTooltip from './ChartTooltip'

const GRANULARITIES = [
  { label: 'Diário',  value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensal',  value: 'monthly' },
]

export default function EngagementChart({ data, granularity, onGranularityChange }) {
  const isEmpty = !data || data.length === 0

  return (
    <motion.div
      className="chart-card"
      variants={fadeUp} initial="hidden" animate="visible" custom={5}
    >
      <div className="chart-card__header">
        <h3>Engajamento ao longo do tempo</h3>
        <div className="chart-card__period">
          {GRANULARITIES.map(g => (
            <button
              key={g.value}
              type="button"
              className={`chart-card__period-btn ${granularity === g.value ? 'chart-card__period-btn--active' : ''}`}
              onClick={() => onGranularityChange(g.value)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div className="chart-card__empty">Sem dados para o período selecionado.</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={v => `${Math.round(v / 1000)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="views"    stroke="#4F35E8" strokeWidth={3} dot={false} name="Visualizações" />
              <Line type="monotone" dataKey="likes"    stroke="#E1306C" strokeWidth={1.5} dot={false} name="Curtidas" />
              <Line type="monotone" dataKey="comments" stroke="#10B981" strokeWidth={1.5} dot={false} name="Comentários" />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span style={{ color: '#4F35E8' }}>● Visualizações</span>
            <span style={{ color: '#E1306C' }}>● Curtidas</span>
            <span style={{ color: '#10B981' }}>● Comentários</span>
          </div>
        </>
      )}
    </motion.div>
  )
}

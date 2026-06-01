import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { dashFadeUp as fadeUp } from '../../../../styles/animations'

export default function NetworkDonut({ data }) {
  const isEmpty = !data || data.length === 0
  const top = data?.[0]

  return (
    <motion.div
      className="chart-card chart-card--donut"
      variants={fadeUp} initial="hidden" animate="visible" custom={6}
    >
      <h3>Rede social com maior engajamento</h3>

      {isEmpty ? (
        <div className="chart-card__empty">Sem dados de redes.</div>
      ) : (
        <>
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      stroke="var(--color-card-bg)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <strong>{top.value}%</strong>
              <span>{top.name}</span>
            </div>
          </div>
          <ul className="donut-legend">
            {data.map(({ name, value, color }) => (
              <li key={name}>
                <span style={{ background: color }} />
                {name}
                <strong>{value}%</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </motion.div>
  )
}

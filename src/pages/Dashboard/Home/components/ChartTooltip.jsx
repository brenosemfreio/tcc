// Tooltip customizado para os gráficos do Recharts no dashboard.
export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value.toLocaleString('pt-BR')}</strong>
        </p>
      ))}
    </div>
  )
}

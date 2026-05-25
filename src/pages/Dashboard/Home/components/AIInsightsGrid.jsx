import { LuSparkles } from 'react-icons/lu'

// Grid 2x2 mostrando todos os insights da IA simultaneamente — substituiu o
// carrossel rotativo que escondia 3 de 4 cards.
export default function AIInsightsGrid({ insights }) {
  if (!insights.length) return null

  return (
    <div className="ai-insights ai-insights--grid">
      <div className="ai-insights__label">
        <LuSparkles size={16} /> Insights da IA
      </div>
      <div className="ai-insights__grid">
        {insights.slice(0, 4).map(ins => {
          const Icon = ins.icon
          return (
            <div key={ins.id} className="ai-insight-card ai-insight-card--grid">
              <div className="ai-insight-card__icon">
                {Icon && <Icon size={16} />}
              </div>
              <div className="ai-insight-card__body">
                <strong>{ins.title}</strong>
                <p>{ins.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

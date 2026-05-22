import { useMemo } from 'react'
import { LuClock } from 'react-icons/lu'

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const SLOTS = ['Manhã', 'Tarde', 'Noite', 'Madrugada']

/**
 * Heatmap 7 dias × 4 períodos do dia indicando melhores horários para postar.
 * Mock estático — quando o backend chegar, vira `getBestTimeHeatmap()`.
 */
const MOCK_INTENSITY = [
  //         Seg, Ter, Qua, Qui, Sex, Sáb, Dom
  /* Manhã */     [0.45, 0.55, 0.50, 0.60, 0.70, 0.40, 0.35],
  /* Tarde */     [0.65, 0.70, 0.68, 0.75, 0.80, 0.55, 0.50],
  /* Noite */     [0.85, 0.90, 0.88, 0.92, 0.95, 0.78, 0.72],
  /* Madrugada */ [0.20, 0.15, 0.18, 0.22, 0.30, 0.40, 0.35],
]

function cellColor(intensity) {
  // Gradiente em torno da cor primária #4F35E8 com opacidade conforme intensidade.
  const alpha = 0.10 + intensity * 0.85
  return `rgba(79, 53, 232, ${alpha.toFixed(2)})`
}

export default function BestTimeHeatmap() {
  // Identifica a melhor célula para destacar.
  const best = useMemo(() => {
    let maxI = 0, maxJ = 0, maxV = 0
    for (let i = 0; i < MOCK_INTENSITY.length; i++) {
      for (let j = 0; j < MOCK_INTENSITY[i].length; j++) {
        if (MOCK_INTENSITY[i][j] > maxV) {
          maxV = MOCK_INTENSITY[i][j]
          maxI = i
          maxJ = j
        }
      }
    }
    return { slot: SLOTS[maxI], day: DAYS[maxJ], value: maxV }
  }, [])

  return (
    <div className="heatmap">
      <div className="heatmap__header">
        <h3><LuClock size={16} /> Melhor horário para postar</h3>
        <span className="heatmap__badge">
          Pico: {best.day} · {best.slot}
        </span>
      </div>
      <div className="heatmap__grid">
        <div className="heatmap__corner" aria-hidden="true" />
        {DAYS.map(d => (
          <div key={d} className="heatmap__day-label">{d}</div>
        ))}
        {MOCK_INTENSITY.map((row, i) => (
          <div key={SLOTS[i]} className="heatmap__row" style={{ display: 'contents' }}>
            <div className="heatmap__slot-label">{SLOTS[i]}</div>
            {row.map((intensity, j) => {
              const isBest = SLOTS[i] === best.slot && DAYS[j] === best.day
              return (
                <div
                  key={j}
                  className={`heatmap__cell${isBest ? ' heatmap__cell--best' : ''}`}
                  style={{ background: cellColor(intensity) }}
                  title={`${SLOTS[i]} · ${DAYS[j]} — engajamento ${Math.round(intensity * 100)}%`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="heatmap__legend">
        <span>Menor</span>
        <div className="heatmap__legend-bar" />
        <span>Maior</span>
      </div>
    </div>
  )
}

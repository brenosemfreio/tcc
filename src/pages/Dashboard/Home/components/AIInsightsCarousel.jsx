import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuSparkles, LuChevronLeft, LuChevronRight } from 'react-icons/lu'

const AUTO_ROTATE_MS = 6000

// Carrossel rotativo (auto-play + setas + dots) substituindo a barra horizontal.
// Ocupa menos espaço vertical e dá mais destaque ao insight ativo.
export default function AIInsightsCarousel({ insights }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || insights.length <= 1) return
    const t = setInterval(() => setActive(i => (i + 1) % insights.length), AUTO_ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, insights.length])

  if (!insights.length) return null

  const current = insights[active]
  const goPrev = () => setActive(i => (i - 1 + insights.length) % insights.length)
  const goNext = () => setActive(i => (i + 1) % insights.length)

  return (
    <div
      className="ai-insights ai-insights--carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="ai-insights__label">
        <LuSparkles size={16} /> Insights da IA
      </div>

      <div className="ai-insights__viewport">
        <button
          type="button"
          className="ai-insights__nav ai-insights__nav--prev"
          onClick={goPrev}
          aria-label="Insight anterior"
        >
          <LuChevronLeft size={14} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="ai-insight-card ai-insight-card--solo"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <span className="ai-insight-card__icon">{current.icon}</span>
            <div>
              <strong>{current.title}</strong>
              <p>{current.text}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          className="ai-insights__nav ai-insights__nav--next"
          onClick={goNext}
          aria-label="Próximo insight"
        >
          <LuChevronRight size={14} />
        </button>
      </div>

      <div className="ai-insights__dots" role="tablist">
        {insights.map((ins, i) => (
          <button
            key={ins.id}
            type="button"
            className={`ai-insights__dot${i === active ? ' ai-insights__dot--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Insight ${i + 1}`}
            aria-selected={i === active}
            role="tab"
          />
        ))}
      </div>
    </div>
  )
}

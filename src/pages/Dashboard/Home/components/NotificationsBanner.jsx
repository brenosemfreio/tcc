import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuBell, LuChevronRight, LuChevronLeft, LuX } from 'react-icons/lu'

// Mock — futuramente virá de um service de notificações.
const NOTIFICATIONS = [
  { id: 1, type: 'success', text: 'Você atingiu 86% da meta de seguidores do mês.',          cta: 'Ver metas'    },
  { id: 2, type: 'warning', text: 'Post agendado para amanhã às 09:00 sem mídia anexada.', cta: 'Adicionar'    },
  { id: 3, type: 'info',    text: 'Insights da IA atualizados com base nos posts da semana.', cta: 'Ver insights' },
]

export default function NotificationsBanner({ onAction }) {
  const [items, setItems] = useState(NOTIFICATIONS)
  const [index, setIndex] = useState(0)

  if (!items.length) return null

  const current = items[index]

  const dismiss = () => {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== index)
      // Ajusta o índice caso estivéssemos no último item.
      if (index >= next.length) setIndex(Math.max(0, next.length - 1))
      return next
    })
  }

  const goPrev = () => setIndex(i => (i - 1 + items.length) % items.length)
  const goNext = () => setIndex(i => (i + 1) % items.length)

  return (
    <motion.div
      className={`notif notif--${current.type}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="notif__icon"><LuBell size={15} /></span>

      <AnimatePresence mode="wait">
        <motion.span
          key={current.id}
          className="notif__text"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18 }}
        >
          {current.text}
        </motion.span>
      </AnimatePresence>

      {current.cta && (
        <button
          type="button"
          className="notif__cta"
          onClick={() => onAction?.(current)}
        >
          {current.cta}
        </button>
      )}

      {items.length > 1 && (
        <div className="notif__nav">
          <button type="button" onClick={goPrev} aria-label="Notificação anterior">
            <LuChevronLeft size={14} />
          </button>
          <span className="notif__count">{index + 1}/{items.length}</span>
          <button type="button" onClick={goNext} aria-label="Próxima notificação">
            <LuChevronRight size={14} />
          </button>
        </div>
      )}

      <button
        type="button"
        className="notif__dismiss"
        onClick={dismiss}
        aria-label="Dispensar notificação"
      >
        <LuX size={14} />
      </button>
    </motion.div>
  )
}

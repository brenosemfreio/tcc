import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuBell, LuCircleCheck, LuCircleAlert, LuInfo, LuX,
  LuSearch,
} from 'react-icons/lu'
import './Topbar.css'

const ICONS_BY_TYPE = {
  success: LuCircleCheck,
  warning: LuCircleAlert,
  info:    LuInfo,
}

// Mock — quando o backend chegar, vira `getNotifications()`.
const INITIAL = [
  { id: 1, type: 'success', text: 'Você atingiu 86% da meta de seguidores do mês.', time: 'agora',     unread: true  },
  { id: 2, type: 'warning', text: 'Post agendado pra amanhã às 09:00 sem mídia anexada.', time: '2h',  unread: true  },
  { id: 3, type: 'info',    text: 'Novos insights da IA disponíveis no dashboard.', time: '5h',        unread: true  },
  { id: 4, type: 'success', text: 'Sua publicação "5 dicas..." atingiu 12.4K visualizações.', time: '1d', unread: false },
  { id: 5, type: 'info',    text: 'Bem-vindo ao HubStudio!', time: '2d',                                  unread: false },
]

export default function Topbar({ onOpenSearch }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(INITIAL)
  const panelRef = useRef(null)

  const unreadCount = items.filter(i => i.unread).length

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, unread: false })))
  const dismissOne = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clearAll = () => setItems([])

  return (
    <header className="topbar">
      {/* Trigger de busca — funciona como link visual pra abrir o modal */}
      <button
        type="button"
        className="topbar__search"
        onClick={onOpenSearch}
        aria-label="Pesquisar"
      >
        <LuSearch size={14} />
        <span>Pesquisar...</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="topbar__spacer" />

      {/* Sino de notificações */}
      <div className="topbar__notif" ref={panelRef}>
        <button
          type="button"
          className="topbar__bell"
          onClick={() => setOpen(o => !o)}
          aria-label="Notificações"
          aria-expanded={open}
        >
          <LuBell size={18} />
          {unreadCount > 0 && (
            <span className="topbar__badge">{unreadCount}</span>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              className="notif-panel"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-label="Notificações"
            >
              <div className="notif-panel__header">
                <h3>Notificações</h3>
                {items.length > 0 && unreadCount > 0 && (
                  <button type="button" className="notif-panel__action" onClick={markAllRead}>
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              <div className="notif-panel__list">
                {items.length === 0 ? (
                  <div className="notif-panel__empty">
                    <LuBell size={28} />
                    <p>Tudo em dia! Sem novidades por aqui.</p>
                  </div>
                ) : (
                  items.map(n => {
                    const Icon = ICONS_BY_TYPE[n.type] || LuInfo
                    return (
                      <div
                        key={n.id}
                        className={`notif-item notif-item--${n.type}${n.unread ? ' notif-item--unread' : ''}`}
                      >
                        <span className="notif-item__icon"><Icon size={15} /></span>
                        <div className="notif-item__body">
                          <p>{n.text}</p>
                          <span className="notif-item__time">{n.time}</span>
                        </div>
                        <button
                          type="button"
                          className="notif-item__dismiss"
                          onClick={() => dismissOne(n.id)}
                          aria-label="Dispensar"
                        >
                          <LuX size={13} />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>

              {items.length > 0 && (
                <div className="notif-panel__footer">
                  <button type="button" onClick={clearAll}>Limpar todas</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

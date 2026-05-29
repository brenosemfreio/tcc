import {
  LuCheck, LuX, LuPencil, LuSend, LuUserPlus, LuShield,
  LuSettings, LuCheckCheck, LuCalendarClock,
} from 'react-icons/lu'

// Mapa de tipo de atividade pra estilo + texto formatado
const EVENT_META = {
  'post-created':    { Icon: LuPencil,        color: '#0EA5E9', verb: 'criou rascunho' },
  'post-submitted':  { Icon: LuSend,          color: '#F59E0B', verb: 'submeteu pra aprovação' },
  'post-approved':   { Icon: LuCheck,         color: '#10B981', verb: 'aprovou' },
  'post-rejected':   { Icon: LuX,             color: '#EF4444', verb: 'rejeitou' },
  'post-scheduled':  { Icon: LuCalendarClock, color: '#4F35E8', verb: 'agendou' },
  'post-published':  { Icon: LuCheckCheck,    color: '#10B981', verb: 'publicou' },
  'member-added':    { Icon: LuUserPlus,      color: '#0EA5E9', verb: 'adicionou' },
  'member-removed':  { Icon: LuX,             color: '#EF4444', verb: 'removeu' },
  'role-changed':    { Icon: LuShield,        color: '#7C5FE8', verb: 'mudou o papel de' },
  'config-changed':  { Icon: LuSettings,      color: '#6B7280', verb: 'alterou' },
}

function timeAgo(iso) {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60)     return 'agora'
  if (diff < 3600)   return `há ${Math.floor(diff / 60)}min`
  if (diff < 86400)  return `há ${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `há ${Math.floor(diff / 86400)}d`
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return date
}

function renderText(event) {
  const meta = EVENT_META[event.type]
  if (!meta) return null

  return (
    <>
      <strong>{event.actor}</strong> {meta.verb} <em>"{event.target}"</em>
      {event.targetUser && <> de <strong>{event.targetUser}</strong></>}
      {event.extra?.role && <> como <strong>{event.extra.role}</strong></>}
      {event.extra?.from && event.extra?.to && (
        <> de <strong>{event.extra.from}</strong> pra <strong>{event.extra.to}</strong></>
      )}
    </>
  )
}

export default function AtividadeTab({ events }) {
  return (
    <div className="atividade-tab">
      <div className="atividade-tab__intro">
        <h3>Atividade da equipe</h3>
        <p>Tudo o que aconteceu no time — útil pra auditoria e contexto.</p>
      </div>

      <div className="atividade-tab__feed">
        {events.map(event => {
          const meta = EVENT_META[event.type]
          if (!meta) return null
          const Icon = meta.Icon
          return (
            <div key={event.id} className="atividade-item">
              <div
                className="atividade-item__icon"
                style={{
                  background: `color-mix(in srgb, ${meta.color} 12%, transparent)`,
                  color: meta.color,
                }}
              >
                <Icon size={15} />
              </div>
              <div className="atividade-item__body">
                <p>{renderText(event)}</p>
                {event.extra?.reason && (
                  <span className="atividade-item__reason">"{event.extra.reason}"</span>
                )}
                {event.extra?.detail && (
                  <span className="atividade-item__detail">{event.extra.detail}</span>
                )}
                <span className="atividade-item__time">{timeAgo(event.at)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

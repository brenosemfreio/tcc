const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

export default function MiniCalendar({ scheduledDates = [] }) {
  const today = new Date()
  const year  = today.getFullYear()
  const month = today.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="mini-cal">
      <div className="mini-cal__header">
        <span>{MONTHS[month]} {year}</span>
      </div>
      <div className="mini-cal__weekdays">
        {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="mini-cal__days">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`mini-cal__day
              ${day === today.getDate() ? 'mini-cal__day--today' : ''}
              ${day && scheduledDates.includes(day) ? 'mini-cal__day--scheduled' : ''}
              ${!day ? 'mini-cal__day--empty' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="mini-cal__legend">
        <span className="mini-cal__legend-item mini-cal__legend-item--scheduled">Agendado</span>
        <span className="mini-cal__legend-item mini-cal__legend-item--published">Publicado</span>
        <span className="mini-cal__legend-item mini-cal__legend-item--draft">Rascunho</span>
      </div>
    </div>
  )
}

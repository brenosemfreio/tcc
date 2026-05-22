import { LuCalendar, LuDownload, LuPlus } from 'react-icons/lu'

const PERIOD_OPTIONS = [
  { label: 'Últimos 30 dias', value: '30d' },
  { label: 'Últimos 7 dias',  value: '7d' },
  { label: 'Este mês',        value: 'month' },
]

const NETWORK_OPTIONS = [
  { label: 'Todas',       value: 'all' },
  { label: 'Instagram',   value: 'instagram' },
  { label: 'TikTok',      value: 'tiktok' },
  { label: 'YouTube',     value: 'youtube' },
  { label: 'X (Twitter)', value: 'twitter' },
]

export default function DashboardHeader({
  greeting, period, network, exportFeedback,
  onPeriodChange, onNetworkChange, onNewPost, onExport,
}) {
  return (
    <div className="dash-home__header">
      <div>
        <h1 className="dash-home__greeting">{greeting} 👋</h1>
        <p className="dash-home__sub">Aqui está o desempenho das suas redes sociais.</p>
      </div>
      <div className="dash-home__filters">
        <div className="dash-home__filter">
          <LuCalendar size={15} />
          <select value={period} onChange={e => onPeriodChange(e.target.value)} aria-label="Período">
            {PERIOD_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="dash-home__filter">
          <span>Rede social</span>
          <select value={network} onChange={e => onNetworkChange(e.target.value)} aria-label="Rede social">
            {NETWORK_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <button type="button" className="dash-home__action" onClick={onNewPost}>
          <LuPlus size={15} /> Novo post
        </button>
        <button type="button" className="dash-home__export" onClick={onExport}>
          <LuDownload size={15} /> {exportFeedback || 'Exportar relatório'}
        </button>
      </div>
    </div>
  )
}

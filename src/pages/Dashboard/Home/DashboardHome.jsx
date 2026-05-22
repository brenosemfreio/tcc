import { useState, useEffect, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  LuEye, LuUsers, LuHeart, LuUserPlus,
  LuTrendingUp, LuDownload, LuCalendar, LuSparkles,
  LuEllipsisVertical, LuCircleCheck, LuFileText, LuPlus,
  LuArrowRight, LuPencil, LuCopy, LuTrash2,
} from 'react-icons/lu'
import { useAuth } from '../../../contexts/AuthContext'
import {
  getStats, getEngagementData, getSocialBreakdown,
  getContentReach, getAiInsights,
} from '../../../services/analytics'
import {
  getTopPosts, getRecentPosts, getCalendarMarkers, getAiSuggestions,
} from '../../../services/posts'
import { dashFadeUp as fadeUp } from '../../../styles/animations'
import Button from '../../../components/Button/Button'
import MiniCalendar from './components/MiniCalendar'
import ChartTooltip from './components/ChartTooltip'
import './DashboardHome.css'

const STAT_ICONS = {
  views: LuEye, followers: LuUsers, likes: LuHeart, newFollowers: LuUserPlus,
}
const STAT_LABELS = {
  views: 'Crescimento de visualizações',
  followers: 'Crescimento de seguidores',
  likes: 'Total de curtidas',
  newFollowers: 'Novos seguidores',
}
const STAT_COLORS = {
  views: '#4F35E8', followers: '#E1306C', likes: '#F59E0B', newFollowers: '#10B981',
}

// Mapeamento label exibido → key do service.
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

const CHART_GRANULARITY = [
  { label: 'Diário',  value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensal',  value: 'monthly' },
]

// Gera CSV a partir dos dados e dispara download mockado.
function exportReport(stats, engagement) {
  const rows = [
    ['KPI', 'Valor', 'Variação'],
    ...Object.entries(stats || {}).map(([k, v]) => [STAT_LABELS[k], v.value, v.change]),
    [],
    ['Data', 'Visualizações', 'Curtidas', 'Comentários'],
    ...engagement.map(d => [d.date, d.views, d.likes, d.comments]),
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hubstudio-relatorio-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Dropdown simples para o menu de 3 pontos das publicações recentes.
function PostMenu({ onDuplicate, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="post-menu" ref={ref}>
      <button
        type="button"
        className="recent-post__more"
        onClick={() => setOpen(o => !o)}
        aria-label="Opções do post"
        aria-expanded={open}
      >
        <LuEllipsisVertical size={16} />
      </button>
      {open && (
        <div className="post-menu__dropdown" role="menu">
          <button type="button" onClick={() => { setOpen(false); onEdit() }}>
            <LuPencil size={14} /> Editar
          </button>
          <button type="button" onClick={() => { setOpen(false); onDuplicate() }}>
            <LuCopy size={14} /> Duplicar
          </button>
          <button type="button" className="post-menu__danger" onClick={() => { setOpen(false); onDelete() }}>
            <LuTrash2 size={14} /> Excluir
          </button>
        </div>
      )}
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { openPostModal } = useOutletContext()

  const [stats, setStats] = useState(null)
  const [engagement, setEngagement] = useState([])
  const [socialBreakdown, setSocialBreakdown] = useState([])
  const [contentReach, setContentReach] = useState([])
  const [aiInsights, setAiInsights] = useState([])
  const [topPosts, setTopPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [calendarMarkers, setCalendarMarkers] = useState({})
  const [aiSuggestions, setAiSuggestions] = useState([])

  // Filtros funcionais
  const [period, setPeriod] = useState('30d')
  const [network, setNetwork] = useState('all')
  const [granularity, setGranularity] = useState('daily')

  // Feedback inline (Copiar / Gerar / Exportar)
  const [feedback, setFeedback] = useState({})

  // Carregamento inicial — dados que não dependem de filtros.
  useEffect(() => {
    Promise.all([
      getSocialBreakdown(),
      getContentReach(),
      getAiInsights(),
      getTopPosts(),
      getRecentPosts(),
      getCalendarMarkers(),
      getAiSuggestions(),
    ]).then(([
      socialBreakdownRes, contentReachRes, aiInsightsRes,
      topPostsRes, recentPostsRes, markersRes, aiSuggestionsRes,
    ]) => {
      setSocialBreakdown(socialBreakdownRes)
      setContentReach(contentReachRes)
      setAiInsights(aiInsightsRes)
      setTopPosts(topPostsRes)
      setRecentPosts(recentPostsRes)
      setCalendarMarkers(markersRes)
      setAiSuggestions(aiSuggestionsRes)
    })
  }, [])

  // Refetch de stats sempre que period/network mudam.
  useEffect(() => {
    getStats(period, network).then(setStats)
  }, [period, network])

  // Refetch de engagement chart conforme granularidade/network.
  useEffect(() => {
    getEngagementData(granularity, network).then(setEngagement)
  }, [granularity, network])

  const firstName = user?.name?.split(' ')[0] || 'usuário'
  const topNetwork = socialBreakdown[0]

  // Helper para feedback temporário em um botão específico
  const flashFeedback = (key, msg, ms = 1800) => {
    setFeedback(f => ({ ...f, [key]: msg }))
    setTimeout(() => setFeedback(f => { const { [key]: _, ...rest } = f; return rest }), ms)
  }

  const handleExport = () => {
    exportReport(stats, engagement)
    flashFeedback('export', 'Baixado!')
  }

  const handleAiAction = async (suggestion) => {
    if (suggestion.action === 'Copiar') {
      try {
        await navigator.clipboard.writeText(suggestion.text)
        flashFeedback(`ai-${suggestion.id}`, 'Copiado!')
      } catch {
        flashFeedback(`ai-${suggestion.id}`, 'Erro')
      }
      return
    }
    // 'Gerar' → abre o modal de post pré-preenchido com a sugestão.
    openPostModal({ text: suggestion.text })
  }

  const duplicatePost = (post) => {
    setRecentPosts(prev => [
      { ...post, id: Date.now(), title: `${post.title} (cópia)`, status: 'draft', date: '—', time: '—' },
      ...prev,
    ])
  }

  const deletePost = (id) => {
    setRecentPosts(prev => prev.filter(p => p.id !== id))
  }

  const editPost = (post) => {
    openPostModal({ text: post.title, networks: post.network ? [post.network] : [] })
  }

  return (
    <div className="dash-home">
      {/* Header */}
      <div className="dash-home__header">
        <div>
          <h1 className="dash-home__greeting">
            Bem-vindo de volta, {firstName}! 👋
          </h1>
          <p className="dash-home__sub">Aqui está o desempenho das suas redes sociais.</p>
        </div>
        <div className="dash-home__filters">
          <div className="dash-home__filter">
            <LuCalendar size={15} />
            <select value={period} onChange={e => setPeriod(e.target.value)} aria-label="Período">
              {PERIOD_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="dash-home__filter">
            <span>Rede social</span>
            <select value={network} onChange={e => setNetwork(e.target.value)} aria-label="Rede social">
              {NETWORK_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="dash-home__action"
            onClick={() => openPostModal()}
          >
            <LuPlus size={15} /> Novo post
          </button>
          <button
            type="button"
            className="dash-home__export"
            onClick={handleExport}
          >
            <LuDownload size={15} /> {feedback.export || 'Exportar relatório'}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-home__grid">
        {/* Left column */}
        <div className="dash-home__left">
          {/* KPI cards */}
          <div className="dash-home__kpis">
            {stats ? Object.entries(stats).map(([key, val], i) => {
              const Icon = STAT_ICONS[key]
              return (
                <motion.div
                  key={key}
                  className="kpi-card"
                  style={{ '--kpi-color': STAT_COLORS[key] }}
                  variants={fadeUp} initial="hidden" animate="visible" custom={i}
                >
                  <div className="kpi-card__icon"><Icon size={20} /></div>
                  <div className="kpi-card__body">
                    <span className="kpi-card__label">{STAT_LABELS[key]}</span>
                    <span className="kpi-card__value">{val.value}</span>
                    <span className={`kpi-card__change kpi-card__change--${val.trend}`}>
                      <LuTrendingUp size={12} /> {val.change}
                    </span>
                  </div>
                </motion.div>
              )
            }) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="kpi-card kpi-card--skeleton">
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 12, width: '60%' }} />
                    <div className="skeleton" style={{ height: 24, width: '40%' }} />
                    <div className="skeleton" style={{ height: 10, width: '50%' }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Insights bar */}
          <motion.div
            className="ai-insights"
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
          >
            <div className="ai-insights__label">
              <LuSparkles size={16} /> Insights da IA
            </div>
            <div className="ai-insights__scroll">
              {aiInsights.map(ins => (
                <div key={ins.id} className="ai-insight-card">
                  <span className="ai-insight-card__icon">{ins.icon}</span>
                  <div>
                    <strong>{ins.title}</strong>
                    <p>{ins.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Charts row */}
          <div className="dash-home__charts">
            {/* Engagement line chart */}
            <motion.div
              className="chart-card"
              variants={fadeUp} initial="hidden" animate="visible" custom={5}
            >
              <div className="chart-card__header">
                <div>
                  <h3>Engajamento ao longo do tempo</h3>
                </div>
                <div className="chart-card__period">
                  {CHART_GRANULARITY.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      className={`chart-card__period-btn ${granularity === g.value ? 'chart-card__period-btn--active' : ''}`}
                      onClick={() => setGranularity(g.value)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={engagement} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={v => `${Math.round(v / 1000)}K`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="views"    stroke="#4F35E8" strokeWidth={2} dot={false} name="Visualizações" />
                  <Line type="monotone" dataKey="likes"    stroke="#E1306C" strokeWidth={2} dot={false} name="Curtidas" />
                  <Line type="monotone" dataKey="comments" stroke="#10B981" strokeWidth={2} dot={false} name="Comentários" />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span style={{ color: '#4F35E8' }}>● Visualizações</span>
                <span style={{ color: '#E1306C' }}>● Curtidas</span>
                <span style={{ color: '#10B981' }}>● Comentários</span>
              </div>
            </motion.div>

            {/* Social breakdown donut */}
            <motion.div
              className="chart-card chart-card--donut"
              variants={fadeUp} initial="hidden" animate="visible" custom={6}
            >
              <h3>Rede social com maior engajamento</h3>
              <div className="donut-wrapper">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={socialBreakdown}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {socialBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                  <strong>{topNetwork ? `${topNetwork.value}%` : '—'}</strong>
                  <span>{topNetwork ? topNetwork.name : 'Engajamento total'}</span>
                </div>
              </div>
              <ul className="donut-legend">
                {socialBreakdown.map(({ name, value, color }) => (
                  <li key={name}>
                    <span style={{ background: color }} />
                    {name}
                    <strong>{value}%</strong>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Reach + Top posts */}
          <div className="dash-home__bottom">
            {/* Content reach */}
            <motion.div
              className="chart-card"
              variants={fadeUp} initial="hidden" animate="visible" custom={7}
            >
              <h3>Alcance por tipo de conteúdo</h3>
              <div className="reach-bars">
                {contentReach.map(({ type, value, color }) => (
                  <div key={type} className="reach-bar">
                    <div className="reach-bar__meta">
                      <span style={{ color }}>{type}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="reach-bar__track">
                      <motion.div
                        className="reach-bar__fill"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top posts */}
            <motion.div
              className="chart-card chart-card--top-posts"
              variants={fadeUp} initial="hidden" animate="visible" custom={8}
            >
              <div className="chart-card__header">
                <h3>Top 5 publicações</h3>
                <span className="chart-card__sub">Por engajamento</span>
              </div>
              <div className="top-posts">
                {topPosts.map(({ id, title, date, views, likes }) => (
                  <div key={id} className="top-post">
                    <div className="top-post__info">
                      <p className="top-post__title">{title}</p>
                      <span className="top-post__date">{date}</span>
                    </div>
                    <div className="top-post__stats">
                      <span><LuEye size={12} /> {views}</span>
                      <span><LuHeart size={12} /> {likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Schedule CTA — agora funcional, abre o PostModal */}
          <motion.div
            className="schedule-cta"
            variants={fadeUp} initial="hidden" animate="visible" custom={9}
          >
            <LuCalendar size={32} className="schedule-cta__icon" />
            <div className="schedule-cta__text">
              <strong>Pronto para agendar seu próximo post?</strong>
              <p>Planeje, crie e agende conteúdos que gerem resultados.</p>
            </div>
            <Button
              variant="primary"
              size="md"
              iconRight={<LuArrowRight />}
              onClick={() => openPostModal()}
            >
              Agendar agora
            </Button>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="dash-home__right">
          {/* Calendar */}
          <motion.div
            className="chart-card"
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
          >
            <h3>Calendário de publicações</h3>
            <MiniCalendar markers={calendarMarkers} />
          </motion.div>

          {/* AI suggestions */}
          <motion.div
            className="chart-card"
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
          >
            <div className="chart-card__header">
              <h3>Sugestões da IA para você</h3>
            </div>
            <div className="ai-suggestions">
              {aiSuggestions.map(s => (
                <div key={s.id} className="ai-suggestion">
                  <div className="ai-suggestion__icon">{s.icon}</div>
                  <div className="ai-suggestion__body">
                    <span className="ai-suggestion__label">{s.label}</span>
                    <p>{s.text}</p>
                  </div>
                  <button
                    type="button"
                    className="ai-suggestion__btn"
                    onClick={() => handleAiAction(s)}
                  >
                    {feedback[`ai-${s.id}`] || s.action}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent posts */}
          <motion.div
            className="chart-card"
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
          >
            <div className="chart-card__header">
              <h3>Publicações recentes</h3>
            </div>
            <div className="recent-posts">
              {recentPosts.map((post) => {
                const { id, title, date, time, status } = post
                return (
                  <div key={id} className="recent-post">
                    <div className={`recent-post__status recent-post__status--${status}`}>
                      {status === 'published' ? <LuCircleCheck size={14} /> : <LuFileText size={14} />}
                    </div>
                    <div className="recent-post__info">
                      <p>{title}</p>
                      <span>{date} • {time}</span>
                    </div>
                    <span className={`recent-post__badge recent-post__badge--${status}`}>
                      {status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                    <PostMenu
                      onEdit={() => editPost(post)}
                      onDuplicate={() => duplicatePost(post)}
                      onDelete={() => deletePost(id)}
                    />
                  </div>
                )
              })}
              {recentPosts.length === 0 && (
                <p className="recent-posts__empty">Nenhuma publicação recente.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

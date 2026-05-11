import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  LuEye, LuUsers, LuHeart, LuUserPlus,
  LuTrendingUp, LuDownload, LuCalendar, LuSparkles,
  LuEllipsisVertical, LuCircleCheck, LuFileText,
} from 'react-icons/lu'
import { useAuth } from '../../../contexts/AuthContext'
import {
  getStats, getEngagementData, getSocialBreakdown,
  getContentReach, getAiInsights,
} from '../../../services/analytics'
import { getTopPosts, getRecentPosts, getScheduledDates, getAiSuggestions } from '../../../services/posts'
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

const CHART_PERIOD = ['Diário', 'Semanal', 'Mensal']
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function MiniCalendar({ scheduledDates = [] }) {
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

const CustomTooltip = ({ active, payload, label }) => {
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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

export default function DashboardHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [engagement, setEngagement] = useState([])
  const [socialBreakdown, setSocialBreakdown] = useState([])
  const [contentReach, setContentReach] = useState([])
  const [aiInsights, setAiInsights] = useState([])
  const [topPosts, setTopPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [scheduledDates, setScheduledDates] = useState([])
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [period, setPeriod] = useState('Diário')

  useEffect(() => {
    getStats().then(setStats)
    getEngagementData().then(setEngagement)
    getSocialBreakdown().then(setSocialBreakdown)
    getContentReach().then(setContentReach)
    getAiInsights().then(setAiInsights)
    getTopPosts().then(setTopPosts)
    getRecentPosts().then(setRecentPosts)
    getScheduledDates().then(setScheduledDates)
    getAiSuggestions().then(setAiSuggestions)
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'usuário'

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
            <select>
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
              <option>Este mês</option>
            </select>
          </div>
          <div className="dash-home__filter">
            <span>Rede social</span>
            <select>
              <option>Todas</option>
              <option>Instagram</option>
              <option>TikTok</option>
            </select>
          </div>
          <button className="dash-home__export">
            <LuDownload size={15} /> Exportar relatório
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
                      <LuTrendingUp size={12} /> {val.change} últimos 30 dias
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
                  {CHART_PERIOD.map(p => (
                    <button
                      key={p}
                      className={`chart-card__period-btn ${period === p ? 'chart-card__period-btn--active' : ''}`}
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={engagement} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={v => `${v/1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
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
                  <strong>65%</strong>
                  <span>Engajamento total</span>
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
                {topPosts.map(({ id, title, date, views, likes, comments }) => (
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

          {/* Schedule CTA */}
          <motion.div
            className="schedule-cta"
            variants={fadeUp} initial="hidden" animate="visible" custom={9}
          >
            <LuCalendar size={32} className="schedule-cta__icon" />
            <div>
              <strong>Pronto para agendar seu próximo post?</strong>
              <p>Planeje, crie e agende conteúdos que gerem resultados.</p>
            </div>
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
            <MiniCalendar scheduledDates={scheduledDates} />
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
              {aiSuggestions.map(({ id, icon, label, text, action }) => (
                <div key={id} className="ai-suggestion">
                  <div className="ai-suggestion__icon">{icon}</div>
                  <div className="ai-suggestion__body">
                    <span className="ai-suggestion__label">{label}</span>
                    <p>{text}</p>
                  </div>
                  <button className="ai-suggestion__btn">{action}</button>
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
              <button className="chart-card__link">Ver todas</button>
            </div>
            <div className="recent-posts">
              {recentPosts.map(({ id, title, date, time, status }) => (
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
                  <button className="recent-post__more"><LuEllipsisVertical size={16} /></button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

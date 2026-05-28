import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../../contexts/AuthContext'
import {
  getStats, getEngagementData, getSocialBreakdown,
  getContentReach, getAudience,
} from '../../../services/analytics'
import {
  getTopPosts, getRecentPosts, getCalendarMarkers, getAiSuggestions,
} from '../../../services/posts'
import { dashFadeUp as fadeUp } from '../../../styles/animations'
import { exportDashboardReport } from '../../../utils/export'

import DashboardHeader from './components/DashboardHeader'
import KpiGrid from './components/KpiGrid'
import AudienceCard from './components/AudienceCard'
import BestTimeCard from './components/BestTimeCard'
import CalendarModal from '../../../components/CalendarModal/CalendarModal'
import EngagementChart from './components/EngagementChart'
import NetworkDonut from './components/NetworkDonut'
import NetworkComparison from './components/NetworkComparison'
import ContentReachCard from './components/ContentReachCard'
import TopPostsCard from './components/TopPostsCard'
import ScheduleCTA from './components/ScheduleCTA'
import MiniCalendar from './components/MiniCalendar'
import GoalsCard from './components/GoalsCard'
import AISuggestionsCard from './components/AISuggestionsCard'
import RecentPostsCard from './components/RecentPostsCard'

import './DashboardHome.css'

export default function DashboardHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  // Atalho pra abrir o composer dedicado (substituiu o antigo PostModal).
  const openComposer = () => navigate('/dashboard/posts/novo')

  const [stats, setStats] = useState(null)
  const [engagement, setEngagement] = useState([])
  const [socialBreakdown, setSocialBreakdown] = useState([])
  const [contentReach, setContentReach] = useState([])
  const [audience, setAudience] = useState(null)
  const [topPosts, setTopPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [calendarMarkers, setCalendarMarkers] = useState({})
  const [aiSuggestions, setAiSuggestions] = useState([])

  const [period, setPeriod] = useState('30d')
  const [network, setNetwork] = useState('all')
  const [granularity, setGranularity] = useState('daily')

  const [feedback, setFeedback] = useState({})
  const [showCalendarModal, setShowCalendarModal] = useState(false)

  // Dados estáticos (não dependem dos filtros).
  useEffect(() => {
    Promise.all([
      getSocialBreakdown(),
      getContentReach(),
      getAudience(),
      getTopPosts(),
      getRecentPosts(),
      getCalendarMarkers(),
      getAiSuggestions(),
    ]).then(([
      socialBreakdownRes, contentReachRes, audienceRes,
      topPostsRes, recentPostsRes, markersRes, aiSuggestionsRes,
    ]) => {
      setSocialBreakdown(socialBreakdownRes)
      setContentReach(contentReachRes)
      setAudience(audienceRes)
      setTopPosts(topPostsRes)
      setRecentPosts(recentPostsRes)
      setCalendarMarkers(markersRes)
      setAiSuggestions(aiSuggestionsRes)
    })
  }, [])

  useEffect(() => {
    getStats(period, network).then(setStats)
  }, [period, network])

  useEffect(() => {
    getEngagementData(granularity, network).then(setEngagement)
  }, [granularity, network])

  const firstName = user?.name?.split(' ')[0] || 'usuário'

  const flashFeedback = (key, msg, ms = 1800) => {
    setFeedback(f => ({ ...f, [key]: msg }))
    setTimeout(() => setFeedback(f => {
      const { [key]: _omit, ...rest } = f
      return rest
    }), ms)
  }

  const handleExport = () => {
    exportDashboardReport(stats, engagement)
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
    openComposer()
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
    navigate(`/dashboard/posts/${post.id}/editar`)
  }

  return (
    <div className="dash-home">
      <DashboardHeader
        greeting={`Bem-vindo de volta, ${firstName}!`}
        period={period}
        network={network}
        exportFeedback={feedback.export}
        onPeriodChange={setPeriod}
        onNetworkChange={setNetwork}
        onNewPost={openComposer}
        onExport={handleExport}
      />

      <div className="dash-home__grid">
        {/* Left column */}
        <div className="dash-home__left">
          <KpiGrid stats={stats} />

          {/* Engajamento + Donut (prioridade visual maior) */}
          <div className="dash-home__charts">
            <EngagementChart
              data={engagement}
              granularity={granularity}
              onGranularityChange={setGranularity}
            />
            <NetworkDonut data={socialBreakdown} />
          </div>

          {/* Audience + Best Time lado a lado */}
          <div className="dash-home__row dash-home__row--2">
            <motion.div
              className="chart-card chart-card--audience"
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
            >
              <AudienceCard data={audience} />
            </motion.div>
            <motion.div
              className="chart-card chart-card--best-time"
              variants={fadeUp} initial="hidden" animate="visible" custom={5}
            >
              <BestTimeCard onSchedule={openComposer} />
            </motion.div>
          </div>

          {/* Comparação entre redes */}
          <NetworkComparison />

          {/* Reach + Top posts */}
          <div className="dash-home__bottom">
            <ContentReachCard data={contentReach} />
            <TopPostsCard posts={topPosts} />
          </div>

          <ScheduleCTA onSchedule={openComposer} />
        </div>

        {/* Right column */}
        <div className="dash-home__right">
          <motion.div
            className="chart-card chart-card--calendar"
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
          >
            <h3>Calendário de publicações</h3>
            <MiniCalendar
              markers={calendarMarkers}
              onExpand={() => setShowCalendarModal(true)}
            />
          </motion.div>

          <motion.div
            className="chart-card chart-card--goals"
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
          >
            <GoalsCard />
          </motion.div>

          <AISuggestionsCard
            suggestions={aiSuggestions}
            feedback={feedback}
            onAction={handleAiAction}
          />

          <RecentPostsCard
            posts={recentPosts}
            onEdit={editPost}
            onDuplicate={duplicatePost}
            onDelete={deletePost}
          />
        </div>
      </div>

      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        markers={calendarMarkers}
      />
    </div>
  )
}

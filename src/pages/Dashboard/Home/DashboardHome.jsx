import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../../contexts/AuthContext'
import {
  getStats, getEngagementData, getSocialBreakdown,
  getContentReach, getAiInsights,
} from '../../../services/analytics'
import {
  getTopPosts, getRecentPosts, getCalendarMarkers, getAiSuggestions,
} from '../../../services/posts'
import { dashFadeUp as fadeUp } from '../../../styles/animations'
import { exportDashboardReport } from '../../../utils/export'

import DashboardHeader from './components/DashboardHeader'
import KpiGrid from './components/KpiGrid'
import AIInsightsCarousel from './components/AIInsightsCarousel'
import BestTimeHeatmap from './components/BestTimeHeatmap'
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

  const [period, setPeriod] = useState('30d')
  const [network, setNetwork] = useState('all')
  const [granularity, setGranularity] = useState('daily')

  const [feedback, setFeedback] = useState({})

  // Dados estáticos (não dependem dos filtros).
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
      <DashboardHeader
        greeting={`Bem-vindo de volta, ${firstName}!`}
        period={period}
        network={network}
        exportFeedback={feedback.export}
        onPeriodChange={setPeriod}
        onNetworkChange={setNetwork}
        onNewPost={() => openPostModal()}
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

          {/* AI Insights + Heatmap lado a lado */}
          <div className="dash-home__row dash-home__row--2">
            <AIInsightsCarousel insights={aiInsights} />
            <motion.div
              className="chart-card"
              variants={fadeUp} initial="hidden" animate="visible" custom={5}
            >
              <BestTimeHeatmap />
            </motion.div>
          </div>

          {/* Comparação entre redes */}
          <NetworkComparison />

          {/* Reach + Top posts */}
          <div className="dash-home__bottom">
            <ContentReachCard data={contentReach} />
            <TopPostsCard posts={topPosts} />
          </div>

          <ScheduleCTA onSchedule={() => openPostModal()} />
        </div>

        {/* Right column */}
        <div className="dash-home__right">
          <motion.div
            className="chart-card"
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
          >
            <h3>Calendário de publicações</h3>
            <MiniCalendar markers={calendarMarkers} />
          </motion.div>

          <motion.div
            className="chart-card"
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
    </div>
  )
}

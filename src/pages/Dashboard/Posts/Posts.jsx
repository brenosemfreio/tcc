import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { LuInbox } from 'react-icons/lu'
import { getAllPosts } from '../../../services/posts'
import { dashFadeUp as fadeUp } from '../../../styles/animations'
import PostsHeader from './components/PostsHeader'
import StatusTabs from './components/StatusTabs'
import PostsFilters from './components/PostsFilters'
import PostListItem from './components/PostListItem'
import PostsCalendar from './components/PostsCalendar'
import ApprovalDrawer from './components/ApprovalDrawer'
import './Posts.css'

// Verifica se um post está dentro do período selecionado
function matchesPeriod(post, period) {
  if (period === 'all') return true
  const dateStr = post.scheduledFor || post.publishedAt
  if (!dateStr) return period === 'all'
  const d = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (period === 'today') {
    return d >= today && d < new Date(today.getTime() + 86400000)
  }
  if (period === 'week') {
    const weekStart = new Date(today.getTime() - today.getDay() * 86400000)
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400000)
    return d >= weekStart && d < weekEnd
  }
  if (period === 'month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }
  if (period === 'past') {
    return d < today
  }
  return true
}

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedNetworks, setSelectedNetworks] = useState([])
  const [period, setPeriod] = useState('all')
  const [view, setView] = useState('list')          // 'list' | 'calendar'
  const [reviewingPost, setReviewingPost] = useState(null)

  useEffect(() => {
    getAllPosts().then(setPosts)
  }, [])

  // Conta posts por status (pros tabs)
  const counts = useMemo(() => {
    const c = { all: posts.length }
    posts.forEach(p => { c[p.status] = (c[p.status] || 0) + 1 })
    return c
  }, [posts])

  // Aplica todos os filtros em cascata
  const filtered = useMemo(() => {
    let list = posts

    // Tab de status
    if (activeTab !== 'all') list = list.filter(p => p.status === activeTab)

    // Filtro de redes (post precisa ter pelo menos UMA das redes selecionadas)
    if (selectedNetworks.length > 0) {
      list = list.filter(p => p.networks?.some(n => selectedNetworks.includes(n)))
    }

    // Filtro de período
    list = list.filter(p => matchesPeriod(p, period))

    // Busca textual
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      )
    }

    return list
  }, [posts, activeTab, selectedNetworks, period, query])

  const handleAction = (action, post) => {
    if (action === 'delete') {
      if (!window.confirm(`Excluir "${post.title}"?`)) return
      setPosts(prev => prev.filter(p => p.id !== post.id))
    } else if (action === 'duplicate') {
      setPosts(prev => [
        { ...post, id: `${post.id}-copy-${Date.now()}`, title: `${post.title} (cópia)`, status: 'draft' },
        ...prev,
      ])
    } else if (action === 'submit') {
      setPosts(prev => prev.map(p => p.id === post.id
        ? { ...p, status: 'pending', submittedAt: new Date().toISOString() }
        : p
      ))
    } else if (action === 'approve' || action === 'reject') {
      setReviewingPost(post)
    }
  }

  const handleApprovalDecision = (decision, updatedPost) => {
    if (decision === 'approve') {
      setPosts(prev => prev.map(p => p.id === updatedPost.id
        ? { ...p, status: 'scheduled', approvedAt: new Date().toISOString(), comments: updatedPost.comments }
        : p
      ))
    } else if (decision === 'reject') {
      setPosts(prev => prev.map(p => p.id === updatedPost.id
        ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString(), comments: updatedPost.comments }
        : p
      ))
    }
  }

  return (
    <div className="posts-page">
      <PostsHeader query={query} onQueryChange={setQuery} />

      <StatusTabs active={activeTab} onChange={setActiveTab} counts={counts} />

      <PostsFilters
        selectedNetworks={selectedNetworks}
        onNetworksChange={setSelectedNetworks}
        period={period}
        onPeriodChange={setPeriod}
        view={view}
        onViewChange={setView}
      />

      {view === 'calendar' ? (
        <PostsCalendar
          posts={filtered}
          onReview={setReviewingPost}
        />
      ) : (
        <div className="posts-page__list">
          {filtered.length === 0 ? (
            <motion.div
              className="posts-page__empty"
              variants={fadeUp} initial="hidden" animate="visible"
            >
              <div className="posts-page__empty-icon"><LuInbox size={32} /></div>
              <h3>
                {query
                  ? `Nenhum post encontrado para "${query}"`
                  : 'Nenhum post nessa categoria ainda'}
              </h3>
              <p>
                {activeTab === 'draft'   && 'Crie um novo post e salve como rascunho pra começar.'}
                {activeTab === 'pending' && 'Quando um editor enviar um post para revisão, ele aparece aqui.'}
                {activeTab === 'scheduled' && 'Agende um post pelo botão "Novo post" pra vê-lo aqui.'}
                {activeTab === 'published' && 'Seus posts publicados aparecem aqui com suas métricas.'}
                {(activeTab === 'all' || activeTab === 'failed') && !query && 'Comece criando seu primeiro post.'}
                {query && 'Tente outros termos ou limpe a busca.'}
              </p>
            </motion.div>
          ) : (
            filtered.map((post, i) => (
              <motion.div
                key={post.id}
                variants={fadeUp} initial="hidden" animate="visible" custom={i}
              >
                <PostListItem
                  post={post}
                  onAction={handleAction}
                  onReview={post.status === 'pending' ? () => setReviewingPost(post) : null}
                />
              </motion.div>
            ))
          )}
        </div>
      )}

      <ApprovalDrawer
        post={reviewingPost}
        isOpen={Boolean(reviewingPost)}
        onClose={() => setReviewingPost(null)}
        onAction={handleApprovalDecision}
      />
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { LuInbox } from 'react-icons/lu'
import { getAllPosts } from '../../../services/posts'
import { dashFadeUp as fadeUp } from '../../../styles/animations'
import PostsHeader from './components/PostsHeader'
import StatusTabs from './components/StatusTabs'
import PostListItem from './components/PostListItem'
import './Posts.css'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getAllPosts().then(setPosts)
  }, [])

  // Conta posts por status pra mostrar nos tabs
  const counts = useMemo(() => {
    const c = { all: posts.length }
    posts.forEach(p => { c[p.status] = (c[p.status] || 0) + 1 })
    return c
  }, [posts])

  // Filtra por tab + busca
  const filtered = useMemo(() => {
    let list = posts
    if (activeTab !== 'all') list = list.filter(p => p.status === activeTab)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      )
    }
    return list
  }, [posts, activeTab, query])

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
    } else if (action === 'approve') {
      setPosts(prev => prev.map(p => p.id === post.id
        ? { ...p, status: 'scheduled', approvedAt: new Date().toISOString() }
        : p
      ))
    } else if (action === 'reject') {
      const reason = window.prompt('Motivo da rejeição (opcional):') || ''
      setPosts(prev => prev.map(p => p.id === post.id
        ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString(), comments: [...p.comments, { id: Date.now(), author: 'Você', text: reason, createdAt: new Date().toISOString() }] }
        : p
      ))
    }
    // 'edit' é tratado direto no PostListItem via navigate
  }

  return (
    <div className="posts-page">
      <PostsHeader query={query} onQueryChange={setQuery} />

      <StatusTabs active={activeTab} onChange={setActiveTab} counts={counts} />

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
              <PostListItem post={post} onAction={handleAction} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

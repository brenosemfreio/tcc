import { useNavigate } from 'react-router-dom'
import {
  LuImage, LuVideo, LuLayoutGrid, LuFileText,
  LuEye, LuHeart, LuMessageCircle,
} from 'react-icons/lu'
import StatusBadge from './StatusBadge'
import NetworkPills from './NetworkPills'
import PostMenu from './PostMenu'

const TYPE_ICONS = {
  reel:     LuVideo,
  carousel: LuLayoutGrid,
  image:    LuImage,
  post:     LuFileText,
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function relativeDate(iso, status) {
  if (!iso) return ''
  const d = new Date(iso)
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (status === 'published') return `Publicado em ${date} · ${time}`
  if (status === 'scheduled') return `Agendado para ${date} · ${time}`
  if (status === 'failed')    return `Tentativa em ${date} · ${time}`
  if (status === 'pending')   return `Submetido em ${date} · ${time}`
  return `${date} · ${time}`
}

export default function PostListItem({ post, onAction }) {
  const navigate = useNavigate()
  const TypeIcon = TYPE_ICONS[post.type] || LuFileText

  const dateRef =
    post.status === 'published' ? post.publishedAt :
    post.status === 'pending'   ? post.submittedAt :
    post.status === 'failed'    ? post.scheduledFor :
                                  post.scheduledFor

  const handleEdit = () => navigate(`/dashboard/posts/${post.id}/editar`)

  return (
    <div className={`post-row post-row--${post.status}`}>
      {/* Thumb / placeholder */}
      <div className="post-row__thumb">
        <TypeIcon size={22} />
      </div>

      {/* Body */}
      <div className="post-row__body">
        <div className="post-row__head">
          <h3 className="post-row__title" onClick={handleEdit}>{post.title}</h3>
          <StatusBadge status={post.status} />
        </div>
        <p className="post-row__content">{post.content}</p>
        <div className="post-row__meta">
          <NetworkPills networks={post.networks} size={13} />
          <span className="post-row__sep">·</span>
          <span className="post-row__date">{relativeDate(dateRef, post.status)}</span>
          {post.author && (
            <>
              <span className="post-row__sep">·</span>
              <span className="post-row__author" title={post.author.email}>
                {post.author.name}
              </span>
            </>
          )}
        </div>

        {/* Métricas compactas só pra publicados */}
        {post.status === 'published' && post.metrics && (
          <div className="post-row__metrics">
            <span><LuEye size={12} /> {(post.metrics.views / 1000).toFixed(1)}K</span>
            <span><LuHeart size={12} /> {post.metrics.likes}</span>
            <span><LuMessageCircle size={12} /> {post.metrics.comments}</span>
          </div>
        )}

        {/* Razão da falha */}
        {post.status === 'failed' && post.failureReason && (
          <div className="post-row__alert">{post.failureReason}</div>
        )}
      </div>

      {/* Menu */}
      <div className="post-row__actions">
        <PostMenu
          post={post}
          onEdit={() => onAction('edit', post)}
          onDuplicate={() => onAction('duplicate', post)}
          onDelete={() => onAction('delete', post)}
          onSubmit={() => onAction('submit', post)}
          onApprove={() => onAction('approve', post)}
          onReject={() => onAction('reject', post)}
        />
      </div>
    </div>
  )
}

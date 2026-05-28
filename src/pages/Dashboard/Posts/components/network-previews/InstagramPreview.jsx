import { LuHeart, LuMessageCircle, LuSend, LuBookmark, LuPlay, LuImage } from 'react-icons/lu'

const handle = (user) => (user?.name || 'voce').toLowerCase().replace(/\s+/g, '_')

export default function InstagramPreview({ type = 'feed', content, user }) {
  const username = handle(user)
  const isVertical = type === 'reel' || type === 'story'
  const isStory = type === 'story'
  const isCarousel = type === 'carousel'

  // Story tem layout diferente — quase fullscreen, texto sobreposto
  if (isStory) {
    return (
      <div className="np-ig np-ig--story">
        <div className="np-ig__story-header">
          <div className="np-ig__avatar">{(user?.name?.[0] || 'V').toUpperCase()}</div>
          <span>{username}</span>
          <span className="np-ig__story-time">agora</span>
        </div>
        <div className="np-ig__story-bar"><span /></div>
        <div className="np-ig__story-media">
          <LuImage size={48} />
        </div>
        {content && (
          <div className="np-ig__story-text">{content.split('\n')[0]}</div>
        )}
      </div>
    )
  }

  return (
    <div className="np-ig">
      {/* Header */}
      <div className="np-ig__header">
        <div className="np-ig__avatar">{(user?.name?.[0] || 'V').toUpperCase()}</div>
        <div className="np-ig__user">
          <strong>{username}</strong>
          <span>Original audio</span>
        </div>
        <span className="np-ig__more">⋯</span>
      </div>

      {/* Mídia */}
      <div className={`np-ig__media np-ig__media--${isVertical ? 'vert' : 'square'}`}>
        {type === 'reel' && <LuPlay size={36} className="np-ig__play" />}
        {!isVertical && <LuImage size={36} />}
        {isCarousel && <span className="np-ig__indicator">1/3</span>}
      </div>

      {/* Ações */}
      <div className="np-ig__actions">
        <LuHeart size={22} />
        <LuMessageCircle size={22} />
        <LuSend size={22} />
        <LuBookmark size={22} className="np-ig__save" />
      </div>

      <div className="np-ig__likes">12.345 curtidas</div>

      {/* Caption */}
      {content && (
        <div className="np-ig__caption">
          <strong>{username}</strong>{' '}
          <span>{content}</span>
        </div>
      )}
    </div>
  )
}

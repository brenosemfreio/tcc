import { LuThumbsUp, LuMessageCircle, LuShare2, LuImage, LuPlay, LuEarth } from 'react-icons/lu'

export default function FacebookPreview({ type = 'post', content, user }) {
  const name = user?.name || 'Você'
  const isReel = type === 'reel'

  return (
    <div className={`np-fb${isReel ? ' np-fb--reel' : ''}`}>
      {/* Header */}
      <div className="np-fb__header">
        <div className="np-fb__avatar">{name[0]}</div>
        <div className="np-fb__user">
          <strong>{name}</strong>
          <span>agora · <LuEarth size={10} /></span>
        </div>
      </div>

      {/* Texto */}
      {content && (
        <div className="np-fb__text">
          {content.split('\n').map((line, i) => <p key={i}>{line || ' '}</p>)}
        </div>
      )}

      {/* Mídia */}
      <div className={`np-fb__media np-fb__media--${isReel ? 'vert' : 'square'}`}>
        {isReel ? <LuPlay size={36} /> : <LuImage size={36} />}
      </div>

      {/* Contadores */}
      <div className="np-fb__counts">
        <span>👍❤️ 234</span>
        <span>12 comentários · 5 compartilhamentos</span>
      </div>

      {/* Ações */}
      <div className="np-fb__actions">
        <button><LuThumbsUp size={16} /> Curtir</button>
        <button><LuMessageCircle size={16} /> Comentar</button>
        <button><LuShare2 size={16} /> Compartilhar</button>
      </div>
    </div>
  )
}

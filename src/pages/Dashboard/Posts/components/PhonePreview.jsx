import { useState, useEffect } from 'react'
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaLinkedin } from 'react-icons/fa'
import { NETWORK_META } from '../../../../services/posts'
import InstagramPreview from './network-previews/InstagramPreview'
import TiktokPreview from './network-previews/TiktokPreview'
import YoutubePreview from './network-previews/YoutubePreview'
import FacebookPreview from './network-previews/FacebookPreview'
import LinkedinPreview from './network-previews/LinkedinPreview'
import './network-previews/styles.css'

const ICONS = {
  instagram: FaInstagram,
  tiktok:    FaTiktok,
  youtube:   FaYoutube,
  facebook:  FaFacebook,
  linkedin:  FaLinkedin,
}

const PREVIEWS = {
  instagram: InstagramPreview,
  tiktok:    TiktokPreview,
  youtube:   YoutubePreview,
  facebook:  FacebookPreview,
  linkedin:  LinkedinPreview,
}

export default function PhonePreview({ networks, typesByNetwork, title, content, user }) {
  const [activeIdx, setActiveIdx] = useState(0)

  // Se a rede ativa for removida, volta pra primeira disponível
  useEffect(() => {
    if (activeIdx >= networks.length) setActiveIdx(0)
  }, [networks, activeIdx])

  // Estado vazio — nenhuma rede selecionada
  if (networks.length === 0) {
    return (
      <div className="phone-preview">
        <div className="phone-preview__empty">
          <div className="phone-preview__frame phone-preview__frame--empty">
            <div className="phone-preview__notch" />
            <div className="phone-preview__screen phone-preview__screen--empty">
              <p>Escolha uma rede pra ver o preview</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeNetwork = networks[activeIdx]
  const activeType = typesByNetwork[activeNetwork]
  const Preview = PREVIEWS[activeNetwork]
  const meta = NETWORK_META[activeNetwork]

  return (
    <div className="phone-preview">
      {/* Tabs das redes selecionadas */}
      {networks.length > 1 && (
        <div className="phone-preview__tabs">
          {networks.map((n, i) => {
            const Icon = ICONS[n]
            const m = NETWORK_META[n]
            return (
              <button
                key={n}
                type="button"
                className={`phone-preview__tab${i === activeIdx ? ' phone-preview__tab--active' : ''}`}
                onClick={() => setActiveIdx(i)}
                style={i === activeIdx ? { color: m?.color } : {}}
                title={m?.label}
              >
                <Icon size={16} />
              </button>
            )
          })}
        </div>
      )}

      {/* Phone frame */}
      <div className="phone-preview__frame">
        <div className="phone-preview__notch" />
        <div className="phone-preview__screen">
          {Preview && (
            <Preview
              type={activeType}
              title={title}
              content={content}
              user={user}
            />
          )}
        </div>
      </div>

      {/* Rótulo embaixo */}
      <span className="phone-preview__label" style={{ color: meta?.color }}>
        {meta?.label} · {meta?.types.find(t => t.id === activeType)?.label || ''}
      </span>
    </div>
  )
}

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LuSearch, LuFileText, LuHash, LuLayoutDashboard,
  LuSettings, LuSparkles, LuArrowRight, LuPlus,
} from 'react-icons/lu'
import './SearchModal.css'

// Catálogo mock de coisas pesquisáveis. Cada item tem categoria, label,
// uma ação a executar e ícone.
const buildCatalog = ({ navigate, onNewPost }) => ([
  // Comandos
  { id: 'cmd-1', cat: 'Comandos', label: 'Novo post',           icon: LuPlus,             action: () => onNewPost() },
  { id: 'cmd-2', cat: 'Comandos', label: 'Ir para o Dashboard', icon: LuLayoutDashboard,  action: () => navigate('/dashboard') },
  { id: 'cmd-3', cat: 'Comandos', label: 'Configurações',       icon: LuSettings,         action: () => navigate('/dashboard/configuracoes') },
  // Posts (mock)
  { id: 'p-1', cat: 'Publicações', label: '5 dicas para aumentar seu engajamento', icon: LuFileText, action: () => navigate('/dashboard') },
  { id: 'p-2', cat: 'Publicações', label: 'Seus Reels alcançaram 2 do nada',       icon: LuFileText, action: () => navigate('/dashboard') },
  { id: 'p-3', cat: 'Publicações', label: 'Como criar conteúdo que conecta',       icon: LuFileText, action: () => navigate('/dashboard') },
  { id: 'p-4', cat: 'Publicações', label: 'Checklist para posts de sucesso',       icon: LuFileText, action: () => navigate('/dashboard') },
  // Hashtags
  { id: 'h-1', cat: 'Hashtags', label: '#marketingdigital', icon: LuHash, action: () => {} },
  { id: 'h-2', cat: 'Hashtags', label: '#conteudo',         icon: LuHash, action: () => {} },
  { id: 'h-3', cat: 'Hashtags', label: '#redessociais',     icon: LuHash, action: () => {} },
  { id: 'h-4', cat: 'Hashtags', label: '#empreendedorismo', icon: LuHash, action: () => {} },
  // IA
  { id: 'ai-1', cat: 'IA', label: 'Gerar legenda com IA',     icon: LuSparkles, action: () => onNewPost() },
  { id: 'ai-2', cat: 'IA', label: 'Sugerir hashtags',         icon: LuSparkles, action: () => {} },
  { id: 'ai-3', cat: 'IA', label: 'Variações da última post', icon: LuSparkles, action: () => {} },
])

export default function SearchModal({ isOpen, onClose, onNewPost }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const catalog = useMemo(
    () => buildCatalog({ navigate, onNewPost: () => { onClose(); onNewPost() } }),
    [navigate, onNewPost, onClose]
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catalog.slice(0, 8) // mostra alguns por padrão
    return catalog.filter(item => item.label.toLowerCase().includes(q))
  }, [query, catalog])

  // Agrupa por categoria preservando a ordem dos resultados
  const grouped = useMemo(() => {
    const map = new Map()
    results.forEach((item, idx) => {
      if (!map.has(item.cat)) map.set(item.cat, [])
      map.get(item.cat).push({ ...item, _index: idx })
    })
    return Array.from(map.entries())
  }, [results])

  // Reseta state ao abrir e foca o input
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Navegação por teclado dentro do modal
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive(a => Math.min(results.length - 1, a + 1))
      }
      else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive(a => Math.max(0, a - 1))
      }
      else if (e.key === 'Enter') {
        e.preventDefault()
        const item = results[active]
        if (item) {
          item.action()
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, results, active, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="search-modal-root">
          <motion.div
            className="search-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="search-modal"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label="Pesquisar"
          >
            <div className="search-modal__input-wrap">
              <LuSearch size={18} />
              <input
                ref={inputRef}
                className="search-modal__input"
                type="search"
                placeholder="O que você procura?"
                value={query}
                onChange={e => { setQuery(e.target.value); setActive(0) }}
              />
              <kbd className="search-modal__kbd">esc</kbd>
            </div>

            <div className="search-modal__results">
              {results.length === 0 ? (
                <div className="search-modal__empty">
                  Nenhum resultado para "{query}"
                </div>
              ) : (
                grouped.map(([cat, items]) => (
                  <div key={cat} className="search-modal__group">
                    <span className="search-modal__group-label">{cat}</span>
                    {items.map(item => {
                      const Icon = item.icon
                      const isActive = item._index === active
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`search-modal__item${isActive ? ' search-modal__item--active' : ''}`}
                          onMouseEnter={() => setActive(item._index)}
                          onClick={() => { item.action(); onClose() }}
                        >
                          <Icon size={15} className="search-modal__item-icon" />
                          <span>{item.label}</span>
                          {isActive && <LuArrowRight size={13} className="search-modal__item-arrow" />}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="search-modal__footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
              <span><kbd>↵</kbd> selecionar</span>
              <span><kbd>esc</kbd> fechar</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

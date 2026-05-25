import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuLayoutDashboard, LuShare2, LuSquarePen,
  LuSettings, LuCircleHelp, LuSun, LuMoon,
  LuLogOut, LuChevronLeft, LuChevronRight, LuSearch,
} from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { getInitials } from '../../utils/string'
import logoHub from '../../assets/images/logo-hub.png'
import logoHubIcon from '../../assets/images/logo-hub-icon.png'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LuLayoutDashboard, label: 'Dashboard', end: true },
]

const BOTTOM_ITEMS = [
  { to: '/dashboard/configuracoes', icon: LuSettings, label: 'Configurações' },
]

export default function Sidebar({ isCollapsed, onToggle, onNewPost, onOpenSearch }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.aside
      className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}
      animate={{ width: isCollapsed ? 68 : 240 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Toggle */}
      <button className="sidebar__toggle" onClick={onToggle} aria-label="Colapsar menu">
        {isCollapsed ? <LuChevronRight size={16} /> : <LuChevronLeft size={16} />}
      </button>

      {/* Logo — clicável, volta pro dashboard. Troca a imagem conforme estado da sidebar */}
      <Link to="/dashboard" className="sidebar__logo" aria-label="Ir para o Dashboard">
        <img
          src={isCollapsed ? logoHubIcon : logoHub}
          alt="HubStudio"
          className="sidebar__logo-img"
        />
      </Link>

      {/* Search trigger — abre o modal global de busca (Ctrl+K) */}
      <button
        type="button"
        className="sidebar__search"
        onClick={onOpenSearch}
        aria-label="Abrir busca"
        data-tooltip="Pesquisar (Ctrl+K)"
      >
        <LuSearch size={16} />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              className="sidebar__search-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              Pesquisar
              <kbd>Ctrl K</kbd>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Main nav */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            data-tooltip={label}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
            }
          >
            <Icon size={20} className="sidebar__item-icon" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="sidebar__item-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* Posts (abre o modal de novo post) */}
        <button
          className="sidebar__item sidebar__item--post"
          onClick={onNewPost}
          data-tooltip="Posts"
        >
          <LuSquarePen size={20} className="sidebar__item-icon" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="sidebar__item-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Posts
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Divider */}
      <div className="sidebar__divider" />

      {/* Bottom nav */}
      <nav className="sidebar__nav sidebar__nav--bottom">
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            data-tooltip={label}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
            }
          >
            <Icon size={20} className="sidebar__item-icon" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="sidebar__item-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* Suporte — botão simples (não rota) pra evitar highlight de "ativo" pelo hash */}
        <button
          type="button"
          className="sidebar__item"
          onClick={() => { window.location.href = 'mailto:suporte@hubstudio.com' }}
          data-tooltip="Suporte"
        >
          <LuCircleHelp size={20} className="sidebar__item-icon" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="sidebar__item-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Suporte
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Theme toggle — horizontal quando expandido, vertical quando colapsado */}
        <div className={`sidebar__theme ${isCollapsed ? 'sidebar__theme--collapsed' : ''}`}>
          <div className={`sidebar__theme-toggle ${isCollapsed ? 'sidebar__theme-toggle--vertical' : ''}`}>
            <button
              className={`sidebar__theme-btn ${theme === 'light' ? 'sidebar__theme-btn--active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
              aria-label="Modo claro"
              data-tooltip="Modo claro"
            >
              <LuSun size={14} />
              {!isCollapsed && <span>Claro</span>}
            </button>
            <button
              className={`sidebar__theme-btn ${theme === 'dark' ? 'sidebar__theme-btn--active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
              aria-label="Modo escuro"
              data-tooltip="Modo escuro"
            >
              <LuMoon size={14} />
              {!isCollapsed && <span>Escuro</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="sidebar__user">
        <div className="sidebar__avatar">
          {getInitials(user?.name)}
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="sidebar__user-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="sidebar__user-name">{user?.name}</span>
              <span className="sidebar__user-email">{user?.email}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="sidebar__logout"
          onClick={handleLogout}
          title="Sair"
        >
          <LuLogOut size={17} />
        </button>
      </div>
    </motion.aside>
  )
}

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

// Duração e easing usados em TODAS as transições da sidebar — mantém tudo sincronizado
const SIDEBAR_DUR = 0.32
const SIDEBAR_EASE = [0.32, 0.72, 0, 1]

const labelTransition = { duration: SIDEBAR_DUR, ease: SIDEBAR_EASE }
const labelVariants = {
  hidden:  { opacity: 0, x: -8, transition: labelTransition },
  visible: { opacity: 1, x: 0,  transition: labelTransition },
}

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
      transition={{ duration: SIDEBAR_DUR, ease: SIDEBAR_EASE }}
    >
      {/* Toggle */}
      <button className="sidebar__toggle" onClick={onToggle} aria-label="Colapsar menu">
        <motion.span
          key={isCollapsed ? 'right' : 'left'}
          initial={{ rotate: 180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.22 }}
          style={{ display: 'inline-flex' }}
        >
          {isCollapsed ? <LuChevronRight size={16} /> : <LuChevronLeft size={16} />}
        </motion.span>
      </button>

      {/* Logo — crossfade entre as duas versões */}
      <Link to="/dashboard" className="sidebar__logo" aria-label="Ir para o Dashboard">
        <div className="sidebar__logo-stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={isCollapsed ? 'icon' : 'full'}
              src={isCollapsed ? logoHubIcon : logoHub}
              alt="HubStudio"
              className="sidebar__logo-img"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.24, ease: SIDEBAR_EASE }}
            />
          </AnimatePresence>
        </div>
      </Link>

      {/* Search trigger */}
      <button
        type="button"
        className="sidebar__search"
        onClick={onOpenSearch}
        aria-label="Abrir busca"
        data-tooltip="Pesquisar (Ctrl+K)"
      >
        <LuSearch size={16} className="sidebar__search-icon" />
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.span
              className="sidebar__search-label"
              variants={labelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
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
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  className="sidebar__item-label"
                  variants={labelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* Posts (abre o modal) */}
        <button
          className="sidebar__item sidebar__item--post"
          onClick={onNewPost}
          data-tooltip="Posts"
        >
          <LuSquarePen size={20} className="sidebar__item-icon" />
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                className="sidebar__item-label"
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
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
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  className="sidebar__item-label"
                  variants={labelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* Suporte */}
        <button
          type="button"
          className="sidebar__item"
          onClick={() => { window.location.href = 'mailto:suporte@hubstudio.com' }}
          data-tooltip="Suporte"
        >
          <LuCircleHelp size={20} className="sidebar__item-icon" />
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                className="sidebar__item-label"
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                Suporte
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Theme toggle */}
        <div className={`sidebar__theme ${isCollapsed ? 'sidebar__theme--collapsed' : ''}`}>
          <div className={`sidebar__theme-toggle ${isCollapsed ? 'sidebar__theme-toggle--vertical' : ''}`}>
            <button
              className={`sidebar__theme-btn ${theme === 'light' ? 'sidebar__theme-btn--active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
              aria-label="Modo claro"
              data-tooltip="Modo claro"
            >
              <LuSun size={14} />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    Claro
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              className={`sidebar__theme-btn ${theme === 'dark' ? 'sidebar__theme-btn--active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
              aria-label="Modo escuro"
              data-tooltip="Modo escuro"
            >
              <LuMoon size={14} />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    Escuro
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="sidebar__user">
        <div className="sidebar__avatar">
          {getInitials(user?.name)}
        </div>
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              className="sidebar__user-info"
              variants={labelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <span className="sidebar__user-name">{user?.name}</span>
              <span className="sidebar__user-email">{user?.email}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.button
              className="sidebar__logout"
              onClick={handleLogout}
              title="Sair"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={labelTransition}
            >
              <LuLogOut size={17} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}

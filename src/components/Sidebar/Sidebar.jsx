import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuLayoutDashboard, LuShare2, LuPenSquare,
  LuSettings, LuHelpCircle, LuSun, LuMoon,
  LuLogOut, LuChevronLeft, LuChevronRight,
} from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/dashboard',        icon: LuLayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/redes',  icon: LuShare2,          label: 'Suas redes' },
]

const BOTTOM_ITEMS = [
  { to: '/dashboard/configuracoes', icon: LuSettings,     label: 'Configurações' },
  { to: '#suporte',                 icon: LuHelpCircle,   label: 'Suporte' },
]

export default function Sidebar({ isCollapsed, onToggle, onNewPost }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

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

      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L7 10H11V17H17V10H21L14 3Z" fill="currentColor"/>
            <path d="M6 13L3 16V14.5H10V18H3V19.5H6L3 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M22 13L25 16V14.5H18V18H25V19.5H22L25 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="sidebar__logo-text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="sidebar__logo-name">
                <b>hub</b>studio
              </span>
              <span className="sidebar__plan-badge">PRO</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main nav */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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

        {/* Novo post */}
        <button
          className="sidebar__item sidebar__item--post"
          onClick={onNewPost}
        >
          <LuPenSquare size={20} className="sidebar__item-icon" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="sidebar__item-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Novo post
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

        {/* Theme toggle */}
        <div className={`sidebar__theme ${isCollapsed ? 'sidebar__theme--collapsed' : ''}`}>
          {isCollapsed ? (
            <button
              className="sidebar__item sidebar__item--theme-icon"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
            >
              {theme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
            </button>
          ) : (
            <div className="sidebar__theme-toggle">
              <button
                className={`sidebar__theme-btn ${theme === 'light' ? 'sidebar__theme-btn--active' : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                <LuSun size={14} /> Claro
              </button>
              <button
                className={`sidebar__theme-btn ${theme === 'dark' ? 'sidebar__theme-btn--active' : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                <LuMoon size={14} /> Escuro
              </button>
            </div>
          )}
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

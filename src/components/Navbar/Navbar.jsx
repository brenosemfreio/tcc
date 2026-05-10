import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../Button/Button'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L7 10H11V17H17V10H21L14 3Z" fill="currentColor"/>
              <path d="M6 13L3 16V14.5H10V18H3V19.5H6L3 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M22 13L25 16V14.5H18V18H25V19.5H22L25 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="navbar__logo-text">
            <span>hub</span>
            <span>studio</span>
          </span>
        </Link>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <a href="#funcionalidades" className="navbar__link" onClick={() => setMenuOpen(false)}>Funcionalidades</a>
          <a href="#sobre" className="navbar__link" onClick={() => setMenuOpen(false)}>Sobre</a>
        </nav>

        <div className="navbar__actions">
          <Button variant="outline" size="sm" onClick={() => navigate('/entrar')}>Entrar</Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/cadastro')}>Começar</Button>
        </div>

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

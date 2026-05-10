import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--color-primary-light)" />
        </svg>
      </div>

      <div className="footer__content container">
        <div className="footer__brand">
          <div className="footer__logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L7 10H11V17H17V10H21L14 3Z" fill="currentColor"/>
              <path d="M6 13L3 16V14.5H10V18H3V19.5H6L3 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M22 13L25 16V14.5H18V18H25V19.5H22L25 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="footer__logo-text">
              <b>hub</b><br />studio
            </span>
          </div>
          <p className="footer__tagline">Método de organização do<br />pensamento criativo.</p>
        </div>

        <div className="footer__links">
          <h4>Links</h4>
          <ul>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#funcionalidades">Funcionalidades</a></li>
            <li><a href="#">Termos</a></li>
          </ul>
        </div>

        <div className="footer__contact">
          <h4>Contato</h4>
          <p>hubstudio@gmail.com</p>
          <p>(11) 98765-4321</p>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© 2026 HubStudio. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

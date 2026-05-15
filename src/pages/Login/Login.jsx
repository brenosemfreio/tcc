import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LuArrowLeft, LuEye, LuEyeOff, LuStar, LuCircleAlert } from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
import logoHub from '../../assets/images/logo-hub.png'
import './Login.css'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#111827">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Este campo é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'E-mail inválido'
    if (!form.password) next.password = 'Este campo é obrigatório'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const updateField = (key, value) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
    if (globalError) setGlobalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch {
      setGlobalError('E-mail ou senha inválidos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      {/* ─── ESQUERDA — Showcase (3 zonas) ─── */}
      <aside className="auth__showcase">
        <div className="auth__blob auth__blob--1" aria-hidden="true" />
        <div className="auth__blob auth__blob--2" aria-hidden="true" />

        {/* Zona 1 */}
        <Link to="/" className="auth__logo" aria-label="HubStudio — página inicial">
          <img src={logoHub} alt="HubStudio" className="auth__logo-img" />
        </Link>

        {/* Zona 2 */}
        <div className="auth__headline-zone">
          <h2 className="auth__headline">
            Continue construindo<br />
            <span className="auth__headline-accent">sua presença digital.</span>
          </h2>
        </div>

        {/* Zona 3 — depoimento */}
        <blockquote className="auth__bottom-card">
          <div className="auth__stars" aria-label="5 estrelas">
            {[...Array(5)].map((_, i) => <LuStar key={i} size={14} fill="currentColor" />)}
          </div>
          <p className="auth__testimonial-quote">
            Reduzi 6 horas por semana de trabalho operacional. Agora foco em
            criar conteúdo e os insights de IA cuidam do resto.
          </p>
          <footer className="auth__testimonial-author">
            <span className="auth__testimonial-avatar" aria-hidden="true">JS</span>
            <div>
              <strong>Júlia Sampaio</strong>
              <span>@juliacria</span>
            </div>
          </footer>
        </blockquote>
      </aside>

      {/* ─── DIREITA — Formulário ─── */}
      <section className="auth__pane">
        <Link to="/" className="auth__back" aria-label="Voltar para a página inicial">
          <LuArrowLeft size={14} aria-hidden="true" />
          Voltar
        </Link>

        <motion.div
          className="auth__card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="auth__mobile-logo" aria-hidden="true">
            <img src={logoHub} alt="HubStudio" />
          </div>

          <header className="auth__heading">
            <h1>Entrar na conta</h1>
            <p>Acesse seu painel e continue de onde parou.</p>
          </header>

          <div className="auth__oauth">
            <button type="button" className="auth__oauth-btn" aria-label="Entrar com Google">
              <GoogleIcon />
              Google
            </button>
            <button type="button" className="auth__oauth-btn" aria-label="Entrar com GitHub">
              <GitHubIcon />
              GitHub
            </button>
          </div>

          <div className="auth__divider" role="separator">ou continue com email</div>

          <form onSubmit={handleSubmit} className="auth__form" noValidate>
            <div className="auth__field">
              <div className="auth__input-wrap">
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  className={`auth__input${errors.email ? ' auth__input--error' : ''}`}
                  autoComplete="email"
                  aria-label="E-mail"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="auth__field-error" role="alert">
                  <LuCircleAlert size={12} aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="auth__field">
              <div className="auth__input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  className={`auth__input auth__input--with-action${errors.password ? ' auth__input--error' : ''}`}
                  autoComplete="current-password"
                  aria-label="Senha"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className={`auth__action-btn${showPassword ? ' auth__action-btn--active' : ''}`}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="auth__field-error" role="alert">
                  <LuCircleAlert size={12} aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="auth__row">
              <a href="#" className="auth__forgot">Esqueceu a senha?</a>
            </div>

            {globalError && (
              <p className="auth__field-error" role="alert" style={{ marginTop: 0 }}>
                <LuCircleAlert size={12} aria-hidden="true" />
                {globalError}
              </p>
            )}

            <button type="submit" className="auth__submit" disabled={loading} aria-busy={loading}>
              {loading ? <span className="auth__submit-spinner" aria-hidden="true" /> : 'Entrar'}
            </button>
          </form>

          <p className="auth__switch">
            Não tem uma conta? <Link to="/cadastro">Criar conta grátis</Link>
          </p>
        </motion.div>
      </section>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LuEye, LuEyeOff, LuSparkles, LuArrowLeft, LuCheck,
  LuCircleAlert, LuShieldCheck, LuTrendingUp, LuZap,
} from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/Button/Button'
import logoHub from '../../assets/images/logo-hub.png'
import '../Login/Login.css'

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
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

// Avalia força da senha: 0..4
function calcStrength(pwd) {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return Math.min(score, 4)
}

const STRENGTH_LABELS = ['', 'Muito fraca', 'Fraca', 'Boa', 'Forte']

export default function Cadastro() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const strength = useMemo(() => calcStrength(form.password), [form.password])

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Informe seu nome'
    else if (form.name.trim().length < 2) next.name = 'Nome muito curto'

    if (!form.email) next.email = 'Informe seu e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'E-mail inválido'

    if (!form.password) next.password = 'Crie uma senha'
    else if (form.password.length < 8) next.password = 'Mínimo 8 caracteres'

    if (!form.confirm) next.confirm = 'Confirme sua senha'
    else if (form.confirm !== form.password) next.confirm = 'As senhas não coincidem'

    if (!form.acceptTerms) next.acceptTerms = 'Você precisa aceitar os termos'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (key, value) => {
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
      await register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      })
      navigate('/dashboard')
    } catch {
      setGlobalError('Não foi possível criar sua conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      {/* ── Lado esquerdo: showcase ── */}
      <aside className="auth__showcase" aria-hidden="true">
        <div className="auth__blob auth__blob--1" />
        <div className="auth__blob auth__blob--2" />

        <Link to="/" className="auth__logo" aria-label="HubStudio — ir para a página inicial">
          <img src={logoHub} alt="HubStudio" className="auth__logo-img" />
        </Link>

        <div className="auth__hero">
          <span className="auth__badge">
            <LuSparkles size={12} />
            Grátis para sempre no plano Lite
          </span>
          <h2 className="auth__title">
            Comece hoje a<br />
            <span className="auth__title-accent">simplificar suas redes.</span>
          </h2>
          <p className="auth__lead">
            Em menos de 2 minutos você conecta suas redes, agenda seu primeiro
            post e descobre o que está performando.
          </p>

          {/* Benefícios em vez de social-proof (cadastro) */}
          <ul className="auth__perks" aria-hidden="true">
            <li>
              <span className="auth__perk-icon"><LuZap size={14} /></span>
              <span>Agendamento ilimitado nas redes principais</span>
            </li>
            <li>
              <span className="auth__perk-icon"><LuTrendingUp size={14} /></span>
              <span>Métricas unificadas e insights de IA</span>
            </li>
            <li>
              <span className="auth__perk-icon"><LuShieldCheck size={14} /></span>
              <span>Sem cartão de crédito — cancele quando quiser</span>
            </li>
          </ul>
        </div>

        <div className="auth__proof">
          <div className="auth__proof-avatars">
            <div className="auth__proof-avatar" style={{ background: 'linear-gradient(135deg, #7C5FE8, #4F35E8)' }} />
            <div className="auth__proof-avatar" style={{ background: 'linear-gradient(135deg, #E84FA5, #B44FE8)' }} />
            <div className="auth__proof-avatar" style={{ background: 'linear-gradient(135deg, #4FCEE8, #4F8FE8)' }} />
          </div>
          <div className="auth__proof-text">
            <strong>+1.200 criadores</strong>
            <span>já usam o HubStudio</span>
          </div>
        </div>
      </aside>

      {/* ── Lado direito: formulário ── */}
      <motion.section
        className="auth__form-side"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <Link to="/" className="auth__back">
          <LuArrowLeft size={14} />
          Voltar
        </Link>

        <div className="auth__form-wrap">
          <header className="auth__heading">
            <h1>Criar sua conta</h1>
            <p>Grátis para sempre — sem cartão de crédito.</p>
          </header>

          {/* OAuth */}
          <div className="auth__oauth">
            <button type="button" className="auth__oauth-btn" aria-label="Cadastrar-se com Google">
              <GoogleIcon />
              Google
            </button>
            <button type="button" className="auth__oauth-btn" aria-label="Cadastrar-se com GitHub">
              <GitHubIcon />
              GitHub
            </button>
          </div>

          <div className="auth__divider">ou continue com email</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth__form" noValidate>
            {/* Nome */}
            <div className="auth__field">
              <div className="auth__input-wrap">
                <input
                  id="name"
                  type="text"
                  placeholder=" "
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className={`auth__input${errors.name ? ' auth__input--error' : ''}`}
                  autoComplete="name"
                  aria-label="Nome completo"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                <label htmlFor="name" className="auth__label">Nome completo</label>
              </div>
              {errors.name && (
                <p id="name-error" className="auth__field-error">
                  <LuCircleAlert size={12} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div className="auth__field">
              <div className="auth__input-wrap">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={`auth__input${errors.email ? ' auth__input--error' : ''}`}
                  autoComplete="email"
                  aria-label="E-mail"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                <label htmlFor="email" className="auth__label">E-mail</label>
              </div>
              {errors.email && (
                <p id="email-error" className="auth__field-error">
                  <LuCircleAlert size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="auth__field">
              <div className="auth__input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=" "
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  className={`auth__input auth__input--with-action${errors.password ? ' auth__input--error' : ''}`}
                  autoComplete="new-password"
                  aria-label="Senha"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : 'password-strength'}
                />
                <label htmlFor="password" className="auth__label">Senha</label>
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

              {/* Strength meter */}
              {form.password && (
                <div className="auth__strength" id="password-strength">
                  <div className="auth__strength-bars" aria-hidden="true">
                    {[1, 2, 3, 4].map(i => (
                      <span
                        key={i}
                        className={`auth__strength-bar${i <= strength ? ` auth__strength-bar--active auth__strength--${strength}` : ''}`}
                      />
                    ))}
                  </div>
                  <span className={`auth__strength-label auth__strength-label--${strength}`}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              )}

              {errors.password && (
                <p id="password-error" className="auth__field-error">
                  <LuCircleAlert size={12} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="auth__field">
              <div className="auth__input-wrap">
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder=" "
                  value={form.confirm}
                  onChange={e => handleChange('confirm', e.target.value)}
                  className={`auth__input auth__input--with-action${errors.confirm ? ' auth__input--error' : ''}`}
                  autoComplete="new-password"
                  aria-label="Confirmar senha"
                  aria-invalid={!!errors.confirm}
                  aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                />
                <label htmlFor="confirm" className="auth__label">Confirmar senha</label>
                <button
                  type="button"
                  className={`auth__action-btn${showConfirm ? ' auth__action-btn--active' : ''}`}
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showConfirm ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              </div>
              {errors.confirm && (
                <p id="confirm-error" className="auth__field-error">
                  <LuCircleAlert size={12} />
                  {errors.confirm}
                </p>
              )}
            </div>

            {/* Termos */}
            <label className="auth__checkbox">
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={e => handleChange('acceptTerms', e.target.checked)}
                aria-invalid={!!errors.acceptTerms}
              />
              <span className="auth__checkbox-box">
                <LuCheck size={12} strokeWidth={3} />
              </span>
              <span>
                Eu concordo com os <a href="#" target="_blank" rel="noreferrer">Termos de uso</a> e a{' '}
                <a href="#" target="_blank" rel="noreferrer">Política de privacidade</a>.
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="auth__field-error" style={{ marginTop: '-0.5rem' }}>
                <LuCircleAlert size={12} />
                {errors.acceptTerms}
              </p>
            )}

            {globalError && (
              <div className="auth__error" role="alert">
                <LuCircleAlert size={16} />
                {globalError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="auth__submit"
            >
              Criar conta grátis
            </Button>
          </form>

          <p className="auth__switch">
            Já tem uma conta? <Link to="/entrar">Entrar</Link>
          </p>
        </div>
      </motion.section>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LuArrowLeft, LuEye, LuEyeOff, LuCheck, LuCircleAlert } from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
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
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#111827">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

function calcStrength(pwd) {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return Math.min(score, 4)
}
const STRENGTH_LABELS = ['', 'Fraca', 'Média', 'Boa', 'Forte']

const formContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } },
}
const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function Cadastro() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [isExiting, setIsExiting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const strength = useMemo(() => calcStrength(form.password), [form.password])

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Este campo é obrigatório'
    else if (form.name.trim().length < 2) next.name = 'Nome muito curto'

    if (!form.email.trim()) next.email = 'Este campo é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'E-mail inválido'

    if (!form.password) next.password = 'Este campo é obrigatório'
    else if (form.password.length < 8) next.password = 'Mínimo 8 caracteres'

    if (!form.confirm) next.confirm = 'Confirme sua senha'
    else if (form.confirm !== form.password) next.confirm = 'Senhas não coincidem'

    if (!form.acceptTerms) next.acceptTerms = 'Você precisa aceitar os termos'

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

  const handleSwitch = (e, path) => {
    e.preventDefault()
    setIsExiting(true)
    setTimeout(() => navigate(path), 250)
  }

  return (
    <div className={`auth${isExiting ? ' auth--exiting' : ''}`}>
      {/* ─── LADO ESQUERDO ─── */}
      <div className="auth__left">
        <div className="auth__left-logo">
          <Link to="/" aria-label="HubStudio — página inicial">
            <img src={logoHub} alt="HubStudio" />
          </Link>
        </div>

        <div className="auth__left-headline">
          <h2>
            Comece hoje a simplificar<br />
            <span>suas redes.</span>
          </h2>
        </div>
      </div>

      {/* ─── LADO DIREITO ─── */}
      <div className="auth__right">
        <Link to="/" className="auth__back" aria-label="Voltar para a página inicial">
          <LuArrowLeft size={14} aria-hidden="true" />
          Voltar
        </Link>

        <div className="auth__card">
          <div className="auth__mobile-logo" aria-hidden="true">
            <img src={logoHub} alt="HubStudio" />
          </div>

          <header className="auth__heading">
            <h1>Criar sua conta</h1>
            <p>Grátis para sempre — sem cartão de crédito.</p>
          </header>

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

          <div className="auth__divider" role="separator">ou continue com email</div>

          <motion.form
            onSubmit={handleSubmit}
            className="auth__form"
            noValidate
            variants={formContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Nome */}
            <motion.div className="auth__field" variants={fieldVariants}>
              <div className="auth__input-wrap">
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  className={`auth__input${errors.name ? ' auth__input--error' : ''}`}
                  autoComplete="name"
                  aria-label="Nome completo"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="auth__field-error" role="alert">
                  <LuCircleAlert size={12} aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </motion.div>

            {/* E-mail */}
            <motion.div className="auth__field" variants={fieldVariants}>
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
            </motion.div>

            {/* Senha + força */}
            <motion.div className="auth__field" variants={fieldVariants}>
              <div className="auth__input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  className={`auth__input auth__input--with-action${errors.password ? ' auth__input--error' : ''}`}
                  autoComplete="new-password"
                  aria-label="Senha"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : 'password-strength'}
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

              {form.password && (
                <div className={`auth__strength auth__strength--${strength}`} id="password-strength">
                  <div className="auth__strength-bars" aria-hidden="true">
                    {[1, 2, 3, 4].map(i => (
                      <span key={i} className={`auth__strength-bar${i <= strength ? ' auth__strength-bar--on' : ''}`} />
                    ))}
                  </div>
                  <span className="auth__strength-label">
                    {STRENGTH_LABELS[strength] || 'Fraca'}
                  </span>
                </div>
              )}

              {errors.password && (
                <p id="password-error" className="auth__field-error" role="alert">
                  <LuCircleAlert size={12} aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </motion.div>

            {/* Confirmar */}
            <motion.div className="auth__field" variants={fieldVariants}>
              <div className="auth__input-wrap">
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={form.confirm}
                  onChange={e => updateField('confirm', e.target.value)}
                  className={`auth__input auth__input--with-action${errors.confirm ? ' auth__input--error' : ''}`}
                  autoComplete="new-password"
                  aria-label="Confirmar senha"
                  aria-invalid={!!errors.confirm}
                  aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                />
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
                <p id="confirm-error" className="auth__field-error" role="alert">
                  <LuCircleAlert size={12} aria-hidden="true" />
                  {errors.confirm}
                </p>
              )}
            </motion.div>

            {/* Termos */}
            <motion.label className="auth__checkbox" variants={fieldVariants}>
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={e => updateField('acceptTerms', e.target.checked)}
                aria-invalid={!!errors.acceptTerms}
                aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
              />
              <span className="auth__checkbox-box" aria-hidden="true">
                <LuCheck size={12} strokeWidth={3} />
              </span>
              <span>
                Eu concordo com os{' '}
                <a href="#" target="_blank" rel="noreferrer">Termos de uso</a>
                {' '}e a{' '}
                <a href="#" target="_blank" rel="noreferrer">Política de privacidade</a>.
              </span>
            </motion.label>
            {errors.acceptTerms && (
              <p id="terms-error" className="auth__field-error" role="alert" style={{ marginTop: '-0.375rem' }}>
                <LuCircleAlert size={12} aria-hidden="true" />
                {errors.acceptTerms}
              </p>
            )}

            {globalError && (
              <p className="auth__field-error" role="alert" style={{ marginTop: 0 }}>
                <LuCircleAlert size={12} aria-hidden="true" />
                {globalError}
              </p>
            )}

            <motion.button
              type="submit"
              className="auth__submit"
              disabled={loading}
              aria-busy={loading}
              variants={fieldVariants}
            >
              {loading ? <span className="auth__submit-spinner" aria-hidden="true" /> : 'Criar conta grátis'}
            </motion.button>
          </motion.form>

          <p className="auth__switch">
            Já tem uma conta?{' '}
            <Link to="/entrar" onClick={(e) => handleSwitch(e, '/entrar')}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

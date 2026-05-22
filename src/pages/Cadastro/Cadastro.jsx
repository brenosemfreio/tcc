import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LuArrowLeft, LuEye, LuEyeOff, LuCheck, LuCircleAlert } from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
import { GoogleIcon, FacebookIcon } from '../../components/OAuthIcons/OAuthIcons'
import logoHub from '../../assets/images/logo-hub.png'
import '../../styles/auth.css'

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

        <motion.div
          className="auth__left-headline"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        >
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
          >
            Comece hoje a <span>simplificar</span><br />
            <span>e melhorar</span> suas redes.
          </motion.h2>
        </motion.div>
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
            <button type="button" className="auth__oauth-btn" aria-label="Cadastrar-se com Facebook">
              <FacebookIcon />
              Facebook
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

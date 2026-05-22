import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LuArrowLeft, LuEye, LuEyeOff, LuCircleAlert } from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
import { GoogleIcon, FacebookIcon } from '../../components/OAuthIcons/OAuthIcons'
import logoHub from '../../assets/images/logo-hub.png'
import '../../styles/auth.css'

const formContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } },
}
const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [isExiting, setIsExiting] = useState(false)
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
            Continue construindo<br />
            sua <span>presença digital.</span>
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
            <h1>Entrar na conta</h1>
            <p>Acesse seu painel e continue de onde parou.</p>
          </header>

          <div className="auth__oauth">
            <button type="button" className="auth__oauth-btn" aria-label="Entrar com Google">
              <GoogleIcon />
              Google
            </button>
            <button type="button" className="auth__oauth-btn" aria-label="Entrar com Facebook">
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

            <motion.div className="auth__field" variants={fieldVariants}>
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
            </motion.div>

            <motion.div className="auth__row" variants={fieldVariants}>
              <Link to="/esqueci-senha" className="auth__forgot">Esqueceu a senha?</Link>
            </motion.div>

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
              {loading ? <span className="auth__submit-spinner" aria-hidden="true" /> : 'Entrar'}
            </motion.button>
          </motion.form>

          <p className="auth__switch">
            Não tem uma conta?{' '}
            <Link to="/cadastro" onClick={(e) => handleSwitch(e, '/cadastro')}>
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

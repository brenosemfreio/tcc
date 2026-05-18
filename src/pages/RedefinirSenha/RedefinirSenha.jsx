import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuArrowLeft, LuEye, LuEyeOff, LuLockOpen, LuCircleAlert,
} from 'react-icons/lu'
import logoHub from '../../assets/images/logo-hub.png'
import '../EsqueciSenha/EsqueciSenha.css'

const viewVariants = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.2, ease: 'easeIn' } },
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

export default function RedefinirSenha() {
  const [view, setView] = useState('form')   // 'form' | 'success'
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()
  // Token lido da URL — incluído na "chamada de API". Não validado no front.
  const token = searchParams.get('token') || ''

  const navigate = useNavigate()

  const strength = useMemo(() => calcStrength(form.password), [form.password])

  const particles = useMemo(() => Array.from({ length: 14 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 4 + Math.random() * 6,
    opacity: 0.04 + Math.random() * 0.08,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 5,
  })), [])

  const validate = () => {
    const next = {}
    if (!form.password) next.password = 'Este campo é obrigatório'
    else if (form.password.length < 8) next.password = 'Mínimo 8 caracteres'

    if (!form.confirm) next.confirm = 'Confirme sua nova senha'
    else if (form.confirm !== form.password) next.confirm = 'As senhas não coincidem'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const updateField = (key, value) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simula chamada de API com o token + nova senha
    // (futuramente: await api.resetPassword({ token, password: form.password }))
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setView('success')
  }

  return (
    <div className="recovery">
      <div className="recovery__blob recovery__blob--1" aria-hidden="true" />
      <div className="recovery__blob recovery__blob--2" aria-hidden="true" />

      <div className="recovery__particles" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className="recovery__particle"
            style={{
              left: `${p.left}%`,
              top:  `${p.top}%`,
              width:  `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              '--delay': `${p.delay}s`,
              '--dur':   `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <Link to="/" className="recovery__back" aria-label="Voltar para a página inicial">
        <LuArrowLeft size={14} aria-hidden="true" />
        Voltar
      </Link>

      <div className="recovery__shell">
        <Link to="/" className="recovery__logo" aria-label="HubStudio — página inicial">
          <img src={logoHub} alt="HubStudio" className="recovery__logo-img" />
        </Link>

        <div className="recovery__card">
          <AnimatePresence mode="wait" initial={false}>
            {view === 'form' && (
              <motion.div
                key="form"
                className="recovery__view"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="recovery__icon" aria-hidden="true">
                  <LuLockOpen size={32} />
                </div>

                <header className="recovery__heading">
                  <h1>Criar nova senha</h1>
                  <p>Sua nova senha deve ter pelo menos 8 caracteres.</p>
                </header>

                <form onSubmit={handleSubmit} className="recovery__form" noValidate>
                  {/* Token oculto — incluído quando o backend for plugado */}
                  <input type="hidden" name="token" value={token} />

                  {/* Nova senha + strength */}
                  <div className="recovery__field">
                    <div className="recovery__input-wrap">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={form.password}
                        onChange={e => updateField('password', e.target.value)}
                        className={`recovery__input recovery__input--with-action${errors.password ? ' recovery__input--error' : ''}`}
                        autoComplete="new-password"
                        aria-label="Nova senha"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : 'password-strength'}
                      />
                      <button
                        type="button"
                        className={`recovery__action-btn${showPassword ? ' recovery__action-btn--active' : ''}`}
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        tabIndex={-1}
                      >
                        {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                      </button>
                    </div>

                    {form.password && (
                      <div className={`recovery__strength recovery__strength--${strength}`} id="password-strength">
                        <div className="recovery__strength-bars" aria-hidden="true">
                          {[1, 2, 3, 4].map(i => (
                            <span key={i} className={`recovery__strength-bar${i <= strength ? ' recovery__strength-bar--on' : ''}`} />
                          ))}
                        </div>
                        <span className="recovery__strength-label">
                          {STRENGTH_LABELS[strength] || 'Fraca'}
                        </span>
                      </div>
                    )}

                    {errors.password && (
                      <p id="password-error" className="recovery__field-error" role="alert">
                        <LuCircleAlert size={12} aria-hidden="true" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirmar nova senha */}
                  <div className="recovery__field">
                    <div className="recovery__input-wrap">
                      <input
                        id="confirm"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirme sua nova senha"
                        value={form.confirm}
                        onChange={e => updateField('confirm', e.target.value)}
                        className={`recovery__input recovery__input--with-action${errors.confirm ? ' recovery__input--error' : ''}`}
                        autoComplete="new-password"
                        aria-label="Confirmar nova senha"
                        aria-invalid={!!errors.confirm}
                        aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                      />
                      <button
                        type="button"
                        className={`recovery__action-btn${showConfirm ? ' recovery__action-btn--active' : ''}`}
                        onClick={() => setShowConfirm(v => !v)}
                        aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                        tabIndex={-1}
                      >
                        {showConfirm ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                      </button>
                    </div>
                    {errors.confirm && (
                      <p id="confirm-error" className="recovery__field-error" role="alert">
                        <LuCircleAlert size={12} aria-hidden="true" />
                        {errors.confirm}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="recovery__submit"
                    disabled={loading}
                    aria-busy={loading}
                    aria-label="Redefinir senha"
                  >
                    {loading
                      ? <span className="recovery__spinner" aria-hidden="true" />
                      : 'Redefinir senha'}
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'success' && (
              <motion.div
                key="success"
                className="recovery__view"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="recovery__icon recovery__icon--success" aria-hidden="true">
                  <svg viewBox="0 0 64 64" className="recovery__success-svg">
                    <circle
                      cx="32" cy="32" r="28"
                      className="recovery__success-circle"
                    />
                    <path
                      d="M20 32 L28 40 L44 24"
                      className="recovery__success-check"
                    />
                  </svg>
                </div>

                <header className="recovery__heading">
                  <h1>Senha redefinida!</h1>
                  <p>Sua senha foi alterada com sucesso.</p>
                </header>

                <button
                  type="button"
                  className="recovery__submit"
                  onClick={() => navigate('/entrar')}
                  aria-label="Ir para a página de login"
                >
                  Ir para o login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

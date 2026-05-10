import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LuEye, LuEyeOff, LuSparkles } from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/Button/Button'
import '../Login/Login.css'

export default function Cadastro() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('Preencha todos os campos.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-page__brand">
          <Link to="/" className="auth-page__logo">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L7 10H11V17H17V10H21L14 3Z" fill="currentColor"/>
              <path d="M6 13L3 16V14.5H10V18H3V19.5H6L3 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M22 13L25 16V14.5H18V18H25V19.5H22L25 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span><b>hub</b>studio</span>
          </Link>
        </div>

        <div className="auth-page__tagline">
          <LuSparkles size={32} />
          <h2>Comece hoje,<br /><span>gratuitamente.</span></h2>
          <p>Junte-se a milhares de criadores que já simplificaram suas redes sociais.</p>
        </div>

        <div className="auth-page__dots">
          {[...Array(12)].map((_, i) => <div key={i} className="auth-page__dot" />)}
        </div>
      </div>

      <motion.div
        className="auth-page__right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-form">
          <div className="auth-form__header">
            <h1>Criar sua conta</h1>
            <p>Grátis para sempre no plano Lite</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form__body">
            <div className="auth-form__field">
              <label htmlFor="name">Nome completo</label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                autoComplete="name"
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="password">Senha</label>
              <div className="auth-form__input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-form__eye"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="auth-form__error">{error}</p>}

            <Button type="submit" fullWidth loading={loading} size="lg">
              Criar conta grátis
            </Button>
          </form>

          <p className="auth-form__switch">
            Já tem uma conta?{' '}
            <Link to="/entrar">Entrar</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import logoHub from '../../assets/images/logo-hub.png'
import './Cadastro.css'

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

export default function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [termos, setTermos] = useState(false)

  return (
    <div className="cadastro-page">

      {/* LADO ESQUERDO */}
      <div className="cadastro-left">
        <div className="cadastro-left__logo">
          <img src={logoHub} alt="HubStudio" style={{ height: 42, filter: 'brightness(0) invert(1)' }} />
        </div>
        <div className="cadastro-left__headline">
          <h2>
            Comece hoje a simplificar<br />
            <span>suas redes.</span>
          </h2>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="cadastro-right">
        <a className="cadastro-voltar" onClick={() => navigate(-1)}>
          ← Voltar
        </a>

        <div className="cadastro-card">
          <h1 className="cadastro-card__title">Criar sua conta</h1>
          <p className="cadastro-card__subtitle">Grátis para sempre — sem cartão de crédito.</p>

          {/* OAUTH */}
          <div className="cadastro-oauth">
            <button className="cadastro-oauth__btn">
              <GoogleIcon /> Google
            </button>
            <button className="cadastro-oauth__btn">
              <GitHubIcon /> GitHub
            </button>
          </div>

          {/* SEPARADOR */}
          <div className="cadastro-divider">
            <div className="cadastro-divider__line" />
            <span className="cadastro-divider__text">OU CONTINUE COM EMAIL</span>
            <div className="cadastro-divider__line" />
          </div>

          {/* CAMPOS */}
          <div className="cadastro-field">
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <div className="cadastro-field">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="cadastro-field">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Crie uma senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
            <button
              type="button"
              className="cadastro-field__eye"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          </div>

          <div className="cadastro-field">
            <input
              type={mostrarConfirmar ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
            />
            <button
              type="button"
              className="cadastro-field__eye"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              aria-label={mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarConfirmar ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          </div>

          <label className="cadastro-terms">
            <input
              type="checkbox"
              checked={termos}
              onChange={e => setTermos(e.target.checked)}
            />
            <span>
              Eu concordo com os <a href="#">Termos de uso</a> e a <a href="#">Política de privacidade</a>.
            </span>
          </label>

          <button className="cadastro-btn">Criar conta grátis</button>

          <p className="cadastro-switch">
            Já tem uma conta?{' '}
            <a href="/login">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  )
}

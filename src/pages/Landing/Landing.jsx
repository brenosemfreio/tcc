import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuArrowRight, LuCheck, LuSparkles, LuTrendingUp, LuBell,
  LuCalendarClock, LuChartBar, LuZap, LuShare2, LuStar,
  LuBrain, LuChevronRight, LuPlus, LuGlobe,
} from 'react-icons/lu'
import {
  FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaLinkedin, FaPinterest,
} from 'react-icons/fa'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import './Landing.css'

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`l-faq__item${open ? ' l-faq__item--open' : ''}`}>
      <button className="l-faq__q" onClick={() => setOpen(o => !o)}>
        <span>{question}</span>
        <motion.span className="l-faq__icon" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.22 }}>
          <LuPlus />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="l-faq__a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Counter({ end, suffix = '', label, delay = 0, prefix = '' }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const start = () => {
    if (started) return
    setStarted(true)
    const steps = 60
    const stepTime = 2000 / steps
    const inc = end / steps
    let cur = 0
    const t = setInterval(() => {
      cur += inc
      if (cur >= end) { setCount(end); clearInterval(t) }
      else setCount(Math.round(cur))
    }, stepTime)
  }
  return (
    <motion.div
      className="l-stat"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onViewportEnter={start}
    >
      <strong>{prefix}{count.toLocaleString('pt-BR')}{suffix}</strong>
      <span>{label}</span>
    </motion.div>
  )
}

const PLATFORMS = [
  { icon: FaInstagram, name: 'Instagram', color: '#E1306C' },
  { icon: FaTiktok,    name: 'TikTok',    color: '#69C9D0' },
  { icon: FaYoutube,   name: 'YouTube',   color: '#FF0000' },
  { icon: FaFacebook,  name: 'Facebook',  color: '#1877F2' },
  { icon: FaLinkedin,  name: 'LinkedIn',  color: '#0A66C2' },
  { icon: FaPinterest, name: 'Pinterest', color: '#E60023' },
]

const FEATURES = [
  {
    slot: 'wide',
    icon: LuCalendarClock,
    color: '#7C5FE8',
    title: 'Agendamento Inteligente',
    desc: 'Planeje e publique em todas as redes num calendário visual. A IA sugere os horários de maior engajamento automaticamente.',
    preview: 'calendar',
  },
  {
    slot: 'tall',
    icon: LuChartBar,
    color: '#E84FA5',
    title: 'Analytics em Tempo Real',
    desc: 'Dashboards com alcance, engajamento e crescimento de seguidores atualizados ao vivo.',
    preview: 'chart',
  },
  {
    slot: 'sm',
    icon: LuBrain,
    color: '#4F35E8',
    title: 'IA Insights',
    desc: 'Sugestões de conteúdo, hashtags e tendências geradas por inteligência artificial.',
    preview: null,
  },
  {
    slot: 'sm',
    icon: LuGlobe,
    color: '#B44FE8',
    title: 'Multi-plataforma',
    desc: 'Instagram, TikTok, LinkedIn, YouTube e mais em uma única tela integrada.',
    preview: 'platforms',
  },
]

const STEPS = [
  { icon: LuShare2,        num: '01', title: 'Conecte suas redes',      desc: 'Vincule suas contas em segundos. Autenticação segura, sem configurações complexas.' },
  { icon: LuCalendarClock, num: '02', title: 'Crie e agende conteúdo',  desc: 'Editor intuitivo com sugestões de IA, hashtags e calendário visual unificado.' },
  { icon: LuTrendingUp,    num: '03', title: 'Acompanhe os resultados', desc: 'Métricas em tempo real para você evoluir a cada post publicado.' },
]

const TESTIMONIALS = [
  {
    name: 'Ana Lima',
    role: 'Criadora de conteúdo · 240k seguidores',
    initials: 'AL',
    color: '#E84FA5',
    quote: 'Desde que comecei a usar o HubStudio, meu engajamento subiu 127%. A IA sugere os melhores horários e eu nunca mais perdi uma janela de postagem.',
  },
  {
    name: 'Carlos Mendes',
    role: 'Fotógrafo & Influencer · 5 plataformas',
    initials: 'CM',
    color: '#4F35E8',
    quote: 'Gerenciar 5 plataformas ao mesmo tempo parecia impossível. Agora faço tudo em minutos e ainda sobra tempo pra criar mais conteúdo de qualidade.',
  },
  {
    name: 'Priya Santos',
    role: 'Social Media Manager · 12 clientes',
    initials: 'PS',
    color: '#7C5FE8',
    quote: 'O analytics do HubStudio é extraordinário. Consigo mostrar resultados reais para meus clientes com dados precisos atualizados em tempo real.',
  },
]

const PLANS = [
  {
    name: 'Lite',
    monthly: 29,
    annual: 23,
    desc: 'Ferramentas essenciais para criadores emergentes.',
    features: ['Até 3 perfis sociais', '30 posts/mês', 'Analytics básico', 'Suporte por e-mail'],
    highlight: false,
  },
  {
    name: 'Pro',
    monthly: 79,
    annual: 63,
    desc: 'Para criadores prontos para dominar o algoritmo.',
    features: ['Até 10 perfis sociais', 'Posts ilimitados', 'Analytics avançado', 'Agendamento com IA', 'Suporte prioritário'],
    highlight: true,
  },
  {
    name: 'Elite',
    monthly: 199,
    annual: 159,
    desc: 'Poder ilimitado para agências e times criativos.',
    features: ['Perfis ilimitados', 'Posts ilimitados', 'Analytics premium', 'IA completa', 'Multi-usuário', 'Suporte 24/7'],
    highlight: false,
  },
]

const FAQS = [
  { q: 'Posso cancelar quando quiser?',             a: 'Sim! Não há fidelidade. Cancele a qualquer momento, sem burocracia ou taxas adicionais.' },
  { q: 'Funciona com conta pessoal do Instagram?',  a: 'O agendamento requer conta Profissional (Criador ou Empresa). A conversão é gratuita e leva menos de 1 minuto nas configurações do Instagram.' },
  { q: 'Tem período de teste gratuito?',            a: 'Sim, 14 dias gratuitos em qualquer plano, sem precisar cadastrar cartão de crédito.' },
  { q: 'Quantas plataformas posso conectar?',       a: 'Lite: até 3 perfis. Pro: até 10. Elite: ilimitado. Suportamos Instagram, TikTok, YouTube, Facebook, LinkedIn e Pinterest.' },
  { q: 'A IA gera conteúdo automaticamente?',      a: 'A IA sugere horários ideais, hashtags relevantes e tendências. A criação final é sempre sua — autenticidade vem de você.' },
  { q: 'Como funciona o suporte?',                  a: 'Lite: e-mail. Pro: prioritário, resposta em até 4h. Elite: 24/7 com gerente de conta dedicado.' },
]

const BARS = [40, 65, 50, 80, 60, 90, 70]

const up = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function Landing() {
  const navigate = useNavigate()
  const [annual, setAnnual] = useState(false)

  return (
    <div className="landing l-landing">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="l-hero">
        <div className="l-hero__grid" aria-hidden="true" />
        <div className="l-hero__blobs" aria-hidden="true">
          <div className="l-blob l-blob--1" />
          <div className="l-blob l-blob--2" />
          <div className="l-blob l-blob--3" />
        </div>

        <div className="container l-hero__inner">

          {/* Content */}
          <motion.div
            className="l-hero__content"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={up} className="l-hero__badge">
              <span className="l-hero__badge-dot" />
              IA integrada — ao vivo
            </motion.div>

            <motion.h1 variants={up} className="l-hero__title">
              Suas redes sociais<br />
              <span className="l-hero__hl">no próximo nível.</span>
            </motion.h1>

            <motion.p variants={up} className="l-hero__sub">
              Agende posts, analise métricas e receba insights de IA —
              tudo em uma plataforma feita para quem leva o conteúdo a sério.
            </motion.p>

            <motion.div variants={up} className="l-hero__ctas">
              <Button variant="primary" size="lg" iconRight={<LuArrowRight />} onClick={() => navigate('/cadastro')} className="l-hero__cta-btn">
                Começar grátis — 14 dias
              </Button>
              <Link to="/entrar" className="l-hero__link">
                Já tenho conta <LuChevronRight />
              </Link>
            </motion.div>

            <motion.div variants={up} className="l-hero__proof">
              <div className="l-avatars">
                {['#7C5FE8', '#E84FA5', '#4F35E8', '#B44FE8', '#7C5FE8'].map((c, i) => (
                  <span key={i} className="l-avatar" style={{ background: c, marginLeft: i ? -8 : 0 }} />
                ))}
              </div>
              <div>
                <div className="l-hero__stars">
                  {Array(5).fill(0).map((_, i) => <LuStar key={i} />)}
                </div>
                <span>+1.200 criadores confiam no HubStudio</span>
              </div>
            </motion.div>

            <motion.div variants={up} className="l-hero__trust">
              <span className="l-hero__trust-label">Integra com</span>
              {PLATFORMS.map(p => {
                const Icon = p.icon
                return (
                  <span key={p.name} className="l-hero__trust-icon" style={{ color: p.color }} title={p.name}>
                    <Icon />
                  </span>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="l-hero__visual"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="l-mockup">
              <div className="l-mockup__bar">
                <div className="l-mockup__dots">
                  <span style={{ background: '#FF5F57' }} />
                  <span style={{ background: '#FFBD2E' }} />
                  <span style={{ background: '#28CA42' }} />
                </div>
                <span className="l-mockup__title">HubStudio — Dashboard</span>
              </div>
              <div className="l-mockup__body">
                <div className="l-mockup__kpis">
                  {[
                    { v: '24.5k', l: 'Alcance',    t: '+12%' },
                    { v: '8.3%',  l: 'Engaj.',     t: '+5%'  },
                    { v: '12',    l: 'Agendados',  t: '↑'    },
                  ].map(k => (
                    <div key={k.l} className="l-mockup__kpi">
                      <strong>{k.v}</strong>
                      <span>{k.l}</span>
                      <em className="l-mockup__trend">{k.t}</em>
                    </div>
                  ))}
                </div>
                <div className="l-mockup__chart">
                  {BARS.map((h, i) => (
                    <motion.div
                      key={i}
                      className="l-mockup__bar-item"
                      style={{ '--h': h + '%' }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.9 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                    />
                  ))}
                </div>
                <div className="l-mockup__posts">
                  {['Instagram', 'TikTok', 'LinkedIn'].map((p, i) => (
                    <div key={p} className="l-mockup__post-row">
                      <div className="l-mockup__post-dot" style={{ background: PLATFORMS[i].color }} />
                      <span className="l-mockup__post-name">{p}</span>
                      <span className="l-mockup__post-time">09:00</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div className="l-float l-float--1" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}>
              <div className="l-float__icon" style={{ background: '#FFF1F9', color: '#E84FA5' }}><LuTrendingUp /></div>
              <div><strong>+127%</strong><span>engajamento</span></div>
            </motion.div>

            <motion.div className="l-float l-float--2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
              <div className="l-float__icon" style={{ background: '#EDE8FF', color: '#4F35E8' }}><LuBell /></div>
              <div><strong>Post agendado</strong><span>amanhã, 09:00</span></div>
            </motion.div>

            <motion.div className="l-float l-float--3" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}>
              <div className="l-float__icon" style={{ background: '#F0FDF4', color: '#16A34A' }}><LuSparkles /></div>
              <div><strong>IA sugeriu</strong><span>5 hashtags</span></div>
            </motion.div>
          </motion.div>
        </div>

        <div className="l-hero__fade" aria-hidden="true" />
      </section>

      {/* ─── MARQUEE ─────────────────────────────────────────────── */}
      <div className="l-marquee">
        <div className="l-marquee__noise" />
        <div className="l-marquee__track">
          {[...PLATFORMS, ...PLATFORMS, ...PLATFORMS].map((p, i) => {
            const Icon = p.icon
            return (
              <div key={i} className="l-marquee__item" style={{ '--c': p.color }}>
                <span className="l-marquee__icon-wrap"><Icon /></span>
                <span>{p.name}</span>
              </div>
            )
          })}
        </div>
        <div className="l-marquee__track l-marquee__track--rev">
          {[...PLATFORMS, ...PLATFORMS, ...PLATFORMS].map((p, i) => {
            const Icon = p.icon
            return (
              <div key={i} className="l-marquee__item" style={{ '--c': p.color }}>
                <span className="l-marquee__icon-wrap"><Icon /></span>
                <span>{p.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── FEATURES ────────────────────────────────────────────── */}
      <section className="l-features" id="funcionalidades">
        <div className="container">
          <motion.div className="l-section-head" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.span variants={up} className="l-badge l-badge--primary">Funcionalidades</motion.span>
            <motion.h2 variants={up}>Tudo que você precisa,<br /><span className="l-gradient-text">num só lugar</span></motion.h2>
            <motion.p variants={up}>Do planejamento à análise, o HubStudio centraliza toda a sua gestão de redes sociais.</motion.p>
          </motion.div>

          <div className="l-bento">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  className={`l-bento__card l-bento__card--${f.slot}`}
                  style={{ '--accent': f.color }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="l-bento__icon"><Icon /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>

                  {f.preview === 'chart' && (
                    <div className="l-bento__preview-chart">
                      {[35, 55, 40, 75, 55, 88, 68].map((h, j) => (
                        <motion.div
                          key={j}
                          className="l-bento__preview-bar"
                          style={{ '--bh': h + '%' }}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + j * 0.06, duration: 0.4 }}
                        />
                      ))}
                    </div>
                  )}

                  {f.preview === 'platforms' && (
                    <div className="l-bento__preview-platforms">
                      {PLATFORMS.map(p => {
                        const PIcon = p.icon
                        return (
                          <span key={p.name} className="l-bento__preview-icon" style={{ '--pc': p.color }}>
                            <PIcon />
                          </span>
                        )
                      })}
                    </div>
                  )}

                  <div className="l-bento__glow" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────── */}
      <section className="l-stats">
        <div className="l-stats__noise" />
        <div className="container l-stats__inner">
          <Counter end={1200}  suffix="+"  label="Usuários ativos"  delay={0}   />
          <Counter end={48000} suffix="+"  label="Posts agendados"  delay={0.1} />
          <Counter end={6}     suffix=""   label="Plataformas"      delay={0.2} />
          <Counter end={98}    suffix="%"  label="Satisfação"       delay={0.3} />
        </div>
      </section>

      {/* ─── STEPS ───────────────────────────────────────────────── */}
      <section className="l-steps" id="sobre">
        <div className="container">
          <motion.div className="l-section-head" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.span variants={up} className="l-badge l-badge--primary">Como funciona</motion.span>
            <motion.h2 variants={up}>Três passos para<br /><span className="l-gradient-text">transformar suas redes</span></motion.h2>
          </motion.div>

          <div className="l-steps__grid">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.num}
                  className="l-step"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <div className="l-step__num">{s.num}</div>
                  <div className="l-step__icon"><Icon /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="l-testimonials">
        <div className="container">
          <motion.div className="l-section-head" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.span variants={up} className="l-badge l-badge--primary">Depoimentos</motion.span>
            <motion.h2 variants={up}>Quem usa,<br /><span className="l-gradient-text">recomenda</span></motion.h2>
          </motion.div>

          <div className="l-testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="l-testimonial"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{ y: -6 }}
              >
                <div className="l-testimonial__stars">
                  {Array(5).fill(0).map((_, j) => <LuStar key={j} />)}
                </div>
                <p className="l-testimonial__quote">"{t.quote}"</p>
                <div className="l-testimonial__author">
                  <span className="l-testimonial__avatar" style={{ background: t.color }}>{t.initials}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────────── */}
      <section className="l-pricing" id="precos">
        <div className="container">
          <motion.div className="l-section-head" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.span variants={up} className="l-badge l-badge--primary">Planos</motion.span>
            <motion.h2 variants={up}>Projetado para<br /><span className="l-gradient-text">cada etapa</span></motion.h2>
            <motion.p variants={up}>Preços transparentes. Cancele quando quiser.</motion.p>
          </motion.div>

          <motion.div className="l-toggle" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className={!annual ? 'l-toggle__opt--active' : ''}>Mensal</span>
            <button className={`l-toggle__btn${annual ? ' l-toggle__btn--on' : ''}`} onClick={() => setAnnual(!annual)} aria-label="Alternar cobrança">
              <motion.div className="l-toggle__thumb" animate={{ x: annual ? 24 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            </button>
            <span className={annual ? 'l-toggle__opt--active' : ''}>
              Anual <span className="l-toggle__save">−20%</span>
            </span>
          </motion.div>

          <div className="l-plans">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`l-plan${plan.highlight ? ' l-plan--highlight' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                whileHover={{ y: -6 }}
              >
                {plan.highlight && (
                  <div className="l-plan__popular"><LuStar /> Mais popular</div>
                )}
                <h3 className="l-plan__name">{plan.name}</h3>
                <div className="l-plan__price">
                  <span className="l-plan__currency">R$</span>
                  <motion.span className="l-plan__amount" key={annual ? 'a' : 'm'} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    {annual ? plan.annual : plan.monthly}
                  </motion.span>
                  <span className="l-plan__period">/mês</span>
                </div>
                <p className="l-plan__desc">{plan.desc}</p>
                <ul className="l-plan__features">
                  {plan.features.map(f => (
                    <li key={f}><LuCheck className="l-plan__check" />{f}</li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? 'primary' : 'outline'} fullWidth onClick={() => navigate('/cadastro')}>
                  Começar agora
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <section className="l-faq">
        <div className="container">
          <motion.div className="l-section-head" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.span variants={up} className="l-badge l-badge--primary">Dúvidas</motion.span>
            <motion.h2 variants={up}>Perguntas<br /><span className="l-gradient-text">frequentes</span></motion.h2>
          </motion.div>

          <div className="l-faq__list">
            {FAQS.map((f, i) => (
              <motion.div key={f.q} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45 }}>
                <FaqItem question={f.q} answer={f.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────── */}
      <section className="l-cta">
        <div className="l-cta__grid" aria-hidden="true" />
        <div className="l-cta__glow l-cta__glow--1" />
        <div className="l-cta__glow l-cta__glow--2" />
        <div className="container l-cta__inner">
          <motion.span className="l-badge l-badge--glass" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <LuZap /> Comece hoje mesmo
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }}>
            Transforme sua presença<br />digital com o <span className="l-gradient-text">HubStudio</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}>
            Junte-se a mais de 1.200 criadores que já usam o HubStudio para crescer.
          </motion.p>
          <motion.div className="l-cta__actions" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}>
            <Button variant="primary" size="lg" iconRight={<LuArrowRight />} onClick={() => navigate('/cadastro')} className="l-cta__btn">
              Começar grátis — 14 dias
            </Button>
            <span className="l-cta__note">Sem cartão de crédito. Cancele quando quiser.</span>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

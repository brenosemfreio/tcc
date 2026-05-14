import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuArrowRight, LuCheck, LuSparkles, LuTrendingUp, LuBell,
  LuCalendarClock, LuChartBar, LuZap, LuShare2, LuStar,
  LuBrain, LuChevronRight, LuPlus,
  LuRotateCcw, LuUser, LuGift, LuMessageCircle,
  LuShieldCheck, LuCreditCard,
} from 'react-icons/lu'
import {
  FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaLinkedin, FaPinterest,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import './Landing.css'

// ── Marquee controlado por rAF com desaceleração suave
function Marquee({ items }) {
  const trackRef = useRef(null)
  const s = useRef({ pos: 0, speed: 0.5, target: 0.5, halfW: 0, raf: null })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    s.current.halfW = track.scrollWidth / 2

    function tick() {
      const st = s.current
      st.speed += (st.target - st.speed) * 0.04
      st.pos -= st.speed
      if (Math.abs(st.pos) >= st.halfW) st.pos = 0
      track.style.transform = `translateX(${st.pos}px)`
      st.raf = requestAnimationFrame(tick)
    }
    s.current.raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(s.current.raf)
  }, [])

  return (
    <div
      className="l-marquee-strip__track-wrap"
      onMouseEnter={() => { s.current.target = 0.08 }}
      onMouseLeave={() => { s.current.target = 0.5 }}
    >
      <div ref={trackRef} className="l-marquee-strip__track">
        {[...items, ...items].map((p, i) => (
          <span key={i} className="l-marquee-strip__item">
            <p.icon style={{ color: p.color }} />
            {p.name}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Feature previews
function FeatureCalendarPreview() {
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  const posts = new Set([1, 4, 8, 11])
  return (
    <div className="l-bento__preview l-bento__preview--calendar">
      <div className="l-fp-cal__head">
        {days.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="l-fp-cal__grid">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className={`l-fp-cal__cell${posts.has(i) ? ' l-fp-cal__cell--post' : ''}`}>
            <span>{i + 14}</span>
            {posts.has(i) && <span className="l-fp-cal__dot" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function FeatureChartPreview() {
  const bars = [42, 60, 48, 75, 55, 88, 70]
  return (
    <div className="l-bento__preview l-bento__preview--chart">
      <div className="l-fp-chart__head">
        <span className="l-fp-chart__metric">
          <LuTrendingUp />
          +127%
        </span>
        <span className="l-fp-chart__live">
          <span className="l-fp-chart__pulse" />
          Ao vivo
        </span>
      </div>
      <div className="l-fp-chart__bars">
        {bars.map((h, i) => (
          <div key={i} className="l-fp-chart__bar" style={{ '--h': `${h}%`, '--i': i }} />
        ))}
      </div>
    </div>
  )
}

function FeatureHashtagsPreview() {
  return (
    <div className="l-bento__preview l-bento__preview--hashtags">
      <span className="l-fp-tag-label">
        <LuSparkles size={12} />
        IA sugeriu
      </span>
      <div className="l-fp-tag-list">
        {['#marketing', '#growth', '#socialmedia', '#contentcreator'].map((tag, i) => (
          <span key={tag} className="l-fp-tag" style={{ '--i': i }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}

function FeaturePlatformsPreview() {
  const platforms = [
    { Icon: FaInstagram, color: '#E1306C' },
    { Icon: FaTiktok,    color: '#010101' },
    { Icon: FaYoutube,   color: '#FF0000' },
    { Icon: FaFacebook,  color: '#1877F2' },
    { Icon: FaLinkedin,  color: '#0A66C2' },
  ]
  return (
    <div className="l-bento__preview l-bento__preview--platforms">
      <div className="l-fp-platform-stack">
        {platforms.map(({ Icon, color }, i) => (
          <span key={i} className="l-fp-platform" style={{ '--i': i, background: color }}>
            <Icon />
          </span>
        ))}
      </div>
      <span className="l-fp-platform-count">+5 redes</span>
    </div>
  )
}

// ── FAQ item
function FaqItem({ icon: Icon, question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`l-faq__item${open ? ' l-faq__item--open' : ''}`}>
      <button className="l-faq__q" onClick={() => setOpen(o => !o)}>
        <span className="l-faq__q-wrap">
          {Icon && (
            <span className="l-faq__q-icon">
              <Icon />
            </span>
          )}
          <span className="l-faq__q-text">{question}</span>
        </span>
        <motion.span
          className="l-faq__icon"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
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
            transition={{
              height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25, ease: 'easeOut' },
            }}
            style={{ overflow: 'hidden' }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Animated counter
function Counter({ end, suffix = '', label, delay = 0 }) {
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
      <strong>{count.toLocaleString('pt-BR')}{suffix}</strong>
      <span>{label}</span>
    </motion.div>
  )
}

// ── Data
const PLATFORMS = [
  { icon: FaPinterest, name: 'Pinterest',  color: '#E60023' },
  { icon: FaXTwitter,  name: 'X',          color: '#000'    },
  { icon: FaInstagram, name: 'Instagram',  color: '#E1306C' },
  { icon: FaTiktok,    name: 'TikTok',     color: '#010101' },
  { icon: FaYoutube,   name: 'YouTube',    color: '#FF0000' },
  { icon: FaFacebook,  name: 'Facebook',   color: '#1877F2' },
  { icon: FaLinkedin,  name: 'LinkedIn',   color: '#0A66C2' },
]

const FEATURES = [
  {
    slot: 'wide',
    icon: LuCalendarClock,
    color: '#7C5FE8',
    preview: 'calendar',
    title: 'Agendamento Inteligente',
    desc: 'Planeje e publique em todas as redes num calendário visual. A IA sugere os horários de maior engajamento automaticamente.',
  },
  {
    slot: 'tall',
    icon: LuChartBar,
    color: '#E84FA5',
    preview: 'chart',
    title: 'Analytics em Tempo Real',
    desc: 'Dashboards lindos com alcance, engajamento, crescimento de seguidores e muito mais — atualizados ao vivo.',
  },
  {
    slot: 'sm',
    icon: LuBrain,
    color: '#4F35E8',
    preview: 'hashtags',
    title: 'IA Insights',
    desc: 'Sugestões de conteúdo, hashtags e tendências geradas por inteligência artificial.',
  },
  {
    slot: 'sm',
    icon: LuShare2,
    color: '#B44FE8',
    preview: 'platforms',
    title: 'Multi-plataforma',
    desc: 'Instagram, TikTok, LinkedIn, YouTube e mais em uma única tela.',
  },
]

const STEPS = [
  { icon: LuShare2,        num: '01', title: 'Conecte suas redes',   desc: 'Vincule todas as suas contas sociais em segundos. Instagram, TikTok, YouTube e mais — tudo em um só lugar.' },
  { icon: LuCalendarClock, num: '02', title: 'Crie e agende',        desc: 'Crie conteúdo incrível com ajuda da IA, agende para o melhor horário e deixe a plataforma trabalhar por você.' },
  { icon: LuTrendingUp,    num: '03', title: 'Analise e cresça',     desc: 'Acompanhe métricas em tempo real, entenda o que funciona e tome decisões baseadas em dados reais.' },
]

const PLANS = [
  {
    name: 'Lite',
    tagline: 'INDIVIDUAL',
    monthly: 29,
    annual: 23,
    desc: 'Ferramentas essenciais para criadores emergentes.',
    cta: 'Começar grátis',
    ctaAction: 'signup',
    features: ['Até 3 perfis sociais', '30 posts/mês', 'Analytics básico', 'Suporte por e-mail'],
    highlight: false,
  },
  {
    name: 'Pro',
    tagline: 'CRIADOR PRO',
    monthly: 79,
    annual: 63,
    desc: 'Para criadores prontos para dominar o algoritmo.',
    cta: 'Escolher Pro',
    ctaAction: 'signup',
    inheritsFrom: 'Lite',
    features: ['Até 10 perfis sociais', 'Posts ilimitados', 'Analytics avançado', 'Agendamento com IA', 'Suporte prioritário'],
    highlight: true,
  },
  {
    name: 'Elite',
    tagline: 'AGÊNCIAS & TIMES',
    monthly: 199,
    annual: 159,
    desc: 'Acesso ilimitado para agências e times.',
    cta: 'Falar com vendas',
    ctaAction: 'sales',
    inheritsFrom: 'Pro',
    features: ['Perfis ilimitados', 'Posts ilimitados', 'Analytics premium', 'IA completa', 'Multi-usuário', 'Suporte 24/7'],
    highlight: false,
  },
]

const FAQS = [
  { icon: LuRotateCcw,     q: 'Posso cancelar quando quiser?',            a: 'Sim! Não há fidelidade. Cancele a qualquer momento, sem burocracia ou taxas adicionais.' },
  { icon: LuUser,          q: 'Funciona com conta pessoal do Instagram?', a: 'O agendamento requer conta Profissional (Criador ou Empresa). A conversão é gratuita e leva menos de 1 minuto nas configurações do Instagram.' },
  { icon: LuGift,          q: 'Tem período de teste gratuito?',           a: 'Sim, 14 dias gratuitos em qualquer plano, sem precisar cadastrar cartão de crédito.' },
  { icon: LuShare2,        q: 'Quantas plataformas posso conectar?',      a: 'Lite: até 3 perfis. Pro: até 10. Elite: ilimitado. Suportamos Instagram, TikTok, YouTube, Facebook, LinkedIn e Pinterest.' },
  { icon: LuBrain,         q: 'A IA gera conteúdo automaticamente?',     a: 'A IA sugere horários ideais, hashtags relevantes e tendências. A criação final é sempre sua — autenticidade vem de você.' },
  { icon: LuMessageCircle, q: 'Como funciona o suporte?',                 a: 'Lite: e-mail. Pro: suporte prioritário com resposta em até 4h. Elite: 24/7 com gerente de conta dedicado.' },
]

const MOCKUP_BARS = [40, 65, 50, 80, 60, 90, 70]

const fadeUp = {
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

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="l-hero">
        <div className="l-hero__blobs">
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
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
          >
            <motion.h1 variants={fadeUp} className="l-hero__title">
              Suas redes sociais<br />
              <span className="l-hero__highlight">simplificadas.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="l-hero__sub">
              Agende posts, analise métricas e receba insights de IA —
              tudo em uma plataforma feita para quem leva o conteúdo a sério.
            </motion.p>

            <motion.div variants={fadeUp} className="l-hero__ctas">
              <Button
                variant="primary"
                size="lg"
                iconRight={<LuArrowRight />}
                onClick={() => navigate('/cadastro')}
              >
                Começar grátis
              </Button>
              <Link to="/entrar" className="l-hero__link">
                Já tenho conta <LuChevronRight />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="l-hero__proof">
              <div className="l-avatars">
                {['#7C5FE8', '#E84FA5', '#4F35E8', '#B44FE8'].map((c, i) => (
                  <span key={i} className="l-avatar" style={{ background: c, marginLeft: i ? -10 : 0 }} />
                ))}
              </div>
              <span>+1.200 criadores já usam o HubStudio</span>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="l-hero__visual"
            initial={{ opacity: 0, x: 60, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Dashboard mockup */}
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
                  {[{ v: '24.5k', l: 'Alcance' }, { v: '8.3%', l: 'Engaj.' }, { v: '12', l: 'Agendados' }].map(k => (
                    <div key={k.l} className="l-mockup__kpi">
                      <strong>{k.v}</strong>
                      <span>{k.l}</span>
                    </div>
                  ))}
                </div>
                <div className="l-mockup__chart">
                  {MOCKUP_BARS.map((h, i) => (
                    <motion.div
                      key={i}
                      className="l-mockup__bar-item"
                      style={{ '--h': h + '%' }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.6 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                    />
                  ))}
                </div>
                <div className="l-mockup__days">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, i) => (
                    <div key={d} className={`l-mockup__day${i < 4 ? ' has-post' : ''}`}>
                      <span>{d}</span>
                      {i < 4 && <div className="l-mockup__dot" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              className="l-float l-float--1"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <div className="l-float__icon"><LuTrendingUp /></div>
              <div>
                <strong>+127%</strong>
                <span>engajamento</span>
              </div>
            </motion.div>

            <motion.div
              className="l-float l-float--2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className="l-float__icon"><LuBell /></div>
              <div>
                <strong>Post agendado</strong>
                <span>amanhã, 09:00</span>
              </div>
            </motion.div>

            <motion.div
              className="l-float l-float--3"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            >
              <div className="l-float__icon"><LuSparkles /></div>
              <div>
                <strong>IA sugeriu</strong>
                <span>5 hashtags</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="l-features" id="funcionalidades">
        <div className="container">
          <motion.div
            className="l-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span variants={fadeUp} className="l-badge l-badge--primary">Funcionalidades</motion.span>
            <motion.h2 variants={fadeUp}>
              Tudo que você precisa,<br /><span className="l-gradient-text">num só lugar</span>
            </motion.h2>
            <motion.p variants={fadeUp}>
              Do planejamento à análise, o HubStudio centraliza toda a sua gestão de redes sociais.
            </motion.p>
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
                  whileHover={{ y: -5 }}
                >
                  <div className="l-bento__head">
                    <div className="l-bento__icon"><Icon /></div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                  {f.preview === 'calendar'  && <FeatureCalendarPreview />}
                  {f.preview === 'chart'     && <FeatureChartPreview />}
                  {f.preview === 'hashtags'  && <FeatureHashtagsPreview />}
                  {f.preview === 'platforms' && <FeaturePlatformsPreview />}
                  <div className="l-bento__glow" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="l-stats">
        <div className="l-stats__noise" />
        <div className="container l-stats__inner">
          <Counter end={1200} suffix="+" label="Usuários ativos" delay={0} />
          <Counter end={48000} suffix="" label="Posts agendados" delay={0.1} />
          <Counter end={6}    suffix=""  label="Plataformas" delay={0.2} />
          <Counter end={98}   suffix="%" label="Satisfação" delay={0.3} />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section className="l-steps" id="sobre">
        <div className="container">
          <motion.div
            className="l-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span variants={fadeUp} className="l-badge l-badge--primary">
              <LuZap size={12} style={{ marginRight: 6 }} />Como funciona
            </motion.span>
            <motion.h2 variants={fadeUp}>
              Em <span className="l-gradient-text">3 passos simples</span><br />você já está no ar
            </motion.h2>
          </motion.div>

          <motion.div
            className="l-steps__perks"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {['Grátis para começar', 'Sem cartão de crédito', 'Cancele quando quiser'].map(text => (
              <span key={text} className="l-steps__perk">
                <LuCheck size={14} />
                {text}
              </span>
            ))}
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

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="l-faq" id="faq">
        <div className="l-faq__bg" aria-hidden="true" />
        <div className="container">
          <div className="l-faq__layout">
            <motion.div
              className="l-faq__head-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <div className="l-section-head l-section-head--left">
                <motion.span variants={fadeUp} className="l-badge l-badge--primary">Dúvidas</motion.span>
                <motion.h2 variants={fadeUp}>
                  Perguntas<br /><span className="l-gradient-text">frequentes</span>
                </motion.h2>
                <motion.p variants={fadeUp}>
                  Tudo que você precisa saber antes de começar.
                </motion.p>
              </div>
            </motion.div>

            <div className="l-faq__list-col">
              <div className="l-faq__list">
                {FAQS.map((f, i) => (
                  <motion.div
                    key={f.q}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.45 }}
                  >
                    <FaqItem icon={f.icon} question={f.q} answer={f.a} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="l-faq__cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="l-faq__cta-icon">
                  <LuMessageCircle />
                </div>
                <div className="l-faq__cta-text">
                  <h3>Ainda tem dúvidas?</h3>
                  <p>Nosso time responde em minutos.</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  iconRight={<LuArrowRight />}
                  onClick={() => { window.location.href = 'mailto:contato@hubstudio.com' }}
                >
                  Falar com a gente
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee plataformas ──────────────────────── */}
      <div className="l-marquee-strip">
        <div className="l-marquee-strip__inner">
          <span className="l-marquee-strip__label">INTEGRA COM AS MAIORES PLATAFORMAS</span>
          <Marquee items={PLATFORMS} />
        </div>
      </div>

      {/* ── Pricing ──────────────────────────────────── */}
      <section className="l-pricing" id="precos">
        <div className="container">
          <motion.div
            className="l-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span variants={fadeUp} className="l-badge l-badge--primary">Planos</motion.span>
            <motion.h2 variants={fadeUp}>
              Projetado para<br /><span className="l-gradient-text">cada etapa</span>
            </motion.h2>
            <motion.p variants={fadeUp}>
              Preços transparentes. Cancele quando quiser.
            </motion.p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            className="l-toggle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={!annual ? 'l-toggle__opt--active' : ''}>Mensal</span>
            <button
              className={`l-toggle__btn${annual ? ' l-toggle__btn--on' : ''}`}
              onClick={() => setAnnual(!annual)}
              aria-label="Alternar cobrança"
            >
              <motion.div
                className="l-toggle__thumb"
                animate={{ x: annual ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </button>
            <span className={annual ? 'l-toggle__opt--active' : ''}>
              Anual <span className="l-toggle__save">-20%</span>
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
                  <div className="l-plan__popular">
                    <LuStar /> Mais popular
                  </div>
                )}
                <div className="l-plan__head">
                  <span className="l-plan__tagline">{plan.tagline}</span>
                  <h3 className="l-plan__name">{plan.name}</h3>
                </div>
                <div className="l-plan__price">
                  <span className="l-plan__currency">R$</span>
                  <motion.span
                    className="l-plan__amount"
                    key={annual ? 'a' : 'm'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {annual ? plan.annual : plan.monthly}
                  </motion.span>
                  <span className="l-plan__period">/mês</span>
                </div>
                <AnimatePresence mode="wait">
                  {annual && (
                    <motion.span
                      key="savings"
                      className="l-plan__savings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      Economiza R$ {(plan.monthly - plan.annual) * 12}/ano
                    </motion.span>
                  )}
                </AnimatePresence>
                <p className="l-plan__desc">{plan.desc}</p>
                {plan.inheritsFrom && (
                  <div className="l-plan__inherits">
                    <LuCheck />
                    Tudo do {plan.inheritsFrom}, mais:
                  </div>
                )}
                <ul className="l-plan__features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <LuCheck className="l-plan__check" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? 'primary' : 'outline'}
                  fullWidth
                  iconRight={plan.highlight ? <LuArrowRight /> : null}
                  onClick={() => {
                    if (plan.ctaAction === 'sales') {
                      window.location.href = 'mailto:vendas@hubstudio.com'
                      return
                    }
                    navigate('/cadastro')
                  }}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="l-pricing__trust"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span><LuShieldCheck /> 14 dias grátis</span>
            <span><LuCreditCard /> Sem cartão de crédito</span>
            <span><LuRotateCcw /> Cancele quando quiser</span>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────── */}
      <section className="l-cta">
        <div className="l-cta__glow l-cta__glow--1" />
        <div className="l-cta__glow l-cta__glow--2" />
        <div className="container l-cta__inner">
          <motion.span
            className="l-badge l-badge--glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <LuZap /> Comece hoje mesmo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Transforme sua presença<br />digital com o <span className="l-gradient-text">HubStudio</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Junte-se a mais de 1.200 criadores que já usam o HubStudio para crescer.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button
              variant="primary"
              size="lg"
              iconRight={<LuArrowRight />}
              onClick={() => navigate('/cadastro')}
              className="l-cta__btn"
            >
              Começar grátis
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

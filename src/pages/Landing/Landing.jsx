import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LuTrendingUp, LuCalendarClock, LuBarChart3,
  LuShieldCheck, LuZap, LuHeart,
} from 'react-icons/lu'
import {
  FaInstagram, FaTiktok, FaYoutube,
  FaFacebook, FaLinkedin, FaPinterest,
} from 'react-icons/fa'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import debPhone   from '../../assets/images/deb-phone.png'
import debTablet  from '../../assets/images/deb-tablet.png'
import './Landing.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
}

const SOCIAL_ICONS = [
  { icon: FaInstagram, color: '#E1306C', label: 'Instagram', cls: 'pos-instagram' },
  { icon: FaTiktok,    color: '#010101', label: 'TikTok',    cls: 'pos-tiktok'    },
  { icon: FaYoutube,   color: '#FF0000', label: 'YouTube',   cls: 'pos-youtube'   },
  { icon: FaFacebook,  color: '#1877F2', label: 'Facebook',  cls: 'pos-facebook'  },
  { icon: FaLinkedin,  color: '#0A66C2', label: 'LinkedIn',  cls: 'pos-linkedin'  },
  { icon: FaPinterest, color: '#E60023', label: 'Pinterest', cls: 'pos-pinterest' },
]

const FEATURES = [
  {
    icon: LuTrendingUp,
    title: 'Insights de Rendimento',
    desc: 'Transforme seus dados em ganhos reais com insights inteligentes. Descubra quais conteúdos geram mais receita e identifique os melhores horários para monetizar. Tome decisões mais estratégicas e potencialize seus resultados.',
  },
  {
    icon: LuCalendarClock,
    title: 'Postagens simplificadas',
    desc: 'Crie, edite e publique conteúdos de forma rápida e intuitiva. Centralize suas redes sociais em um único lugar, agende postagens com poucos cliques e mantenha sua consistência sem complicações.',
  },
  {
    icon: LuBarChart3,
    title: 'Visualização Perfeita',
    desc: 'Nossa tecnologia avançada garante que seu conteúdo seja exibido com máxima precisão em todas as plataformas e dispositivos, proporcionando uma experiência consistente e profissional.',
    wide: true,
  },
]

const MISSION = [
  { icon: LuTrendingUp, text: 'Impulsionar o crescimento nas redes sociais' },
  { icon: LuCalendarClock, text: 'Economizar tempo na gestão de conteúdo' },
  { icon: LuBarChart3, text: 'Facilitar o monitoramento e análise' },
]

const VALUES = [
  { icon: LuZap,        label: 'Eficiência',    desc: 'Oferecemos ferramentas que simplificam e otimizam a gestão das redes sociais.' },
  { icon: LuHeart,      label: 'Inovação',      desc: 'Estamos sempre buscando novas maneiras de melhorar e inovar no marketing digital.' },
  { icon: LuShieldCheck,label: 'Compromisso',   desc: 'Nos dedicamos a atender às necessidades dos nossos usuários com excelência.' },
]

const PLANS = [
  {
    name: 'Criador Lite',
    price: '29',
    desc: 'Ferramentas essenciais para criadores emergentes.',
    features: ['Ferramentas básicas de agendamentos.', 'Até 3 perfis sociais.', 'Métricas de agendamento padrão.'],
    highlight: false,
  },
  {
    name: 'Criador Pro',
    price: '79',
    desc: 'Análises avançadas para criadores prontos para dominar o algoritmo.',
    features: ['Tudo do plano Lite.', 'Painel de controle avançado.', 'Agendamento inteligente com IA.', 'Até 10 perfis sociais.'],
    highlight: true,
  },
  {
    name: 'Criador Elite',
    price: '199',
    desc: 'Acesso ilimitado a todos os recursos e feedbacks mais precisos.',
    features: ['Tudo do plano Pro.', 'Conjunto completo de mecanismos de insights de IA.', 'Perfis sociais ilimitados.', 'Suporte 100% eficaz 24h.'],
    highlight: false,
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <Navbar />

      {/* ── Hero ── */}
      <section className="landing__hero">
        <div className="container landing__hero-inner">
          <div className="landing__hero-content">
            <motion.h1
              className="landing__hero-title"
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
            >
              Suas redes sociais<br />
              <span className="landing__hero-highlight">Simplificadas.</span>
            </motion.h1>
            <motion.p
              className="landing__hero-sub"
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
            >
              Conecte suas redes sociais e está pronto!<br />
              Poste vídeos e acompanhe métricas com inteligência Artificial.
            </motion.p>
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
            >
              <Button variant="outline" size="lg" onClick={() => navigate('/cadastro')}>
                Começar agora
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="landing__hero-image"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="landing__hero-deb">
              <img src={debPhone} alt="Deb" className="landing__deb-img" />
              {SOCIAL_ICONS.map(({ icon: Icon, color, label, cls }, i) => (
                <motion.div
                  key={label}
                  className={`landing__social-icon ${cls}`}
                  style={{ '--icon-color': color }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                >
                  <Icon size={22} color={color} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing__features" id="funcionalidades">
        <div className="container">
          <motion.h2
            className="landing__section-title"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            Funcionalidades que trabalham para <strong>seu progresso</strong>
          </motion.h2>

          <div className="landing__features-grid">
            {FEATURES.map(({ icon: Icon, title, desc, wide }, i) => (
              <motion.div
                key={title}
                className={`landing__feature-card ${wide ? 'landing__feature-card--wide' : ''}`}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
              >
                <div className="landing__feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                {wide && (
                  <a className="landing__feature-link" href="/cadastro">
                    Cadastre-se para ver funções →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing__cta-banner">
        <div className="container">
          <motion.div
            className="landing__cta-box"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <h2>Simplifique sua rotina, domine<br />seus resultados.</h2>
            <p>Tudo o que você precisa para postar rápido e entender exatamente como sua conta está performando, em um único lugar.</p>
            <Button variant="outline" onClick={() => navigate('/cadastro')}>Começar agora</Button>
          </motion.div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="landing__about" id="sobre">
        <div className="container landing__about-inner">
          <motion.img
            src={debTablet}
            alt="Deb com tablet"
            className="landing__about-deb"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />

          <div className="landing__about-content">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Sobre o <strong>HubStudio</strong>
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              O <strong>HubStudio</strong> é uma plataforma completa voltada à gestão de redes sociais e ao marketing digital. Sua missão é auxiliar criadores de conteúdo, agências e empresas a crescerem e alcançarem sucesso no ambiente online, de forma simples, eficiente e estratégica.
            </motion.p>

            <div className="landing__about-divider">
              <span>Nossa Missão</span>
            </div>

            <div className="landing__mission-grid">
              {MISSION.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  className="landing__mission-card"
                  variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                >
                  <Icon size={28} />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>

            <div className="landing__values">
              <h3>Nossos Valores</h3>
              <div className="landing__values-grid">
                {VALUES.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    className="landing__value-card"
                    variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i}
                  >
                    <div className="landing__value-header">
                      <div className="landing__value-icon"><Icon size={18} /></div>
                      <strong>{label}</strong>
                    </div>
                    <p>{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="landing__pricing">
        <div className="container">
          <motion.h2
            className="landing__section-title"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            Projetado para cada etapa
          </motion.h2>
          <motion.p
            className="landing__section-sub"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          >
            Preços transparentes para a próxima geração de criadores digitais.
          </motion.p>

          <div className="landing__plans">
            {PLANS.map(({ name, price, desc, features, highlight }, i) => (
              <motion.div
                key={name}
                className={`landing__plan ${highlight ? 'landing__plan--highlight' : ''}`}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
              >
                {highlight && <div className="landing__plan-badge">MAIS POPULAR</div>}
                <h3 className="landing__plan-name">{name}</h3>
                <div className="landing__plan-price">
                  <span className="landing__plan-currency">$</span>
                  <span className="landing__plan-amount">{price}</span>
                  <span className="landing__plan-period">/mês</span>
                </div>
                <p className="landing__plan-desc">{desc}</p>
                <ul className="landing__plan-features">
                  {features.map(f => (
                    <li key={f}>
                      <span className="landing__plan-dash">—</span> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={highlight ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => navigate('/cadastro')}
                >
                  COMECE AGORA
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { motion } from 'framer-motion'
import {
  LuUsers, LuUserPlus, LuShieldCheck, LuClock,
  LuActivity, LuMail, LuConstruction,
} from 'react-icons/lu'
import { dashFadeUp as fadeUp } from '../../../styles/animations'
import './Equipes.css'

const FEATURES = [
  {
    icon: LuUserPlus,
    title: 'Convide sua equipe',
    desc: 'Adicione membros por e-mail e atribua papéis: Admin, Gerente, Editor, Revisor ou Visualizador.',
  },
  {
    icon: LuShieldCheck,
    title: 'Aprovação por papel',
    desc: 'Configure fluxos onde posts de Editores passam por revisão de um Gerente antes de irem ao ar.',
  },
  {
    icon: LuClock,
    title: 'Fila de aprovação',
    desc: 'Veja todos os posts pendentes, com preview, comentários e ações rápidas (Aprovar / Pedir alterações / Rejeitar).',
  },
  {
    icon: LuActivity,
    title: 'Atividade da equipe',
    desc: 'Histórico em tempo real: quem criou, quem aprovou, quem publicou. Total transparência.',
  },
]

export default function Equipes() {
  return (
    <div className="teams-page">
      <motion.div
        className="teams-page__hero"
        variants={fadeUp} initial="hidden" animate="visible"
      >
        <div className="teams-page__icon">
          <LuUsers size={32} />
        </div>
        <span className="teams-page__badge">
          <LuConstruction size={12} /> Em desenvolvimento
        </span>
        <h1>Trabalhe melhor em equipe</h1>
        <p>
          Convide colegas, defina papéis e estabeleça fluxos de aprovação.
          Ideal para agências, times de marketing e empresas que precisam
          de governança nos posts.
        </p>
      </motion.div>

      <div className="teams-page__grid">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div
              key={f.title}
              className="teams-page__feature"
              variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            >
              <div className="teams-page__feature-icon"><Icon size={20} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        className="teams-page__notify"
        variants={fadeUp} initial="hidden" animate="visible" custom={6}
      >
        <LuMail size={18} />
        <div>
          <strong>Quer ser avisado quando estiver pronto?</strong>
          <p>Cadastre seu interesse e te avisamos por e-mail no lançamento.</p>
        </div>
        <button type="button">Quero ser avisado</button>
      </motion.div>
    </div>
  )
}

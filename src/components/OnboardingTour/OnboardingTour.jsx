import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuLayoutDashboard, LuSparkles, LuCalendarClock,
  LuBell, LuKeyboard, LuArrowRight, LuX, LuCircleCheck,
} from 'react-icons/lu'
import './OnboardingTour.css'

const STORAGE_KEY = 'hs-onboarding-done'

const STEPS = [
  {
    icon: LuLayoutDashboard,
    title: 'Bem-vindo ao HubStudio!',
    text: 'Centralize gestão, agendamento e análise das suas redes sociais em um só lugar. Vamos te mostrar o essencial em 5 passos.',
  },
  {
    icon: LuSparkles,
    title: 'Acompanhe seu desempenho',
    text: 'No Dashboard você vê visualizações, seguidores, engajamento e seu público em tempo real. Use os filtros pra recortar por período e rede social.',
  },
  {
    icon: LuCalendarClock,
    title: 'Agende com inteligência',
    text: 'O card "Melhor horário para postar" te diz exatamente quando publicar. Clique no botão "Posts" da sidebar pra criar uma publicação a qualquer momento.',
  },
  {
    icon: LuBell,
    title: 'Não perca nenhuma novidade',
    text: 'O sino no topo da página mostra notificações importantes: posts agendados, metas atingidas e alertas. Você pode dispensar individualmente ou marcar todas como lidas.',
  },
  {
    icon: LuKeyboard,
    title: 'Mais rápido com atalhos',
    text: 'Use Ctrl + K (ou Cmd + K) pra abrir a busca global. Aperte ? a qualquer momento pra ver todos os atalhos disponíveis.',
  },
]

export default function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Abre na primeira visita (sem flag no localStorage)
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setOpen(true), 500)
      return () => clearTimeout(t)
    }
  }, [])

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  const next = () => {
    if (step === STEPS.length - 1) finish()
    else setStep(s => s + 1)
  }
  const skip = () => finish()
  const goTo = (i) => setStep(i)

  const current = STEPS[step]
  const Icon = current?.icon
  const isLast = step === STEPS.length - 1

  return (
    <AnimatePresence>
      {open && current && (
        <div className="onboarding-root">
          <motion.div
            className="onboarding__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="onboarding"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="onboarding__close"
              onClick={skip}
              aria-label="Pular tour"
            >
              <LuX size={16} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="onboarding__content"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="onboarding__icon">
                  <Icon size={28} />
                </div>
                <h2>{current.title}</h2>
                <p>{current.text}</p>
              </motion.div>
            </AnimatePresence>

            <div className="onboarding__dots" role="tablist">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`onboarding__dot${i === step ? ' onboarding__dot--active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Passo ${i + 1}`}
                  aria-selected={i === step}
                  role="tab"
                />
              ))}
            </div>

            <div className="onboarding__footer">
              <button
                type="button"
                className="onboarding__skip"
                onClick={skip}
              >
                Pular tour
              </button>
              <button
                type="button"
                className="onboarding__next"
                onClick={next}
              >
                {isLast ? (
                  <>Começar <LuCircleCheck size={14} /></>
                ) : (
                  <>Próximo <LuArrowRight size={14} /></>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

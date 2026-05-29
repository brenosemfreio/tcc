import { useState, useEffect, useRef } from 'react'
import { LuChevronDown, LuCheck, LuPlus, LuSettings } from 'react-icons/lu'
import { useTeam } from '../../../../contexts/TeamContext'
import { ROLES } from '../../../../services/team'

const initial = (name) => name.charAt(0).toUpperCase()

export default function TeamSwitcher({ onCreateClick }) {
  const { teams, currentTeam, switchTeam } = useTeam()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!currentTeam) return null

  return (
    <div className="team-switcher" ref={ref}>
      <button
        type="button"
        className="team-switcher__trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div
          className="team-switcher__avatar"
          style={{ background: currentTeam.color }}
        >
          {initial(currentTeam.name)}
        </div>
        <div className="team-switcher__info">
          <strong>{currentTeam.name}</strong>
          <span>{ROLES[currentTeam.role]?.label || currentTeam.role} · Plano {currentTeam.plan}</span>
        </div>
        <LuChevronDown
          size={16}
          className={`team-switcher__chev${open ? ' team-switcher__chev--open' : ''}`}
        />
      </button>

      {open && (
        <div className="team-switcher__menu" role="listbox">
          <div className="team-switcher__menu-head">Seus times</div>

          <div className="team-switcher__list">
            {teams.map(team => {
              const isActive = team.id === currentTeam.id
              return (
                <button
                  key={team.id}
                  type="button"
                  className={`team-switcher__item${isActive ? ' team-switcher__item--active' : ''}`}
                  onClick={() => { switchTeam(team.id); setOpen(false) }}
                >
                  <div
                    className="team-switcher__avatar team-switcher__avatar--sm"
                    style={{ background: team.color }}
                  >
                    {initial(team.name)}
                  </div>
                  <div className="team-switcher__item-info">
                    <strong>{team.name}</strong>
                    <span>{ROLES[team.role]?.label} · {team.totalMembers} {team.totalMembers === 1 ? 'membro' : 'membros'}</span>
                  </div>
                  {isActive && <LuCheck size={14} className="team-switcher__check" />}
                </button>
              )
            })}
          </div>

          <div className="team-switcher__divider" />

          <button
            type="button"
            className="team-switcher__action"
            onClick={() => { setOpen(false); onCreateClick() }}
          >
            <LuPlus size={14} /> Criar nova equipe
          </button>
        </div>
      )}
    </div>
  )
}

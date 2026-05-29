import {
  LuUsers, LuMail, LuShieldCheck, LuCheck, LuActivity,
} from 'react-icons/lu'

const TABS = [
  { id: 'membros',    label: 'Membros',     Icon: LuUsers },
  { id: 'convites',   label: 'Convites',    Icon: LuMail,        countKey: 'invites', warn: true },
  { id: 'papeis',     label: 'Papéis',      Icon: LuShieldCheck },
  { id: 'aprovacao',  label: 'Aprovação',   Icon: LuCheck },
  { id: 'atividade',  label: 'Atividade',   Icon: LuActivity },
]

export default function EquipesTabs({ active, onChange, counts = {} }) {
  return (
    <div className="eq-tabs" role="tablist">
      {TABS.map(tab => {
        const Icon = tab.Icon
        const count = counts[tab.countKey] || 0
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`eq-tabs__tab${active === tab.id ? ' eq-tabs__tab--active' : ''}${tab.warn && count > 0 ? ' eq-tabs__tab--warn' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={15} />
            {tab.label}
            {count > 0 && <span className="eq-tabs__count">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}

import { LuUsers, LuMail, LuClock, LuCrown } from 'react-icons/lu'
import { PLAN_LIMITS } from '../../../../services/team'

export default function EquipesHeader({ team, members, invites, pendingPosts }) {
  if (!team) return null

  const planMeta = PLAN_LIMITS[team.plan]
  const usedSlots = members.length
  const isUnlimited = planMeta.maxUsers === Infinity

  return (
    <div className="eq-header">
      <div className="eq-header__top">
        <div className="eq-header__title">
          <div className="eq-header__avatar">
            <LuUsers size={26} />
          </div>
          <div>
            <h1>{team.name}</h1>
            <span className="eq-header__plan">
              <LuCrown size={13} />
              Plano {planMeta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Stats em pílulas */}
      <div className="eq-header__stats">
        <div className="eq-stat">
          <span className="eq-stat__icon" style={{ color: 'var(--color-primary)' }}>
            <LuUsers size={16} />
          </span>
          <div className="eq-stat__body">
            <strong>{usedSlots}{!isUnlimited && ` / ${planMeta.maxUsers}`}</strong>
            <span>Membros</span>
          </div>
        </div>

        <div className="eq-stat">
          <span className="eq-stat__icon" style={{ color: 'var(--color-warning)' }}>
            <LuMail size={16} />
          </span>
          <div className="eq-stat__body">
            <strong>{invites.length}</strong>
            <span>Convites pendentes</span>
          </div>
        </div>

        <div className="eq-stat">
          <span className="eq-stat__icon" style={{ color: 'var(--color-success)' }}>
            <LuClock size={16} />
          </span>
          <div className="eq-stat__body">
            <strong>{pendingPosts}</strong>
            <span>Posts aguardando</span>
          </div>
        </div>
      </div>

      {/* Banner de limite (só se não unlimited e tem 2/3 ou mais ocupado) */}
      {!isUnlimited && usedSlots / planMeta.maxUsers >= 0.66 && (
        <div className="eq-header__limit">
          <strong>
            {usedSlots >= planMeta.maxUsers
              ? `Você atingiu o limite de membros do plano ${planMeta.label}.`
              : `Restam ${planMeta.maxUsers - usedSlots} ${planMeta.maxUsers - usedSlots === 1 ? 'vaga' : 'vagas'} no plano ${planMeta.label}.`}
          </strong>
          <span>Faça upgrade pra Elite e tenha membros ilimitados.</span>
          <button type="button">Ver planos</button>
        </div>
      )}
    </div>
  )
}

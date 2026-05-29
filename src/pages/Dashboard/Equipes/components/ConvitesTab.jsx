import { LuMail, LuRefreshCw, LuX, LuUserPlus, LuInbox } from 'react-icons/lu'
import RoleBadge from './RoleBadge'

function timeAgo(iso) {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 3600)  return `há ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`
  return `há ${Math.floor(diff / 86400)}d`
}

export default function ConvitesTab({ invites, onResend, onCancel, onInviteClick }) {
  return (
    <div className="convites-tab">
      <div className="convites-tab__head">
        <div>
          <h3>Convites pendentes</h3>
          <p>Pessoas que você convidou mas ainda não aceitaram.</p>
        </div>
        <button type="button" className="convites-tab__invite" onClick={onInviteClick}>
          <LuUserPlus size={14} /> Novo convite
        </button>
      </div>

      {invites.length === 0 ? (
        <div className="convites-tab__empty">
          <div className="convites-tab__empty-icon"><LuInbox size={28} /></div>
          <h4>Nenhum convite pendente</h4>
          <p>Todos os convites foram aceitos. Bora chamar mais gente?</p>
          <button type="button" onClick={onInviteClick}>
            <LuUserPlus size={14} /> Convidar membro
          </button>
        </div>
      ) : (
        <div className="convites-tab__list">
          {invites.map(inv => (
            <div key={inv.id} className="invite-row">
              <div className="invite-row__icon">
                <LuMail size={18} />
              </div>
              <div className="invite-row__info">
                <strong>{inv.email}</strong>
                <span>
                  Convidado por {inv.invitedBy} {timeAgo(inv.invitedAt)}
                </span>
              </div>
              <RoleBadge role={inv.role} size="sm" />
              <div className="invite-row__actions">
                <button type="button" onClick={() => onResend(inv.id)} title="Reenviar">
                  <LuRefreshCw size={14} /> Reenviar
                </button>
                <button
                  type="button"
                  className="invite-row__cancel"
                  onClick={() => onCancel(inv.id)}
                  title="Cancelar convite"
                >
                  <LuX size={14} /> Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

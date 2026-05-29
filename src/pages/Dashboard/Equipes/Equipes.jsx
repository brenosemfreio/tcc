import { useState, useEffect } from 'react'
import {
  getTeamMembers, getPendingInvites, getApprovalConfig,
  getTeamActivity,
} from '../../../services/team'
import { useAuth } from '../../../contexts/AuthContext'
import { useTeam } from '../../../contexts/TeamContext'
import EquipesHeader from './components/EquipesHeader'
import EquipesTabs from './components/EquipesTabs'
import MembrosTab from './components/MembrosTab'
import ConvitesTab from './components/ConvitesTab'
import PapeisTab from './components/PapeisTab'
import AprovacaoTab from './components/AprovacaoTab'
import AtividadeTab from './components/AtividadeTab'
import InviteModal from './components/InviteModal'
import CreateTeamModal from './components/CreateTeamModal'
import './Equipes.css'

export default function Equipes() {
  const { user } = useAuth()
  const { currentTeam, createTeam } = useTeam()

  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [config, setConfig] = useState(null)
  const [activity, setActivity] = useState([])

  const [activeTab, setActiveTab] = useState('membros')
  const [showInvite, setShowInvite] = useState(false)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [flash, setFlash] = useState('')

  // Recarrega dados quando o time atual muda
  useEffect(() => {
    if (!currentTeam) return
    Promise.all([
      getTeamMembers(currentTeam.id),
      getPendingInvites(currentTeam.id),
      getApprovalConfig(currentTeam.id),
      getTeamActivity(currentTeam.id),
    ]).then(([m, i, c, a]) => {
      setMembers(m)
      setInvites(i)
      setConfig(c)
      setActivity(a)
    })
  }, [currentTeam?.id])

  const flashMsg = (msg, ms = 2200) => {
    setFlash(msg)
    setTimeout(() => setFlash(''), ms)
  }

  // ── Ações de membros ──
  const handleRoleChange = (memberId, newRole) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m))
    flashMsg('Papel atualizado!')
  }
  const handleRemove = (memberId) => {
    const m = members.find(x => x.id === memberId)
    if (!m) return
    if (!window.confirm(`Remover ${m.name} do time?`)) return
    setMembers(prev => prev.filter(x => x.id !== memberId))
    flashMsg('Membro removido.')
  }

  // ── Convites ──
  const handleInvite = ({ email, role }) => {
    const newInvite = {
      id: `inv-${Date.now()}`,
      email,
      role,
      invitedBy: user?.name || 'Você',
      invitedAt: new Date().toISOString(),
    }
    setInvites(prev => [newInvite, ...prev])
    setActiveTab('convites')
    flashMsg(`Convite enviado pra ${email}!`)
  }
  const handleResend = (inviteId) => {
    const inv = invites.find(i => i.id === inviteId)
    if (!inv) return
    flashMsg(`Convite reenviado pra ${inv.email}.`)
  }
  const handleCancelInvite = (inviteId) => {
    setInvites(prev => prev.filter(i => i.id !== inviteId))
    flashMsg('Convite cancelado.')
  }

  // ── Configuração de aprovação ──
  const handleToggleConfig = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }))
    flashMsg('Configuração salva.')
  }
  const handleRemoveApprover = (memberId) => {
    setConfig(prev => ({
      ...prev,
      defaultApproverIds: prev.defaultApproverIds.filter(id => id !== memberId),
    }))
    flashMsg('Aprovador removido.')
  }

  const handleCreateTeam = (data) => {
    const newTeam = createTeam(data)
    flashMsg(`Bem-vindo ao ${newTeam.name}! 🎉`)
  }

  if (!currentTeam) {
    return (
      <div className="eq-loading">
        <p>Carregando equipe...</p>
      </div>
    )
  }

  return (
    <div className="eq-page">
      <EquipesHeader
        team={currentTeam}
        members={members}
        invites={invites}
        pendingPosts={currentTeam.pendingPosts}
        onCreateTeam={() => setShowCreateTeam(true)}
      />

      <EquipesTabs
        active={activeTab}
        onChange={setActiveTab}
        counts={{ invites: invites.length }}
        key={currentTeam.id}
      />

      <div className="eq-content">
        {activeTab === 'membros' && (
          <MembrosTab
            members={members}
            currentUserId={'u1'}                   // mock: usuário atual
            onRoleChange={handleRoleChange}
            onRemove={handleRemove}
            onInviteClick={() => setShowInvite(true)}
          />
        )}

        {activeTab === 'convites' && (
          <ConvitesTab
            invites={invites}
            onResend={handleResend}
            onCancel={handleCancelInvite}
            onInviteClick={() => setShowInvite(true)}
          />
        )}

        {activeTab === 'papeis' && <PapeisTab />}

        {activeTab === 'aprovacao' && (
          <AprovacaoTab
            config={config}
            members={members}
            onToggle={handleToggleConfig}
            onRemoveApprover={handleRemoveApprover}
            pendingCount={currentTeam.pendingPosts}
          />
        )}

        {activeTab === 'atividade' && <AtividadeTab events={activity} />}
      </div>

      <InviteModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        onInvite={handleInvite}
      />

      <CreateTeamModal
        isOpen={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        onCreate={handleCreateTeam}
      />

      {/* Toast de feedback */}
      {flash && (
        <div className="eq-toast">{flash}</div>
      )}
    </div>
  )
}

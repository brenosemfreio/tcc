/**
 * Mocks de equipe — membros, convites, atividade, configurações.
 * Estrutura espelhando o que o backend devolveria.
 */

export const ROLES = {
  admin: {
    id: 'admin',
    label: 'Admin',
    color: '#DC2626',
    description: 'Controle total. Inclui financeiro e configurações da conta.',
  },
  manager: {
    id: 'manager',
    label: 'Gerente',
    color: '#4F35E8',
    description: 'Aprova posts, gerencia equipe e vê analytics completo.',
  },
  editor: {
    id: 'editor',
    label: 'Editor',
    color: '#0EA5E9',
    description: 'Cria e agenda posts (sujeito a aprovação).',
  },
  reviewer: {
    id: 'reviewer',
    label: 'Revisor',
    color: '#F59E0B',
    description: 'Aprova/comenta nos posts, mas não cria.',
  },
  viewer: {
    id: 'viewer',
    label: 'Visualizador',
    color: '#6B7280',
    description: 'Read-only — vê analytics e calendário, não interage.',
  },
}

export const ROLE_ORDER = ['admin', 'manager', 'editor', 'reviewer', 'viewer']

// Matriz de permissões — qual papel pode fazer o quê
export const PERMISSIONS = [
  { key: 'createPost',        label: 'Criar posts' },
  { key: 'scheduleDirectly',  label: 'Agendar sem aprovação' },
  { key: 'approve',           label: 'Aprovar/rejeitar' },
  { key: 'manageMembers',     label: 'Gerenciar membros' },
  { key: 'viewAnalytics',     label: 'Ver analytics' },
  { key: 'accountSettings',   label: 'Configurações da conta' },
  { key: 'billing',           label: 'Pagamentos e plano' },
]

export const PERMISSION_MATRIX = {
  admin:    { createPost: true,  scheduleDirectly: true,  approve: true,  manageMembers: true,  viewAnalytics: true, accountSettings: true,  billing: true  },
  manager:  { createPost: true,  scheduleDirectly: true,  approve: true,  manageMembers: true,  viewAnalytics: true, accountSettings: false, billing: false },
  editor:   { createPost: true,  scheduleDirectly: false, approve: false, manageMembers: false, viewAnalytics: true, accountSettings: false, billing: false },
  reviewer: { createPost: false, scheduleDirectly: false, approve: true,  manageMembers: false, viewAnalytics: true, accountSettings: false, billing: false },
  viewer:   { createPost: false, scheduleDirectly: false, approve: false, manageMembers: false, viewAnalytics: true, accountSettings: false, billing: false },
}

// Limites por plano
export const PLAN_LIMITS = {
  lite:  { label: 'Lite',  maxUsers: 1,        allowsApproval: false },
  pro:   { label: 'Pro',   maxUsers: 5,        allowsApproval: false },
  elite: { label: 'Elite', maxUsers: Infinity, allowsApproval: true  },
}

// ── Membros mockados ──
const MEMBERS = [
  {
    id: 'u1', name: 'Breno Dantas', email: 'breno.dantas.pc@gmail.com',
    role: 'admin', joinedAt: '2026-01-12T10:00:00', lastActive: 'agora',
  },
  {
    id: 'u2', name: 'Maria Costa', email: 'maria@hubstudio.com',
    role: 'manager', joinedAt: '2026-02-04T14:20:00', lastActive: '2h',
  },
  {
    id: 'u3', name: 'Carlos Souza', email: 'carlos@hubstudio.com',
    role: 'manager', joinedAt: '2026-02-18T09:30:00', lastActive: '5h',
  },
  {
    id: 'u4', name: 'João Silva', email: 'joao@hubstudio.com',
    role: 'editor', joinedAt: '2026-03-22T16:45:00', lastActive: 'agora',
  },
  {
    id: 'u5', name: 'Lucas Santos', email: 'lucas@hubstudio.com',
    role: 'editor', joinedAt: '2026-04-01T11:15:00', lastActive: '1d',
  },
  {
    id: 'u6', name: 'Ana Beatriz', email: 'ana@hubstudio.com',
    role: 'reviewer', joinedAt: '2026-04-10T08:00:00', lastActive: '3d',
  },
  {
    id: 'u7', name: 'Pedro Henrique', email: 'pedro@cliente.com',
    role: 'viewer', joinedAt: '2026-04-25T15:20:00', lastActive: '1sem',
  },
]

export const getTeamMembers = () => Promise.resolve(MEMBERS)

// ── Convites pendentes ──
const INVITES = [
  {
    id: 'i1', email: 'estagiario@empresa.com', role: 'editor',
    invitedBy: 'Breno Dantas', invitedAt: '2026-05-26T16:30:00',
  },
  {
    id: 'i2', email: 'cliente.novo@gmail.com', role: 'viewer',
    invitedBy: 'Maria Costa', invitedAt: '2026-05-25T10:15:00',
  },
]

export const getPendingInvites = () => Promise.resolve(INVITES)

// ── Configuração de fluxo de aprovação ──
const APPROVAL_CONFIG = {
  requireApprovalFromEditors: true,
  requireDoubleApprovalAbove100k: false,
  autoApproveScheduled48h: false,
  notifyManagersAfter24h: true,
  defaultApproverIds: ['u2', 'u3'],
}

export const getApprovalConfig = () => Promise.resolve(APPROVAL_CONFIG)

// ── Time / informações gerais ──
export const getTeamInfo = () => Promise.resolve({
  name: 'HubStudio Team',
  plan: 'elite',           // 'lite' | 'pro' | 'elite'
  totalMembers: MEMBERS.length,
  pendingInvites: INVITES.length,
  pendingPosts: 1,         // posts aguardando aprovação (vem do posts service)
})

// ── Feed de atividade ──
const ACTIVITY = [
  {
    id: 'a1', type: 'post-approved',
    actor: 'Maria Costa', target: '5 dicas para aumentar seu engajamento',
    targetUser: 'João Silva', at: '2026-05-28T14:32:00',
  },
  {
    id: 'a2', type: 'post-created',
    actor: 'João Silva', target: 'Story de bastidores',
    at: '2026-05-28T11:08:00',
  },
  {
    id: 'a3', type: 'member-added',
    actor: 'Breno Dantas', target: 'Carlos Souza',
    extra: { role: 'manager' }, at: '2026-05-28T09:00:00',
  },
  {
    id: 'a4', type: 'post-submitted',
    actor: 'Lucas Santos', target: 'Promo Black Friday',
    at: '2026-05-27T18:20:00',
  },
  {
    id: 'a5', type: 'post-rejected',
    actor: 'Maria Costa', target: 'Texto sobre concorrente',
    targetUser: 'Lucas Santos',
    extra: { reason: 'Evita citar concorrentes diretamente.' },
    at: '2026-05-26T15:45:00',
  },
  {
    id: 'a6', type: 'post-scheduled',
    actor: 'Carlos Souza', target: 'Como criar conteúdo que conecta',
    at: '2026-05-26T10:00:00',
  },
  {
    id: 'a7', type: 'role-changed',
    actor: 'Breno Dantas', target: 'Ana Beatriz',
    extra: { from: 'editor', to: 'reviewer' },
    at: '2026-05-25T14:00:00',
  },
  {
    id: 'a8', type: 'config-changed',
    actor: 'Breno Dantas', target: 'Fluxo de aprovação',
    extra: { detail: 'Ativada aprovação obrigatória pra Editores' },
    at: '2026-05-24T16:30:00',
  },
  {
    id: 'a9', type: 'post-published',
    actor: 'Sistema', target: 'Seus Reels alcançaram 2x do nada',
    at: '2026-05-15T20:00:00',
  },
]

export const getTeamActivity = () => Promise.resolve(ACTIVITY)

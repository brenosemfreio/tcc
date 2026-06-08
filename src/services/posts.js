export const getTopPosts = () => Promise.resolve([
  { id: 1, title: '5 dicas para aumentar seu engajamento', date: '18 de maio de 2026', views: '12.4K', likes: '1.3K', comments: '2.6K' },
  { id: 2, title: 'Seus Reels alcançaram 2 do nada',       date: '15 de maio de 2026', views: '9.8K',  likes: '872',  comments: '1.9K' },
  { id: 3, title: 'Como criar conteúdo que conecta',       date: '12 de maio de 2026', views: '8.1K',  likes: '634',  comments: '1.3K' },
  { id: 4, title: 'Pensamentos que facilitam sua rotina',  date: '09 de maio de 2026', views: '7.2K',  likes: '512',  comments: '1.1K' },
  { id: 5, title: 'Checklist para posts de sucesso',       date: '05 de maio de 2026', views: '6.5K',  likes: '432',  comments: '980'  },
])

export const getRecentPosts = () => Promise.resolve([
  { id: 1, title: '5 dicas para aumentar...',            date: '22/05/2026', time: '10:30', status: 'published', network: 'instagram' },
  { id: 2, title: 'Story: Como planejar meus conteúdos', date: '21/05/2026', time: '16:00', status: 'published', network: 'instagram' },
  { id: 3, title: 'Bests: Como planejar meus conteúdos', date: '20/05/2026', time: '09:00', status: 'published', network: 'instagram' },
  { id: 4, title: 'Rascunho: ideias para a semana',      date: '—',          time: '—',     status: 'draft',     network: 'instagram' },
])

/**
 * Calendário: mapa de DATAS reais → status, montado relativo ao dia de hoje.
 * Chave no formato `${ano}-${mês0indexado}-${dia}`. Regra realista:
 *   - publicado  → dias no passado
 *   - agendado   → dias no futuro
 *   - rascunho   → futuro próximo (planejado, sem data fixa)
 * Meses distantes (ex: 2035 ou 1905) ficam vazios, como esperado.
 */
export const getCalendarMarkers = () => {
  const today = new Date()
  const y = today.getFullYear()
  const m = today.getMonth()
  const d = today.getDate()

  const map = {}
  const daysIn = (yy, mm) => new Date(yy, mm + 1, 0).getDate()
  const set = (yy, mm, dd, status) => {
    if (dd < 1 || dd > daysIn(yy, mm)) return
    map[`${yy}-${mm}-${dd}`] = status
  }

  // Mês atual — passado publicado, futuro agendado/rascunho
  ;[d - 2, d - 5, d - 9, d - 14, d - 19].forEach(dd => set(y, m, dd, 'published'))
  ;[d + 2, d + 5, d + 12].forEach(dd => set(y, m, dd, 'scheduled'))
  ;[d + 1, d + 8].forEach(dd => set(y, m, dd, 'draft'))

  // Mês anterior — histórico de publicados
  const pm = m === 0 ? 11 : m - 1
  const py = m === 0 ? y - 1 : y
  ;[3, 7, 11, 16, 21, 26].forEach(dd => set(py, pm, dd, 'published'))

  // Próximo mês — alguns agendados + um rascunho
  const nm = m === 11 ? 0 : m + 1
  const ny = m === 11 ? y + 1 : y
  ;[5, 10, 18, 24].forEach(dd => set(ny, nm, dd, 'scheduled'))
  set(ny, nm, 14, 'draft')

  return Promise.resolve(map)
}

import { LuMessageSquare, LuChartBar, LuHash } from 'react-icons/lu'

export const getAiSuggestions = () => Promise.resolve([
  { id: 1, icon: LuMessageSquare, label: 'Ideia de post', text: 'Faça um post sobre tendências do seu nicho este mês!', action: 'Gerar' },
  { id: 2, icon: LuChartBar,      label: 'Engajamento',   text: 'Clique para gerar legendas envolventes.',              action: 'Gerar' },
  { id: 3, icon: LuHash,          label: 'Hashtags',      text: '#marketingdigital #branding #redessociais',           action: 'Copiar' },
])

export const schedulePost = (data) => Promise.resolve({ id: Date.now(), ...data, status: 'scheduled' })

// Próximos posts agendados (fila) — relativo ao "agora" mockado.
export const getUpcomingPosts = () => Promise.resolve([
  { id: 1, title: 'Como criar conteúdo que conecta', network: 'instagram', date: '30 mai', time: '19:00', countdown: 'Hoje' },
  { id: 2, title: 'Pensamentos que facilitam sua rotina', network: 'tiktok', date: '02 jun', time: '09:00', countdown: 'em 3 dias' },
  { id: 3, title: 'Checklist para posts de sucesso', network: 'linkedin', date: '05 jun', time: '11:00', countdown: 'em 6 dias' },
  { id: 4, title: 'Bastidores do meu setup', network: 'youtube', date: '08 jun', time: '15:00', countdown: 'em 9 dias' },
])

/**
 * Posts mock — estrutura completa preparada pro workflow de equipe.
 * Em modo solo, o `author` é sempre o usuário atual e ele aprova auto.
 * Quando a página de Equipes existir, a aprovação real entra via `status: 'pending'`.
 */
const ALL_POSTS = [
  {
    id: 'p1',
    title: '5 dicas para aumentar seu engajamento',
    content: 'Quer turbinar seu engajamento? Aqui vão 5 dicas práticas que aplicamos no nosso perfil este mês.\n\n1) Poste consistentemente\n2) Use carrosséis\n3) Hooks fortes nos primeiros 3 segundos\n4) Responda todos os comentários\n5) Faça lives mensais',
    networks: ['instagram', 'tiktok'],
    type: 'carousel',
    status: 'published',
    author: { id: 'u1', name: 'Breno Dantas', email: 'breno.dantas.pc@gmail.com' },
    approver: { id: 'u1', name: 'Breno Dantas' },
    scheduledFor: '2026-05-18T14:00:00',
    publishedAt: '2026-05-18T14:00:00',
    submittedAt: null,
    approvedAt: '2026-05-18T13:55:00',
    rejectedAt: null,
    comments: [],
    metrics: { views: 12400, likes: 1300, comments: 2600, shares: 184 },
    media: [{ type: 'image', url: null }],
  },
  {
    id: 'p2',
    title: 'Seus Reels alcançaram 2x do nada',
    content: 'A gente nem tinha planejado, mas esses Reels viralizaram. Vou abrir a estratégia que funcionou.',
    networks: ['instagram'],
    type: 'reel',
    status: 'published',
    author: { id: 'u1', name: 'Breno Dantas', email: 'breno.dantas.pc@gmail.com' },
    approver: { id: 'u1', name: 'Breno Dantas' },
    scheduledFor: '2026-05-15T20:00:00',
    publishedAt: '2026-05-15T20:00:00',
    submittedAt: null,
    approvedAt: '2026-05-15T19:58:00',
    rejectedAt: null,
    comments: [],
    metrics: { views: 9800, likes: 872, comments: 1900, shares: 92 },
    media: [{ type: 'video', url: null }],
  },
  {
    id: 'p3',
    title: 'Como criar conteúdo que conecta',
    content: 'Conteúdo bom não é só bonito — é o que faz a pessoa se sentir vista. Hoje vou te mostrar como.',
    networks: ['instagram', 'youtube'],
    type: 'post',
    status: 'scheduled',
    author: { id: 'u1', name: 'Breno Dantas', email: 'breno.dantas.pc@gmail.com' },
    approver: { id: 'u1', name: 'Breno Dantas' },
    scheduledFor: '2026-05-30T19:00:00',
    publishedAt: null,
    submittedAt: null,
    approvedAt: '2026-05-26T10:00:00',
    rejectedAt: null,
    comments: [],
    metrics: null,
    media: [{ type: 'image', url: null }],
  },
  {
    id: 'p4',
    title: 'Pensamentos que facilitam sua rotina',
    content: 'Lista das 3 frases que mais uso pra desbloquear quando travo.',
    networks: ['instagram', 'tiktok'],
    type: 'reel',
    status: 'scheduled',
    author: { id: 'u1', name: 'Breno Dantas', email: 'breno.dantas.pc@gmail.com' },
    approver: { id: 'u1', name: 'Breno Dantas' },
    scheduledFor: '2026-06-02T09:00:00',
    publishedAt: null,
    submittedAt: null,
    approvedAt: '2026-05-25T16:30:00',
    rejectedAt: null,
    comments: [],
    metrics: null,
    media: [{ type: 'video', url: null }],
  },
  {
    id: 'p5',
    title: 'Rascunho: ideias para a semana',
    content: 'Ideias que tô brainstormando — preciso filtrar antes de virar post.\n\n- Tutorial de edição\n- Bastidores do meu setup\n- Tier list de apps',
    networks: ['instagram'],
    type: 'post',
    status: 'draft',
    author: { id: 'u1', name: 'Breno Dantas', email: 'breno.dantas.pc@gmail.com' },
    approver: null,
    scheduledFor: null,
    publishedAt: null,
    submittedAt: null,
    approvedAt: null,
    rejectedAt: null,
    comments: [],
    metrics: null,
    media: [],
  },
  {
    id: 'p6',
    title: 'Checklist para posts de sucesso',
    content: 'O checklist mental que rodo antes de publicar qualquer coisa.',
    networks: ['instagram', 'linkedin'],
    type: 'carousel',
    status: 'pending',
    author: { id: 'u2', name: 'Maria Silva', email: 'maria@empresa.com' },
    approver: null,
    scheduledFor: '2026-06-05T11:00:00',
    publishedAt: null,
    submittedAt: '2026-05-27T18:20:00',
    approvedAt: null,
    rejectedAt: null,
    comments: [],
    metrics: null,
    media: [{ type: 'image', url: null }],
  },
  {
    id: 'p7',
    title: 'Promo: Curso de marketing',
    content: 'Lançamento do curso na Black Friday — desconto de 60%.',
    networks: ['instagram', 'facebook'],
    type: 'post',
    status: 'failed',
    author: { id: 'u1', name: 'Breno Dantas', email: 'breno.dantas.pc@gmail.com' },
    approver: { id: 'u1', name: 'Breno Dantas' },
    scheduledFor: '2026-05-24T08:00:00',
    publishedAt: null,
    submittedAt: null,
    approvedAt: '2026-05-23T22:00:00',
    rejectedAt: null,
    failureReason: 'Token do Instagram expirou. Reconecte a conta.',
    comments: [],
    metrics: null,
    media: [{ type: 'image', url: null }],
  },
]

export const getAllPosts = () => Promise.resolve(ALL_POSTS)

export const getPostById = (id) =>
  Promise.resolve(ALL_POSTS.find(p => p.id === id) || null)

export const STATUS_META = {
  draft:     { label: 'Rascunho',              color: '#6B7280' },
  pending:   { label: 'Aguardando aprovação',  color: '#F59E0B' },
  scheduled: { label: 'Agendado',              color: '#4F35E8' },
  published: { label: 'Publicado',             color: '#10B981' },
  failed:    { label: 'Falhou',                color: '#EF4444' },
  rejected:  { label: 'Rejeitado',             color: '#EF4444' },
}

/**
 * Metadados das redes sociais para o composer.
 * Cada rede tem seus próprios tipos de conteúdo (formatos), limite de caracteres
 * e campos extras necessários (ex: YouTube exige título).
 */
export const NETWORK_META = {
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    types: [
      { id: 'feed',     label: 'Post',      orientation: 'square'   },
      { id: 'reel',     label: 'Reel',      orientation: 'vertical' },
      { id: 'story',    label: 'Story',     orientation: 'vertical' },
      { id: 'carousel', label: 'Carrossel', orientation: 'square'   },
    ],
    maxChars: 2200,
    needsTitle: false,
  },
  tiktok: {
    label: 'TikTok',
    color: '#010101',
    types: [
      { id: 'video', label: 'Vídeo', orientation: 'vertical' },
      { id: 'photo', label: 'Foto',  orientation: 'vertical' },
    ],
    maxChars: 2200,
    needsTitle: false,
  },
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    types: [
      { id: 'video',  label: 'Vídeo',  orientation: 'horizontal' },
      { id: 'shorts', label: 'Shorts', orientation: 'vertical'   },
    ],
    maxChars: 5000,
    needsTitle: true,  // YouTube sempre exige título
    needsThumbnail: true,
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    types: [
      { id: 'post', label: 'Post', orientation: 'square'   },
      { id: 'reel', label: 'Reel', orientation: 'vertical' },
    ],
    maxChars: 5000,
    needsTitle: false,
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    types: [
      { id: 'post',    label: 'Post',   orientation: 'square'     },
      { id: 'article', label: 'Artigo', orientation: 'horizontal', needsTitle: true },
    ],
    maxChars: 3000,
    needsTitle: false,
  },
  twitter: {
    label: 'X (Twitter)',
    color: '#000000',
    types: [
      { id: 'tweet',  label: 'Tweet',  orientation: 'square' },
      { id: 'thread', label: 'Thread', orientation: 'square' },
    ],
    maxChars: 280,
    needsTitle: false,
  },
}

// Helper — retorna o maior limite entre as redes selecionadas (regra: cabe em todas)
export const minMaxChars = (networks) => {
  if (!networks.length) return 5000
  return Math.min(...networks.map(n => NETWORK_META[n]?.maxChars || 5000))
}

// Helper — true se alguma rede/tipo selecionado exige título
export const needsTitle = (networks, typesByNetwork) => {
  return networks.some(n => {
    const meta = NETWORK_META[n]
    if (!meta) return false
    if (meta.needsTitle) return true
    const typeId = typesByNetwork[n]
    const typeMeta = meta.types.find(t => t.id === typeId)
    return typeMeta?.needsTitle === true
  })
}

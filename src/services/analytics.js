// Modificadores para simular variação dos dados conforme os filtros.
// Quando o backend for plugado, esses params serão enviados como query string.
const PERIOD_MULT = {
  '7d':   0.25,
  '30d':  1,
  'month': 0.85,
}

const NETWORK_MULT = {
  all:       1,
  instagram: 0.65,
  tiktok:    0.20,
  youtube:   0.10,
  twitter:   0.05,
}

const applyMult = (n, period, network) => {
  const m = (PERIOD_MULT[period] ?? 1) * (NETWORK_MULT[network] ?? 1)
  return Math.round(n * m)
}

const fmtK = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`

export const getStats = (period = '30d', network = 'all') => {
  const base = { views: 127800, followers: 8642, likes: 23700, newFollowers: 1286 }
  const changes = { views: '+16.6%', followers: '+12.4%', likes: '+21.3%', newFollowers: '+16.7%' }
  return Promise.resolve({
    views:        { value: fmtK(applyMult(base.views, period, network)),        raw: applyMult(base.views, period, network),        change: changes.views,        trend: 'up' },
    followers:    { value: applyMult(base.followers, period, network).toLocaleString('pt-BR'),    raw: applyMult(base.followers, period, network),    change: changes.followers,    trend: 'up' },
    likes:        { value: fmtK(applyMult(base.likes, period, network)),        raw: applyMult(base.likes, period, network),        change: changes.likes,        trend: 'up' },
    newFollowers: { value: applyMult(base.newFollowers, period, network).toLocaleString('pt-BR'), raw: applyMult(base.newFollowers, period, network), change: changes.newFollowers, trend: 'up' },
  })
}

const ENGAGEMENT_DAILY = [
  { date: '03/05', views: 28000, likes: 1200, comments: 450 },
  { date: '06/05', views: 31000, likes: 1380, comments: 490 },
  { date: '09/05', views: 27500, likes: 1100, comments: 410 },
  { date: '12/05', views: 34000, likes: 1600, comments: 560 },
  { date: '15/05', views: 38000, likes: 1850, comments: 620 },
  { date: '18/05', views: 33000, likes: 1450, comments: 530 },
  { date: '21/05', views: 41000, likes: 2100, comments: 710 },
  { date: '24/05', views: 36000, likes: 1700, comments: 580 },
  { date: '27/05', views: 44000, likes: 2300, comments: 790 },
  { date: '30/05', views: 39000, likes: 1950, comments: 650 },
  { date: '02/06', views: 46000, likes: 2500, comments: 840 },
]

const ENGAGEMENT_WEEKLY = [
  { date: 'Sem 1', views: 168000, likes: 7800,  comments: 2700 },
  { date: 'Sem 2', views: 195000, likes: 9200,  comments: 3200 },
  { date: 'Sem 3', views: 220000, likes: 10800, comments: 3850 },
  { date: 'Sem 4', views: 248000, likes: 12400, comments: 4300 },
]

const ENGAGEMENT_MONTHLY = [
  { date: 'Jan', views: 720000, likes: 32000, comments: 11500 },
  { date: 'Fev', views: 810000, likes: 36500, comments: 12800 },
  { date: 'Mar', views: 740000, likes: 33200, comments: 11900 },
  { date: 'Abr', views: 890000, likes: 41000, comments: 14200 },
  { date: 'Mai', views: 980000, likes: 47500, comments: 16800 },
]

export const getEngagementData = (granularity = 'daily', network = 'all') => {
  const dataset =
    granularity === 'weekly'  ? ENGAGEMENT_WEEKLY  :
    granularity === 'monthly' ? ENGAGEMENT_MONTHLY :
                                ENGAGEMENT_DAILY
  const mult = NETWORK_MULT[network] ?? 1
  return Promise.resolve(dataset.map(d => ({
    ...d,
    views:    Math.round(d.views    * mult),
    likes:    Math.round(d.likes    * mult),
    comments: Math.round(d.comments * mult),
  })))
}

export const getSocialBreakdown = () => Promise.resolve([
  { name: 'Instagram',   value: 65, color: '#E1306C' },
  { name: 'TikTok',      value: 20, color: '#010101' },
  { name: 'YouTube',     value: 10, color: '#FF0000' },
  { name: 'X (Twitter)', value: 5,  color: '#1DA1F2' },
])

export const getContentReach = () => Promise.resolve([
  { type: 'Reels',     value: 62, color: '#4F35E8' },
  { type: 'Carrossel', value: 22, color: '#7C5CFC' },
  { type: 'Imagem',    value: 10, color: '#A78BFA' },
  { type: 'Stories',   value: 6,  color: '#C4B5FD' },
])

export const getAiInsights = () => Promise.resolve([
  {
    id: 1,
    icon: '⏰',
    title: 'Melhor horário para publicar',
    text: 'Seus Reels alcançam 2.8x mais engajamento às 19h–21h.',
  },
  {
    id: 2,
    icon: '📉',
    title: 'Rede tem melhor desempenho',
    text: 'Seus Reels alcançaram 2.8x mais no Instagram este mês.',
  },
  {
    id: 3,
    icon: '#',
    title: 'Hashtags em alta',
    text: '#marketingdigital, #conteúdo e #empreendedorismo geram mais alcance.',
  },
  {
    id: 4,
    icon: '🤖',
    title: 'Dica da IA',
    text: 'Conteúdos educativos geram 45% mais salvamentos.',
  },
])

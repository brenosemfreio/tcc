export const getStats = () => Promise.resolve({
  views:       { value: '127.8K', raw: 127800, change: '+16.6%', trend: 'up' },
  followers:   { value: '8.642',  raw: 8642,   change: '+12.4%', trend: 'up' },
  likes:       { value: '23.7K',  raw: 23700,  change: '+21.3%', trend: 'up' },
  newFollowers:{ value: '1.286',  raw: 1286,   change: '+16.7%', trend: 'up' },
})

export const getEngagementData = () => Promise.resolve([
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
])

export const getSocialBreakdown = () => Promise.resolve([
  { name: 'Instagram', value: 65, color: '#E1306C' },
  { name: 'TikTok',    value: 20, color: '#010101' },
  { name: 'YouTube',   value: 10, color: '#FF0000' },
  { name: 'X (Twitter)', value: 5, color: '#1DA1F2' },
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

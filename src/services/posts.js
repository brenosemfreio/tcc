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

// Calendário: cada array contém os DIAS do mês corrente que têm o status correspondente.
export const getCalendarMarkers = () => Promise.resolve({
  scheduled: [23, 27],
  published: [5, 8, 12, 15, 22],
  draft:     [3, 17],
})

// Mantido por compatibilidade; usa o mesmo dado de scheduled.
export const getScheduledDates = () => Promise.resolve([23, 27])

export const getAiSuggestions = () => Promise.resolve([
  { id: 1, icon: '💬', label: 'Ideia de post', text: 'Faça um post sobre tendências do seu nicho este mês!', action: 'Gerar' },
  { id: 2, icon: '📊', label: 'Engajamento',   text: 'Clique para gerar legendas envolventes.',              action: 'Gerar' },
  { id: 3, icon: '#',  label: 'Hashtags',       text: '#marketingdigital #branding #redessociais',           action: 'Copiar' },
])

export const schedulePost = (data) => Promise.resolve({ id: Date.now(), ...data, status: 'scheduled' })

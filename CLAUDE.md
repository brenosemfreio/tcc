# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**HubStudio** — Gerenciador de redes sociais com agendamento de posts, analytics e insights de IA.
Frontend only (React + JavaScript + CSS puro). Backend será integrado por outra equipe.

## Commands

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # build de produção
npm run preview    # preview do build
```

## Stack

- **Vite** + React 18 + JavaScript (sem TypeScript)
- **CSS puro** com variáveis CSS (sem Tailwind, sem CSS Modules)
- **react-router-dom v6** — roteamento
- **framer-motion** — animações e transições
- **recharts** — gráficos (LineChart, PieChart)
- **react-icons** — ícones (Lucide = `Lu*`, FontAwesome = `Fa*`)

## Architecture

### Rotas

| Rota | Componente | Protegida |
|---|---|---|
| `/` | Landing | não |
| `/entrar` | Login | não |
| `/cadastro` | Cadastro | não |
| `/dashboard` | DashboardHome | sim |
| `/dashboard/configuracoes` | Configuracoes | sim |

### Contextos globais

- `AuthContext` — estado de autenticação (mock via localStorage). Exporta `useAuth()`.
- `ThemeContext` — dark/light mode via `data-theme` no `<html>`. Exporta `useTheme()`.

### Services (mock)

Todos em `src/services/`. Retornam `Promise.resolve(data)`. Quando o backend estiver pronto,
substituir apenas o corpo das funções — os contratos de retorno não mudam.

- `analytics.js` — stats KPI, engagement, social breakdown, content reach, AI insights
- `posts.js` — top posts, recent posts, scheduled dates, AI suggestions, schedulePost()
- `auth.js` — loginService, registerService

### Componentes reutilizáveis

- `Button` — variants: `primary | outline | ghost | danger | secondary`. Props: `size`, `fullWidth`, `loading`, `icon`.
- `Modal` — wrapper animado com overlay. Props: `isOpen`, `onClose`, `title`, `size`.
- `PostModal` — modal de 3 etapas para agendamento de post (Conteúdo → Agendamento → Confirmar).
- `Sidebar` — colapsável, com dark mode toggle e logout. Props: `isCollapsed`, `onToggle`, `onNewPost`.
- `OAuthIcons` — exporta `GoogleIcon` e `FacebookIcon` (SVGs inline com cores oficiais).
- `PasswordField` — exporta `AuthPasswordField` (telas auth), `RecoveryPasswordField` (telas recovery) e `StrengthMeter` (medidor de força reutilizável, prefix `auth` ou `recovery`).

### Utils

- `src/utils/password.js` — `calcStrength(pwd)` e `STRENGTH_LABELS`.
- `src/utils/string.js` — `getInitials(name)`.
- `src/utils/export.js` — `exportDashboardReport(stats, engagement)` gera CSV e dispara download.
- `src/styles/animations.js` — `formContainerVariants`, `fieldVariants` (auth) e `dashFadeUp` (dashboard).

### Estrutura do Dashboard Home

`DashboardHome.jsx` é apenas composição. Sub-componentes em `src/pages/Dashboard/Home/components/`:

- `DashboardHeader.jsx` — título de boas-vindas + filtros (período, rede) + ações (Novo post, Exportar).
- `KpiGrid.jsx` — 4 KPI cards com skeleton fallback.
- `AudienceCard.jsx` — demografia da audiência: faixa etária (barras), gênero (barra dividida) e top localizações.
- `BestTimeCard.jsx` — destaque do pico de engajamento + lista das 3 alternativas + CTA de agendamento.
- `EngagementChart.jsx` — line chart com toggle Diário/Semanal/Mensal.
- `NetworkDonut.jsx` — donut da divisão de engajamento entre redes.
- `NetworkComparison.jsx` — 4 mini-cards comparando crescimento por rede.
- `ContentReachCard.jsx` — barras de progresso por tipo de conteúdo.
- `TopPostsCard.jsx` — top 5 publicações.
- `GoalsCard.jsx` — metas do mês com progress bars.
- `AISuggestionsCard.jsx` — sugestões da IA (gerar/copiar).
- `RecentPostsCard.jsx` — publicações recentes com `PostMenu` (editar/duplicar/excluir).
- `PostMenu.jsx` — dropdown de ações para um post.
- `ScheduleCTA.jsx` — banner CTA que abre o `PostModal`.
- `MiniCalendar.jsx` — calendário com navegação entre meses e 3 status (agendado/publicado/rascunho).
- `ChartTooltip.jsx` — tooltip customizado do Recharts.

### Acesso ao PostModal pelas páginas filhas

`DashboardLayout` expõe `openPostModal(prefill?)` via `Outlet context`. Páginas filhas usam:

```js
const { openPostModal } = useOutletContext()
openPostModal({ text: '...', networks: [...] })  // prefill opcional
```

`PostModal` aceita a prop `prefill` para pré-preencher campos quando aberto via sugestão de IA / edição / duplicação.

### Estrutura do Landing

Para evitar inchaço do `Landing.jsx`, os sub-componentes e dados ficam separados:

- `src/pages/Landing/Landing.jsx` — composição da página (apenas JSX das seções).
- `src/pages/Landing/data.js` — `PLATFORMS`, `FEATURES`, `STEPS`, `PLANS`, `FAQS`, `MOCKUP_BARS`, variants `fadeUp`.
- `src/pages/Landing/components/`:
  - `HeroMockup.jsx` — dashboard mockup + badges flutuantes do hero.
  - `Marquee.jsx` — strip animada de plataformas (controlada por `requestAnimationFrame`).
  - `Counter.jsx` — contador animado dos stats.
  - `FaqItem.jsx` — item de FAQ com accordion.
  - `FeaturePreviews.jsx` — `FeatureCalendarPreview`, `FeatureChartPreview`, `FeatureHashtagsPreview`, `FeaturePlatformsPreview`.

### Imagens da Deb (persona)

Salvar em `src/assets/images/` com os nomes:
- `deb-phone.png` — Deb segurando celular (usada no hero da landing)
- `deb-tablet.png` — Deb apontando para tela (usada na seção "Sobre")
- `deb-laptop.png` — Deb sentada com laptop
- `deb-standing.png` — Deb em pé

As imagens têm fundo branco — usar `mix-blend-mode: multiply` no CSS quando necessário.

### CSS

- Variáveis em `src/styles/variables.css` (cores, tipografia, espaçamentos, transições).
- Estilos globais em `src/styles/global.css` (reset, animações, skeleton loader).
- `src/styles/auth.css` — estilos compartilhados pelas telas de autenticação (Login + Cadastro).
- Cada componente/página tem seu próprio `.css` na mesma pasta.
- Dark mode via `[data-theme='dark']` nas variáveis CSS.
- Cor primária: `--color-primary: #4F35E8`.

## Auto-sync

Um hook Stop (`settings.local.json`) faz `git add -A && git commit && git push origin main` automaticamente ao fim de cada resposta que tiver mudanças.

**Instrução para Claude:** ao criar ou remover componentes, rotas, serviços ou contextos, atualizar as seções de Architecture acima para refletir o estado atual do projeto.

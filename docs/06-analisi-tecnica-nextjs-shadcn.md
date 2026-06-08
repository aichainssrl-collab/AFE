# Analisi Tecnica — Migrazione Demo "AIchain Finance Engine" a Next.js + shadcn/ui

## Stato attuale (as-is)
La demo esistente (`demo/`) è un prototipo **client-side puro**, senza build step:
- `AIchain Finance Engine.html` — entry point, carica gli script via `<script>` da CDN/file locali, espone componenti su `window` (`window.AICHAIN`, `window.ACard`, ecc.).
- `src/ui.jsx`, `src/charts.jsx`, `src/chat.jsx` — componenti UI riutilizzabili scritti in JSX "globale" (no import/export ES module), compilati presumibilmente al volo da Babel standalone in-browser.
- `src/module_*.jsx` (agfm, edison, systra, medicair, tables) — un modulo per cliente, contiene KPI, dashboard di processo, dati mock.
- `src/data.js` — `window.AICHAIN.CLIENTS`, dati statici dei 5 clienti.
- `src/app.jsx` — shell, routing via stato/localStorage (`aichain.nav`), overview KPI per cliente.
- Stato di navigazione persistito in `localStorage` (chiave `aichain.nav`).

**Stack rilevato:** React (via globals, niente JSX import), nessun bundler, niente TypeScript, niente design system — stile inline/oggetti accent color hardcoded per cliente.

## Target (to-be)
**Next.js (ultima versione, App Router) + shadcn/ui + Tailwind + TypeScript.**

### Architettura proposta
```
app/
  layout.tsx              → shell globale, ThemeProvider, font
  page.tsx                → landing/selettore cliente
  [client]/
    page.tsx              → overview cliente (ex OVERVIEW in app.jsx)
    [process]/page.tsx    → dashboard di processo (budgeting/accounting/controlling/...)
components/
  ui/                     → shadcn components generati (card, badge, button, chart, ecc.)
  kpi-card.tsx            → porting di AKPI (KPICard)
  process-dashboard.tsx   → porting di ProcessDashboard
  sparkline.tsx           → porting di ASpark (valutare Recharts/shadcn charts)
  client-nav.tsx          → sidebar/nav persistita
lib/
  clients.ts              → porting tipizzato di data.js (CLIENTS)
  nav-store.ts            → persistenza stato nav (localStorage → considerare cookie/server state)
```

### Mapping componenti esistenti → shadcn
| Componente attuale | Equivalente shadcn/ui | Note |
|---|---|---|
| `ACard` (Card) | `Card`, `CardHeader`, `CardContent` | diretto |
| `AButton` (Button) | `Button` | diretto, mappare varianti |
| `ABadge` (Badge) | `Badge` | diretto |
| `AKPI` (KPICard) | comporre con `Card` + tipografia + `Badge` per delta | custom wrapper sopra primitive shadcn |
| `ASectionTitle` | tipografia Tailwind (`text-lg font-semibold`) | non serve componente dedicato |
| `AIcon` | `lucide-react` (incluso in shadcn) | sostituire set icone custom |
| `ASpark` (Sparkline) | `recharts` con wrapper shadcn `ChartContainer` | shadcn fornisce blocchi chart pronti |
| `ProcessDashboard` | composizione di `Card` + `Tabs` + chart | da ricostruire come componente server/client ibrido |
| Chat (`chat.jsx`) | `Sheet`/`Dialog` + lista messaggi custom | valutare se serve nella demo di domani (vedi task doc) |

### Punti di attenzione tecnici
1. **Da JSX globale a moduli ES**: tutti i `module_*.jsx` vanno riscritti con `import`/`export`, tipizzati in TS, e i dati (`OVERVIEW`, `secondaryProps`) vanno spostati in `lib/` come funzioni/dati tipizzati per cliente.
2. **Dati mock → struttura dati condivisa**: consolidare `data.js` (CLIENTS) e gli oggetti KPI sparsi in `app.jsx`/`module_*` in un unico schema TypeScript (es. `ClientProfile`, `KpiCard`, `ProcessDashboardData`) — riduce duplicazione e rende immediato aggiungere un 6° cliente.
3. **Routing**: passare da router custom basato su `localStorage` (`aichain.nav`) a routing nativo App Router (`/[client]/[process]`) — più robusto, URL condivisibili, supporto back/forward del browser "gratis".
4. **Tema/colori per cliente**: ogni cliente ha un `accent` hardcoded (es. `#5B3E91`, `#00B4DB`) — da modellare con CSS variables/Tailwind theme tokens per cliente, mantenendo coerenza con il design system shadcn (dark/light mode incluso).
5. **Charts**: `ASpark` è uno sparkline custom — verificare se basta `recharts` (dipendenza standard di shadcn charts) o se serve un componente leggero ad-hoc per evitare overhead in demo live.
6. **Performance demo**: essendo dati statici/mock, va bene generare le pagine come **Server Components** con dati embedded — niente fetch runtime, zero rischio di latenza/down durante la presentazione di domani.

## Setup consigliato (comandi di riferimento)
```bash
npx create-next-app@latest aichain-finance-engine --typescript --tailwind --app
cd aichain-finance-engine
npx shadcn@latest init
npx shadcn@latest add card badge button tabs sheet chart
```

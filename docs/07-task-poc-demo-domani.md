# Task List — POC Demo "AIchain Finance Engine" (Next.js + shadcn) per domani

> Obiettivo: avere un POC funzionante e presentabile domani. Priorità: **stabilità in demo > completezza**. Tagliare senza pietà ciò che non serve a mostrare i 5 casi cliente.

## Fase 0 — Setup progetto (30-45 min)
- [ ] `npx create-next-app@latest` con TypeScript + Tailwind + App Router
- [ ] `npx shadcn@latest init` + aggiungere componenti: `card`, `badge`, `button`, `tabs`, `chart`, `sidebar` (o `navigation-menu`)
- [ ] Configurare font/tema base coerente col brand Aichain (logo in `demo/assets/aichain-logo.jpeg`)
- [ ] Verificare build e dev server partano puliti (`npm run dev`)

## Fase 1 — Modello dati condiviso (45 min)
- [ ] Creare `lib/clients.ts`: portare `CLIENTS` da `demo/src/data.js`, tipizzato (`ClientProfile`)
- [ ] Definire tipi condivisi: `KpiCard`, `ProcessDashboardData`, `OverviewData`
- [ ] Portare gli oggetti `OVERVIEW` (5 clienti) e `secondaryProps` da `demo/src/app.jsx` in `lib/overview-data.ts` / `lib/process-data.ts`
- [ ] **Checkpoint:** i dati dei 5 clienti (AGFM, Edison, Systra, Base Digitale, Medicair) sono disponibili e tipizzati senza errori TS

## Fase 2 — Componenti core (1-1.5h)
- [ ] `components/kpi-card.tsx` — porting di `AKPI`/`KPICard` su primitive shadcn (`Card`, `Badge`, tipografia)
- [ ] `components/sparkline.tsx` — porting di `ASpark` con `recharts`/`ChartContainer` shadcn
- [ ] `components/process-dashboard.tsx` — porting di `ProcessDashboard` (composizione Card + griglia KPI + chart)
- [ ] `components/client-nav.tsx` — navigazione tra i 5 clienti (sidebar o tabs in alto)
- [ ] **Checkpoint:** componenti renderizzano correttamente con dati mock isolati (storia/pagina di test)

## Fase 3 — Pagine e routing (1h)
- [ ] `app/page.tsx` — landing/selettore cliente (card per AGFM, Edison, Systra, Base Digitale, Medicair)
- [ ] `app/[client]/page.tsx` — overview cliente con KPI principali (porting blocco `OVERVIEW`)
- [ ] `app/[client]/[process]/page.tsx` — dashboard di processo (budgeting / accounting / controlling, ecc.)
- [ ] Navigazione funzionante tra overview ↔ dettagli processo, URL puliti e condivisibili
- [ ] **Checkpoint:** percorso completo navigabile per almeno 1 cliente end-to-end

## Fase 4 — Replicare i 5 casi cliente (1.5-2h)
- [ ] AGFM — overview + dashboard processi (focus Fast Closing, coerente con `docs/01-AGFM-analisi.md`)
- [ ] Edison — overview + dashboard (focus anomalie/frodi + costo AFC ridotto)
- [ ] Systra — overview + dashboard (focus ROI 12 mesi + scostamento previsioni)
- [ ] Base Digitale — overview + dashboard (focus forecasting accuracy + ROI)
- [ ] Medicair — overview + dashboard (focus qualità del dato / record unificati — narrativa "Fase 1: data foundation")
- [ ] **Checkpoint:** tutti e 5 i clienti navigabili senza errori console, dati coerenti coi rispettivi documenti di analisi (`docs/01-*` … `docs/05-*`)

## Fase 5 — Rifinitura demo (45 min - 1h)
- [ ] Tema/colori per cliente coerenti (accent color da `app.jsx`: viola AGFM `#5B3E91`, ciano Edison `#00B4DB`, ecc.)
- [ ] Logo Aichain in header/layout
- [ ] Verifica responsive minima (proiettore/schermo demo)
- [ ] Rimuovere/nascondere elementi non pronti (es. `chat.jsx` se non portato — meglio ometterlo che mostrarlo rotto)
- [ ] Controllo finale: nessun dato "Lorem ipsum" o placeholder visibile

## Fase 6 — Prova generale (30 min)
- [ ] Run completo della demo dall'inizio alla fine, cronometrato
- [ ] Build di produzione (`npm run build && npm start`) per escludere sorprese da dev server
- [ ] Backup: screenshot/video di fallback in caso di problemi tecnici live
- [ ] Preparare 2-3 frasi di collegamento tra un cliente e l'altro basate sui documenti di analisi (storia → problema → soluzione)

## Note di scoping (cosa NON fare oggi)
- Niente autenticazione, niente backend/API reali — dati mock statici bastano e sono più stabili in demo
- Niente dark mode se non già "gratis" da shadcn — non è la priorità
- Il modulo chat (`chat.jsx`) è opzionale: portarlo solo se avanza tempo dopo il Checkpoint Fase 4

/* ============================================================
   AIchain Finance Engine — App shell, router, overview
   ============================================================ */
const { Card: ACard, Button: AButton, Badge: ABadge, KPICard: AKPI, SectionTitle: ASectionTitle, Icon: AIcon, ProcessDashboard, Sparkline: ASpark } = window;
const CLIENTS = window.AICHAIN.CLIENTS;

/* ---- persisted nav state ---- */
const LS_KEY = "aichain.nav";
function loadNav() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
}
function saveNav(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} }

/* ---- overview content per client ---- */
const OVERVIEW = {
  agfm: {
    kpis: [
      { label: "Tempo di chiusura", value: "1.5", unit: "gg", delta: "−70%", icon: "clock", accent: "#5B3E91", spark: [5, 4.6, 4.1, 3.4, 2.8, 1.5] },
      { label: "Forecasting Accuracy", value: "94.8", unit: "%", icon: "target", accent: "#00B4DB", spark: [80, 83, 86, 89, 92, 94.8] },
      { label: "Costo evitato / mese", value: "€ 18.4k", icon: "euro", accent: "#A7883F", note: "processi AFC" },
    ],
  },
  edison: {
    kpis: [
      { label: "Documenti / mese", value: "12.400", icon: "doc", accent: "#00B4DB", spark: [8, 9, 9.5, 10.8, 11.6, 12.4] },
      { label: "Anomalie intercettate", value: "37", delta: "€ 214k a rischio", deltaTone: "danger", icon: "shield", accent: "#C23434" },
      { label: "Costo AFC ridotto", value: "−42%", icon: "coins", accent: "#13855A", note: "vs gestione manuale" },
    ],
  },
  systra: {
    kpis: [
      { label: "ROI a 12 mesi", value: "312", unit: "%", icon: "trend", accent: "#00B4DB", spark: [40, 110, 180, 230, 280, 312] },
      { label: "Risparmio annuo", value: "€ 374k", icon: "euro", accent: "#A7883F", note: "Serverless pay-as-you-go" },
      { label: "Scostamento previsioni", value: "<2", unit: "%", delta: "da ~8%", icon: "gauge", accent: "#5B3E91" },
    ],
  },
  basedigitale: {
    kpis: [
      { label: "Forecasting Accuracy", value: "96.2", unit: "%", icon: "target", accent: "#A7883F", spark: [84, 87, 90, 92, 94, 96.2] },
      { label: "ROI a 12 mesi", value: "287", unit: "%", icon: "trend", accent: "#00B4DB", note: "su portafoglio clienti" },
      { label: "Scostamento previsioni", value: "<2", unit: "%", delta: "da ~9%", icon: "gauge", accent: "#3A266C" },
    ],
  },
  medicair: {
    kpis: [
      { label: "Record unificati", value: "50.000", icon: "layers", accent: "#00897B", note: "da 4 fonti" },
      { label: "Qualità del dato", value: "98", unit: "%", delta: "+38 pt", icon: "gauge", accent: "#13855A", spark: [55, 60, 70, 82, 92, 98] },
      { label: "Record corretti", value: "1.240", icon: "check", accent: "#5B3E91", note: "duplicati + malformati" },
    ],
  },
};

/* ---- secondary process dashboards ---- */
function secondaryProps(client, nav) {
  const base = {
    budgeting: {
      title: "Pianificazione & Budgeting",
      kpis: [
        { label: "Budget allocato", value: "€ 5.59M", icon: "target", spark: [420, 445, 460, 475, 490, 510] },
        { label: "Aderenza al piano", value: "97.4", unit: "%", delta: "+5,1 pt", icon: "gauge" },
        { label: "Cicli di revisione", value: "2", unit: "/mese", note: "vs 5 manuali", icon: "sync" },
        { label: "Forecast a 6 mesi", value: "€ 2.95M", icon: "trend", spark: [475, 480, 486, 492, 498, 503] },
      ],
    },
    accounting: {
      title: "Contabilità & Fatturazione",
      kpis: [
        { label: "Fatture / mese", value: "3.280", icon: "receipt", spark: [2.4, 2.7, 2.9, 3.0, 3.1, 3.28] },
        { label: "Riconciliazione auto", value: "99.1", unit: "%", delta: "+11 pt", icon: "check" },
        { label: "Tempo medio registrazione", value: "8", unit: "sec", note: "da 4 min", icon: "clock" },
        { label: "Errori contabili", value: "−86", unit: "%", deltaTone: "success", icon: "shield" },
      ],
    },
    controlling: {
      title: "Controllo di gestione & reporting",
      kpis: [
        { label: "KPI monitorati", value: "48", icon: "gauge" },
        { label: "Report automatici", value: "21", unit: "/mese", note: "in tempo reale", icon: "doc" },
        { label: "Scostamento medio", value: "<2", unit: "%", delta: "da ~8%", icon: "trend" },
        { label: "Tempo di reporting", value: "−74", unit: "%", deltaTone: "success", icon: "clock", spark: [10, 8, 6, 4.5, 3.2, 2.6] },
      ],
    },
    "doc-archive": {
      title: "Gestione documentale",
      kpis: [
        { label: "Documenti archiviati", value: "184k", icon: "folder", spark: [120, 138, 150, 165, 176, 184] },
        { label: "Indicizzazione AI", value: "100", unit: "%", icon: "scan" },
        { label: "Tempo di ricerca", value: "1.2", unit: "sec", note: "ricerca semantica", icon: "clock" },
        { label: "Conformità", value: "OK", note: "audit-ready", icon: "shield" },
      ],
    },
    fraud: {
      title: "Anomaly & Fraud Detection",
      kpis: [
        { label: "Anomalie / mese", value: "37", delta: "€ 214k a rischio", deltaTone: "danger", icon: "alert" },
        { label: "Importo bloccato", value: "€ 214k", icon: "shield", accent: "#C23434" },
        { label: "Falsi positivi", value: "3.1", unit: "%", delta: "−9 pt", icon: "target" },
        { label: "Tempo di rilevamento", value: "real-time", note: "all'ingestione", icon: "bolt" },
      ],
    },
  };
  const cfg = base[nav.id] || { title: nav.label, kpis: [] };
  return { kicker: client.name + " · AFC", title: cfg.title, kpis: cfg.kpis, accent: client.accent };
}

/* ---- overview screen ---- */
function OverviewScreen({ client, onLaunch }) {
  const ov = OVERVIEW[client.id] || { kpis: [] };
  const flagNav = client.nav.find((n) => n.flagship);
  return (
    <div className="screen">
      <div className="ov-hero" style={{ ["--accent"]: client.accent }}>
        <div className="ov-hero-top">
          <div>
            <div className="kicker" style={{ color: client.accent }}>{client.sector}</div>
            <h1 className="ov-name">{client.name}</h1>
          </div>
          <div className="ov-objs">
            {client.objectives.map((o, i) => (
              <span key={i} className="ov-obj"><AIcon name="sparkle" size={13} />{o}</span>
            ))}
          </div>
        </div>

        <div className="ov-barrier">
          <div className="ov-barrier-ic"><AIcon name="shield" size={20} /></div>
          <div className="ov-barrier-body">
            <div className="ov-barrier-label">Barriera all'adozione</div>
            <div className="ov-barrier-text">{client.barrier}</div>
          </div>
          <div className="ov-barrier-sep" />
          <div className="ov-barrier-body">
            <div className="ov-barrier-label" style={{ color: client.accent }}>La risposta AIchain</div>
            <div className="ov-barrier-text">{client.pitch}</div>
          </div>
        </div>
      </div>

      <div className="kpi-grid kpi-3" style={{ marginTop: 22 }}>
        {ov.kpis.map((k, i) => (
          <AKPI key={i} {...k} accent={k.accent || client.accent} />
        ))}
      </div>

      <div className="ov-cta">
        <div className="ov-cta-left">
          <div className="round-ic" style={{ background: client.accentSoft, color: client.accent }}>
            <AIcon name={flagNav.icon} size={22} />
          </div>
          <div>
            <div className="ov-cta-title">Demo consigliata · {flagNav.label}</div>
            <div className="ov-cta-sub">Avvia il flusso che risponde direttamente alla barriera di {client.name}.</div>
          </div>
        </div>
        <AButton variant="primary" size="lg" icon="bolt" onClick={() => onLaunch(flagNav.id)}>Avvia demo</AButton>
      </div>

      <div className="ov-processes">
        <div className="ov-proc-title">Processi AFC coinvolti</div>
        <div className="ov-proc-list">
          {client.processes.map((p, i) => (
            <div key={i} className="ov-proc"><AIcon name="check" size={16} stroke={2.4} />{p}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- router ---- */
function renderScreen(client, navId, go) {
  if (navId === "overview") return <OverviewScreen client={client} onLaunch={go} />;
  const map = {
    "fast-closing": window.FastClosingModule,
    "doc-intelligence": window.DocIntelligenceModule,
    fraud: window.FraudDetectionModule,
    "doc-archive": window.DocArchiveModule,
    accounting: window.AccountingModule,
    "predictive-budgeting": window.PredictiveBudgetingModule,
    "roi-tracker": window.RoiTrackerModule,
    "data-cleansing": window.DataCleansingModule,
    "unified-forecast": window.UnifiedForecastModule,
  };
  const Comp = map[navId];
  if (Comp) return <Comp client={client} key={client.id + navId} />;
  const nav = client.nav.find((n) => n.id === navId) || { id: navId, label: navId };
  return <ProcessDashboard {...secondaryProps(client, nav)} />;
}

/* ---- client dropdown ---- */
function ClientDropdown({ clientId, onPick }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const client = CLIENTS.find((c) => c.id === clientId);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="cdrop" ref={ref}>
      <button className={"cdrop-btn" + (open ? " open" : "")} onClick={() => setOpen((v) => !v)}>
        {client ? (
          <span className="cdrop-dot" style={{ background: client.accent }} />
        ) : (
          <AIcon name="building" size={17} />
        )}
        <span className="cdrop-text">
          <span className="cdrop-main">{client ? client.name : "Seleziona Partner…"}</span>
          {client && <span className="cdrop-sub">{client.sector}</span>}
        </span>
        <AIcon name="trend" size={0} />
        <svg className="cdrop-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="cdrop-menu">
          <div className="cdrop-menu-label">Partner Business Matching</div>
          {CLIENTS.map((c) => (
            <button key={c.id} className={"cdrop-item" + (c.id === clientId ? " active" : "")} onClick={() => { onPick(c.id); setOpen(false); }}>
              <span className="cdrop-dot" style={{ background: c.accent }} />
              <span className="cdrop-text">
                <span className="cdrop-main">{c.name}</span>
                <span className="cdrop-sub">{c.barrierTag}</span>
              </span>
              {c.id === clientId && <AIcon name="check" size={16} stroke={2.4} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- empty state ---- */
function EmptyState({ onPick }) {
  return (
    <div className="empty">
      <div className="empty-inner">
        <div className="empty-badge"><AIcon name="spark2" size={15} />Demo PoC · Business Matching</div>
        <h1 className="empty-title">Seleziona un partner per iniziare</h1>
        <p className="empty-sub">
          Ogni partner vede una piattaforma su misura, calibrata sulla sua barriera all'adozione dell'AI.
          Scegli il partner prima che si sieda al tavolo.
        </p>
        <div className="empty-cards">
          {CLIENTS.map((c) => (
            <button key={c.id} className="empty-card" style={{ ["--accent"]: c.accent }} onClick={() => onPick(c.id)}>
              <span className="ec-dot" style={{ background: c.accent }} />
              <span className="ec-name">{c.name}</span>
              <span className="ec-sector">{c.sector}</span>
              <span className="ec-barrier"><AIcon name="shield" size={13} />{c.barrierTag}</span>
              <span className="ec-go">Apri workspace <AIcon name="trend" size={15} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- sidebar ---- */
function Sidebar({ client, navId, onNav }) {
  if (!client) {
    return (
      <aside className="sidebar empty-side">
        <div className="side-empty">
          <AIcon name="building" size={22} />
          <span>Nessun partner selezionato</span>
        </div>
      </aside>
    );
  }
  return (
    <aside className="sidebar">
      <div className="side-context" style={{ ["--accent"]: client.accent }}>
        <div className="sc-row">
          <span className="sc-dot" style={{ background: client.accent }} />
          <span className="sc-name">{client.name}</span>
        </div>
        <div className="sc-barrier"><AIcon name="shield" size={13} />{client.barrierTag}</div>
      </div>
      <nav className="side-nav">
        {client.nav.map((n) => (
          <button key={n.id} className={"snav" + (n.id === navId ? " active" : "")} onClick={() => onNav(n.id)} style={{ ["--accent"]: client.accent }}>
            <AIcon name={n.icon} size={19} stroke={1.9} />
            <span>{n.label}</span>
            {n.flagship && <span className="snav-flag">demo</span>}
          </button>
        ))}
      </nav>
      <div className="side-foot">
        <div className="sf-row"><span className="sf-pulse" />Serverless · Cloud-managed</div>
        <div className="sf-sub">Dati simulati · ambiente PoC</div>
      </div>
    </aside>
  );
}

/* ---- root app ---- */
function App() {
  const init = loadNav();
  const [clientId, setClientId] = React.useState(init.clientId || null);
  const [navId, setNavId] = React.useState(init.navId || "overview");
  const [chatOpen, setChatOpen] = React.useState(false);
  React.useEffect(() => saveNav({ clientId, navId }), [clientId, navId]);

  const client = CLIENTS.find((c) => c.id === clientId) || null;
  function pickClient(id) { setClientId(id); setNavId("overview"); }

  return (
    <div className="app">
      <header className="topbar">
        <div className="tb-left">
          <img src="assets/aichain-logo.jpeg" alt="Aichain Solutions" className="tb-logo" />
          <div className="tb-divider" />
          <div className="tb-titles">
            <span className="tb-title">Finance Engine</span>
            <span className="tb-sub">AFC Intelligence Platform</span>
          </div>
        </div>
        <div className="tb-right">
          <div className="tb-demo"><span className="tb-demo-dot" />Demo Mode</div>
          <button className="tb-expert" onClick={() => setChatOpen(true)}><AIcon name="spark2" size={16} />Esperto AIchain</button>
          <ClientDropdown clientId={clientId} onPick={pickClient} />
        </div>
      </header>

      <div className="body">
        {client && <Sidebar client={client} navId={navId} onNav={setNavId} />}
        <main className="workspace">
          {client ? renderScreen(client, navId, setNavId) : <EmptyState onPick={pickClient} />}
        </main>
      </div>
      <window.ExpertFab onClick={() => setChatOpen(true)} open={chatOpen} />
      <window.ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} client={client} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

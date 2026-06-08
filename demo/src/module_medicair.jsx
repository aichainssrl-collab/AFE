/* ============================================================
   Module — MedicAir · Data Cleansing & Multi-Source Ingestion
   ============================================================ */
const { Card: MCard, Button: MButton, Badge: MBadge, KPICard: MKPI, SectionTitle: MSectionTitle, Icon: MIcon, LineChart: MLineChart } = window;

function DataCleansingModule({ client }) {
  const C = window.AICHAIN.CLEANSING;
  const [phase, setPhase] = React.useState("sources"); // sources | cleansing | done
  const [scanned, setScanned] = React.useState(0);
  const [fixed, setFixed] = React.useState(0);
  const [health, setHealth] = React.useState(C.sources.map((s) => s.health));
  const raf = React.useRef(null);

  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function run() {
    setPhase("cleansing");
    const dur = 3200;
    const start = performance.now();
    const baseHealth = C.sources.map((s) => s.health);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setScanned(Math.round(C.totalRecords * ease));
      setFixed(Math.round(C.fixedRecords * ease));
      setHealth(baseHealth.map((h) => Math.round(h + (98 - h) * ease)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("done"), 500);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(raf.current);
    setPhase("sources");
    setScanned(0);
    setFixed(0);
    setHealth(C.sources.map((s) => s.health));
  }

  if (phase === "done") return <UnifiedDashboard C={C} onReset={reset} />;

  const running = phase === "cleansing";

  return (
    <div className="screen">
      <MSectionTitle
        kicker="MedicAir · Data Ingestion"
        title="Fonti dati & Normalizzazione AI"
        sub="Dati frammentati tra ERP, CRM ed Excel. Un click li unifica in un unico flusso pulito, pronto per l'AFC."
      />

      <div className="ingest-grid">
        <div className={"sources-col" + (running ? " merging" : "")}>
          {C.sources.map((s, i) => (
            <div key={i} className={"source-card" + (running ? " active" : "")}>
              <div className="source-ic"><MIcon name={s.icon} size={20} /></div>
              <div className="source-body">
                <div className="source-name">{s.name}</div>
                <div className="source-meta">{s.type} · {window.itNum(s.records)} record</div>
                <div className="source-health">
                  <div className="sh-track"><div className="sh-fill" style={{ width: health[i] + "%", background: health[i] >= 90 ? "#1FAE6F" : health[i] >= 60 ? "#D79A14" : "#D64545" }} /></div>
                  <span className="sh-val">{health[i]}%</span>
                </div>
              </div>
              {!running && phase === "sources" && <span className="source-status disc">disconnesso</span>}
              {running && <span className="source-status sync"><MIcon name="sync" size={13} /></span>}
            </div>
          ))}
        </div>

        <div className="pipe-col">
          <div className="pipe-arrows">
            <MIcon name="layers" size={22} />
          </div>
        </div>

        <div className="unify-col">
          <MCard className={"unify-card" + (running ? " live" : "")}>
            <div className="unify-ic" style={{ background: running ? "var(--brand-soft)" : "#F1F3F8", color: running ? "var(--brand)" : "var(--muted)" }}>
              <MIcon name="layers" size={26} />
            </div>
            <div className="unify-title">{running ? "Unificazione in corso…" : "Flusso dati unificato"}</div>

            <div className="unify-counters">
              <div className="uc">
                <div className="uc-val">{window.itNum(scanned)}</div>
                <div className="uc-lab">record finanziari analizzati</div>
              </div>
              <div className="uc">
                <div className="uc-val" style={{ color: "#13855A" }}>{window.itNum(fixed)}</div>
                <div className="uc-lab">duplicati / malformati corretti</div>
              </div>
            </div>

            {phase === "sources" ? (
              <MButton variant="primary" size="lg" icon="sparkle" full onClick={run}>
                Esegui AI Data Cleansing & Normalizzazione
              </MButton>
            ) : (
              <div className="unify-progress">
                <div className="up-track"><div className="up-fill" style={{ width: (scanned / C.totalRecords) * 100 + "%" }} /></div>
                <span>{Math.round((scanned / C.totalRecords) * 100)}%</span>
              </div>
            )}
          </MCard>
        </div>
      </div>
    </div>
  );
}

function UnifiedDashboard({ C, onReset }) {
  const F = C.unifiedForecast;
  return (
    <div className="screen">
      <MSectionTitle
        kicker="MedicAir · Data Ingestion"
        title="Dashboard unificata"
        sub="Dati puliti e normalizzati: i grafici predittivi e la timeline di Fast Closing sono ora sbloccati."
        right={<MButton variant="ghost" icon="sync" onClick={onReset}>Nuova ingestion</MButton>}
      />

      <div className="status-banner">
        <div className="round-ic ok"><MIcon name="check" size={20} stroke={2.6} /></div>
        <div>
          <strong>Stato del Dato: OTTIMIZZATO</strong>
          <span className="status-sub">Pronto per l'elaborazione AFC · 4 fonti unificate in un unico flusso</span>
        </div>
        <MBadge tone="success" icon="layers" style={{ marginLeft: "auto" }}>1 flusso · 0 silos</MBadge>
      </div>

      <div className="kpi-grid kpi-3" style={{ marginTop: 20 }}>
        <MKPI label="Record unificati" value={window.itNum(C.totalRecords)} note="da 4 fonti eterogenee" icon="layers" accent="#00897B" />
        <MKPI label="Record corretti" value={window.itNum(C.fixedRecords)} delta={C.duplicates + " duplicati · " + C.malformed + " malformati"} deltaTone="info" icon="check" accent="#13855A" />
        <MKPI label="Qualità del dato" value="98" unit="%" delta="+38 pt post-cleansing" icon="gauge" accent="#5B3E91" />
      </div>

      <MCard style={{ marginTop: 20 }}>
        <MSectionTitle
          title="Forecasting unificato — Ricavi dispositivi"
          sub="Sbloccato dopo la pulizia dei dati · valori in migliaia di €"
          right={<MBadge tone="purple" icon="trend">Previsione +16% a 4 mesi</MBadge>}
        />
        <MLineChart
          labels={F.labels}
          yMin={110}
          yMax={175}
          yFormat={(v) => v}
          series={[
            { name: "Reale", data: F.actual, color: "#00897B", area: true },
            { name: "Forecast", data: F.forecast.map((v, i) => (i >= F.actualMonths - 1 ? v : null)), color: "#5B3E91", dashed: true },
          ]}
        />
      </MCard>
    </div>
  );
}

window.DataCleansingModule = DataCleansingModule;
window.UnifiedForecastModule = function ({ client }) {
  const C = window.AICHAIN.CLEANSING;
  return <UnifiedDashboard C={C} onReset={() => {}} />;
};

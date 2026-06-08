/* ============================================================
   Module — AGFM · Fast Closing & Zero-Code
   ============================================================ */
const { Card, Button, Badge, KPICard, SectionTitle, Icon, LineChart, GaugeRing } = window;
const { useState, useRef, useEffect } = React;

function FastClosingModule({ client }) {
  const FAST = window.AICHAIN.FAST_CLOSING;
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [prog, setProg] = useState(FAST.steps.map(() => 0));
  const [active, setActive] = useState(-1);
  const raf = useRef(null);
  const idxRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function run() {
    setPhase("running");
    setProg(FAST.steps.map(() => 0));
    idxRef.current = 0;
    const doStep = () => {
      const i = idxRef.current;
      if (i >= FAST.steps.length) {
        setActive(-1);
        setTimeout(() => setPhase("done"), 420);
        return;
      }
      setActive(i);
      const dur = FAST.steps[i].ms;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(100, ((now - start) / dur) * 100);
        setProg((prev) => {
          const n = [...prev];
          n[i] = p;
          return n;
        });
        if (p < 100) raf.current = requestAnimationFrame(tick);
        else {
          idxRef.current = i + 1;
          setTimeout(doStep, 200);
        }
      };
      raf.current = requestAnimationFrame(tick);
    };
    doStep();
  }

  function reset() {
    cancelAnimationFrame(raf.current);
    setPhase("idle");
    setProg(FAST.steps.map(() => 0));
    setActive(-1);
  }

  if (phase === "done") return <FastClosingResults FAST={FAST} onReset={reset} />;

  return (
    <div className="screen">
      <SectionTitle
        kicker="AGFM · Fast Closing"
        title="Chiusura mensile automatizzata"
        sub="Un click avvia l'intera pipeline AIchain. Nessun codice, nessuna configurazione — tutto gestito in Cloud."
      />

      <div className="hero-run">
        <div className="hero-run-inner">
          <div className="hero-run-left">
            <Badge tone="purple" icon="sparkle">Zero-Code · Cloud-managed</Badge>
            <h3 className="hero-run-title">Pronto ad avviare la chiusura di Giugno 2026</h3>
            <p className="hero-run-text">
              Il motore riconcilia fatture, verifica le quadrature e genera il report di chiusura in autonomia.
              Il team AFC supervisiona soltanto il risultato.
            </p>
            <div className="hero-run-meta">
              <div><span className="hrm-k">Periodo</span><span className="hrm-v">01 – 30 Giu 2026</span></div>
              <div><span className="hrm-k">Movimenti</span><span className="hrm-v">2.847</span></div>
              <div><span className="hrm-k">Fonti</span><span className="hrm-v">ERP + Banca</span></div>
            </div>
          </div>

          <div className="hero-run-right">
            {phase === "idle" ? (
              <button className="big-launch" onClick={run}>
                <span className="big-launch-ring" />
                <Icon name="bolt" size={40} fill />
                <span className="big-launch-label">Avvia Chiusura Mensile</span>
              </button>
            ) : (
              <div className="pipeline">
                {FAST.steps.map((s, i) => {
                  const done = prog[i] >= 100;
                  const isActive = active === i;
                  return (
                    <div key={i} className={"pl-step" + (done ? " done" : isActive ? " active" : "")}>
                      <div className="pl-icon">
                        {done ? <Icon name="check" size={16} stroke={2.6} /> : <span className="pl-num">{i + 1}</span>}
                      </div>
                      <div className="pl-body">
                        <div className="pl-row">
                          <span className="pl-label">{s.label}</span>
                          <span className="pl-pct">{Math.round(prog[i])}%</span>
                        </div>
                        <div className="pl-track">
                          <div className="pl-fill" style={{ width: prog[i] + "%" }} />
                        </div>
                        <div className="pl-detail">{done ? s.detail : isActive ? "Elaborazione in corso…" : "In coda"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FastClosingResults({ FAST, onReset }) {
  const k = FAST.kpis;
  return (
    <div className="screen">
      <SectionTitle
        kicker="AGFM · Fast Closing"
        title="Chiusura completata"
        sub="Bilancio quadrato e report generato in autonomia."
        right={<Button variant="ghost" icon="sync" onClick={onReset}>Nuova chiusura</Button>}
      />

      <div className="success-banner">
        <div className="round-ic ok"><Icon name="check" size={20} stroke={2.6} /></div>
        <div>
          <strong>Chiusura di Giugno 2026 completata.</strong> Nessuna configurazione tecnica richiesta —
          sistema completamente gestito in Cloud.
        </div>
        <Badge tone="success" icon="cloud" style={{ marginLeft: "auto" }}>Serverless</Badge>
      </div>

      <div className="kpi-grid" style={{ marginTop: 20 }}>
        <KPICard label="Tempo di chiusura" value={k.closingDays} unit="giorni" delta={k.closingDelta + " vs mese precedente"} icon="clock" accent="#5B3E91" spark={FAST.closingTrend} sparkColor="#5B3E91" />
        <KPICard label="Forecasting Accuracy" value={k.accuracy} unit="%" delta="+16,6 pt su 12 mesi" icon="target" accent="#00B4DB" spark={FAST.accuracySeries} sparkColor="#00B4DB" />
        <KPICard label="Ore/uomo risparmiate" value={k.hoursSaved} unit="h" note="sul ciclo di chiusura" icon="clock" accent="#3A266C" />
        <KPICard label="Costo evitato / mese" value={"€ " + k.costSaved} note="riduzione costi operativi AFC" icon="euro" accent="#A7883F" />
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle title="Forecasting Accuracy" sub="Precisione delle previsioni AIchain, ultimi 12 mesi" />
          <LineChart
            labels={FAST.accuracyLabels}
            yMin={72}
            yMax={100}
            yFormat={(v) => v + "%"}
            series={[{ name: "Accuracy", data: FAST.accuracySeries, color: "#00B4DB", area: true }]}
          />
          <div className="chart-foot">
            <Badge tone="info" icon="trend">Picco a 94,8% — Giugno 2026</Badge>
          </div>
        </Card>

        <Card style={{ display: "flex", flexDirection: "column" }}>
          <SectionTitle title="Tempo di chiusura" sub="Giorni/uomo per ciclo, ultimi 6 mesi" />
          <div style={{ display: "flex", alignItems: "center", gap: 28, flex: 1 }}>
            <GaugeRing value={70} label="riduzione tempi vs baseline" color="#5B3E91" />
            <div style={{ flex: 1 }}>
              {[
                ["Gennaio", "5,0 gg"],
                ["Marzo", "4,1 gg"],
                ["Maggio", "2,8 gg"],
                ["Giugno", "1,5 gg"],
              ].map(([m, v], i) => (
                <div key={i} className="mini-row">
                  <span>{m}</span>
                  <div className="mini-bar"><div className="mini-bar-fill" style={{ width: [100, 82, 56, 30][i] + "%" }} /></div>
                  <span className="mini-v">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.FastClosingModule = FastClosingModule;

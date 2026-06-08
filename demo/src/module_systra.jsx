/* ============================================================
   Module — Systra · Base Digitale
   Predictive Budgeting + What-If · ROI Tracker
   ============================================================ */
const { Card: SCard, Button: SButton, Badge: SBadge, KPICard: SKPI, SectionTitle: SSectionTitle, Icon: SIcon, BarComboChart } = window;

function PredictiveBudgetingModule({ client }) {
  const P = window.AICHAIN.PREDICTIVE;
  const [delta, setDelta] = React.useState(0); // materials cost variation %
  const sens = 0.6;

  const forecast = P.forecastBase.map((v, i) => (i < P.actualMonths - 1 ? v : Math.round(v * (1 + (delta / 100) * sens))));
  // future-only forecast line (connect from last actual)
  const forecastLine = forecast.map((v, i) => (i >= P.actualMonths - 1 ? v : null));
  const plannedTotal = P.planned.reduce((a, b) => a + b, 0);
  const forecastTotal = forecast.reduce((a, b) => a + b, 0);
  const variance = forecastTotal - plannedTotal;
  const varPct = ((variance / plannedTotal) * 100).toFixed(1);

  return (
    <div className="screen">
      <SSectionTitle
        kicker={client ? client.name : "Systra"}
        title="Predictive Budgeting"
        sub="Budget pianificato vs spesa reale vs previsione AIchain. Simula uno scenario e la previsione si aggiorna all'istante."
      />

      <div className="kpi-grid kpi-3" style={{ marginBottom: 20 }}>
        <SKPI label="Budget pianificato (anno)" value={"€ " + (plannedTotal / 1000).toFixed(2) + "M"} note="12 mesi · piano approvato" icon="target" accent="#A7883F" />
        <SKPI label="Previsione AIchain (anno)" value={"€ " + (forecastTotal / 1000).toFixed(2) + "M"} note={"scenario materie prime " + (delta >= 0 ? "+" : "") + delta + "%"} icon="trend" accent="#00B4DB" />
        <SKPI
          label="Scostamento vs piano"
          value={(variance >= 0 ? "+€ " : "−€ ") + Math.abs(variance).toLocaleString("it-IT")}
          delta={(variance >= 0 ? "+" : "") + varPct + "% sul budget"}
          deltaTone={variance > 8 ? "danger" : variance > 0 ? "warn" : "success"}
          icon="gauge"
          accent="#3A266C"
        />
      </div>

      <div className="grid-budget">
        <SCard>
          <SSectionTitle
            title="Budget vs Spesa vs Forecast"
            sub="Valori in migliaia di € · linea tratteggiata = previsione AI"
            right={
              <div className="legend">
                <span className="lg"><i style={{ background: "#E6CD74" }} />Pianificato</span>
                <span className="lg"><i style={{ background: "#3A266C" }} />Reale</span>
                <span className="lg"><i style={{ background: "#00B4DB", borderRadius: 1, height: 4 }} />Forecast AI</span>
              </div>
            }
          />
          <BarComboChart
            labels={P.labels}
            yMax={620}
            yFormat={(v) => v}
            bars={[
              { data: P.planned, color: "#E6CD74", opacity: 0.9 },
              { data: P.actual, color: "#3A266C" },
            ]}
            line={{ data: forecastLine, color: "#00B4DB", dashed: true }}
          />
        </SCard>

        <SCard className="whatif">
          <div className="whatif-head">
            <SBadge tone="info" icon="spark2">Scenario What-If</SBadge>
            <h3 className="whatif-title">Costo materie prime</h3>
            <p className="whatif-sub">Trascina per simulare una variazione. Il forecast dei prossimi 6 mesi si ricalcola in tempo reale.</p>
          </div>

          <div className="whatif-value" style={{ color: delta > 0 ? "#C23434" : delta < 0 ? "#13855A" : "var(--ink)" }}>
            {delta > 0 ? "+" : ""}{delta}<span>%</span>
          </div>

          <input
            type="range"
            min="-20"
            max="30"
            step="1"
            value={delta}
            onChange={(e) => setDelta(parseInt(e.target.value))}
            className="wi-slider"
            style={{ ["--p"]: ((delta + 20) / 50) * 100 + "%" }}
          />
          <div className="wi-scale"><span>−20%</span><span>0</span><span>+30%</span></div>

          <div className="wi-presets">
            {[-10, 0, 10, 20].map((d) => (
              <button key={d} className={"wi-chip" + (delta === d ? " on" : "")} onClick={() => setDelta(d)}>
                {d > 0 ? "+" : ""}{d}%
              </button>
            ))}
          </div>

          <div className="wi-impact">
            <div className="wi-impact-row">
              <span>Impatto a 6 mesi</span>
              <b style={{ color: variance >= 0 ? "#C23434" : "#13855A" }}>
                {variance >= 0 ? "+€ " : "−€ "}{Math.abs(variance).toLocaleString("it-IT")}k
              </b>
            </div>
            <div className="wi-impact-note">
              <SIcon name="sparkle" size={14} /> Confidenza modello previsionale: 96%
            </div>
          </div>
        </SCard>
      </div>
    </div>
  );
}

function RoiTrackerModule({ client }) {
  const P = window.AICHAIN.PREDICTIVE;
  const r = P.roiSummary;
  const [serverless, setServerless] = React.useState(true);
  const { Toggle } = window;

  return (
    <div className="screen">
      <SSectionTitle
        kicker={client ? client.name : "Systra"}
        title="ROI Tracker Intelligente"
        sub="Risparmio stimato sul modello Serverless pay-as-you-go, costruito per sciogliere l'incertezza sul ritorno dell'investimento."
      />

      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <SKPI label="Risparmio mensile" value={"€ " + r.monthlySaving} note="processi AFC + infrastruttura" icon="coins" accent="#13855A" />
        <SKPI label="Risparmio annuo" value={"€ " + r.annualSaving} note="proiezione 12 mesi" icon="euro" accent="#A7883F" />
        <SKPI label="Payback" value={r.payback} unit="mesi" note="tempo di rientro" icon="clock" accent="#5B3E91" />
        <SKPI label="ROI a 12 mesi" value={r.roiPct} unit="%" delta="su investimento iniziale" icon="trend" accent="#00B4DB" />
      </div>

      <SCard pad={0}>
        <div className="roi-head">
          <div>
            <h3 className="sec-title" style={{ fontSize: 19 }}>Tradizionale vs AIchain</h3>
            <p className="sec-sub">Confronto voce per voce</p>
          </div>
          <label className="roi-toggle">
            <span>Modello Serverless</span>
            <Toggle on={serverless} onClick={() => setServerless((v) => !v)} />
          </label>
        </div>
        <table className="roi-table">
          <thead>
            <tr>
              <th>Voce di costo</th>
              <th>Processo tradizionale</th>
              <th>{serverless ? "Con AIchain (Serverless)" : "Con AIchain (On-prem)"}</th>
              <th>Risparmio</th>
            </tr>
          </thead>
          <tbody>
            {P.roiTable.map((row, i) => (
              <tr key={i}>
                <td className="roi-item">{row.item}</td>
                <td className="roi-trad">{row.traditional}</td>
                <td className="roi-ai">{serverless ? row.aichain : row.aichain.replace("Pay-as-you-go", "Licenza ridotta")}</td>
                <td><SBadge tone="success" icon="check">{row.saving}</SBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="roi-foot">
          <SIcon name="cloud" size={16} />
          {serverless
            ? "Con il modello Serverless paghi solo l'elaborazione effettiva: nessun costo fisso di licenza o infrastruttura."
            : "Anche on-premise il risparmio resta significativo, ma i costi fissi di infrastruttura permangono."}
        </div>
      </SCard>
    </div>
  );
}

Object.assign(window, { PredictiveBudgetingModule, RoiTrackerModule });

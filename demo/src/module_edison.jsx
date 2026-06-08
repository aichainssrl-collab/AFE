/* ============================================================
   Module — Edison · Document Intelligence & Fraud Detection
   ============================================================ */
const { Card: ECard, Button: EButton, Badge: EBadge, SectionTitle: ESectionTitle, Field, Icon: EIcon } = window;

function DocIntelligenceModule({ client }) {
  const DI = window.AICHAIN.DOC_INTELLIGENCE;
  const [phase, setPhase] = React.useState("idle"); // idle | processing | ready
  const [revealed, setRevealed] = React.useState(0);
  const [dragOver, setDragOver] = React.useState(false);
  const [sync, setSync] = React.useState("none"); // none | syncing | synced
  const timers = React.useRef([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start() {
    if (phase !== "idle") return;
    setPhase("processing");
    setRevealed(0);
    DI.fields.forEach((_, i) => {
      timers.current.push(setTimeout(() => setRevealed(i + 1), 350 + i * 320));
    });
    timers.current.push(setTimeout(() => setPhase("ready"), 350 + DI.fields.length * 320 + 500));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setPhase("idle");
    setRevealed(0);
    setSync("none");
  }

  function doSync() {
    setSync("syncing");
    setTimeout(() => setSync("synced"), 1600);
  }

  return (
    <div className="screen">
      <ESectionTitle
        kicker="Edison · Document Intelligence"
        title="Estrazione documentale & Fraud Detection"
        sub="Carica una fattura: l'AI estrae i campi e segnala anomalie. Nessuna modifica all'ERP esistente."
        right={phase !== "idle" && <EButton variant="ghost" icon="sync" onClick={reset}>Nuovo documento</EButton>}
      />

      <div className="di-grid">
        {/* LEFT — document */}
        <div className="di-left">
          {phase === "idle" ? (
            <div
              className={"dropzone" + (dragOver ? " over" : "")}
              onClick={start}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); start(); }}
            >
              <div className="dz-ic"><EIcon name="upload" size={30} /></div>
              <div className="dz-title">Trascina qui un documento</div>
              <div className="dz-sub">PDF, immagine o scansione · oppure <span className="dz-link">sfoglia</span></div>
              <div className="dz-file"><EIcon name="doc" size={16} /> {DI.fileName}</div>
            </div>
          ) : (
            <div className="pdf-page">
              <div className="pdf-scanline" data-on={phase === "processing"} />
              <div className="pdf-head">
                <div>
                  <div className="pdf-from">Energetica Sud S.p.A.</div>
                  <div className="pdf-meta">Via dell'Energia 12 · 70126 Bari (BA)</div>
                  <div className="pdf-meta">P.IVA IT 04821970651</div>
                </div>
                <div className="pdf-doctype">FATTURA</div>
              </div>
              <div className="pdf-row"><span>N. Documento</span><b>FT-2026-008842</b></div>
              <div className="pdf-row"><span>Data emissione</span><b>28/05/2026</b></div>
              <div className="pdf-row"><span>Scadenza</span><b>27/06/2026</b></div>
              <table className="pdf-table">
                <thead><tr><th>Descrizione</th><th>Q.tà</th><th>Importo</th></tr></thead>
                <tbody>
                  <tr><td>Fornitura energia MT — Maggio 2026</td><td>1</td><td>€ 31.200,00</td></tr>
                  <tr><td>Oneri di rete e dispacciamento</td><td>1</td><td>€ 7.220,00</td></tr>
                </tbody>
              </table>
              <div className="pdf-totals">
                <div className="pdf-row"><span>Imponibile</span><b>€ 38.420,00</b></div>
                <div className="pdf-row"><span>IVA 22%</span><b>€ 8.452,40</b></div>
                <div className="pdf-row total"><span>Totale</span><b>€ 46.872,40</b></div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — extraction + anomaly */}
        <div className="di-right">
          <ECard pad={0} className="extract-card">
            <div className="extract-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="round-ic" style={{ background: "var(--brand-soft)", color: "var(--brand)", width: 34, height: 34 }}>
                  <EIcon name="scan" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 650, fontSize: 15 }}>Campi estratti dall'AI</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    {phase === "idle" ? "In attesa di un documento" : `${revealed}/${DI.fields.length} campi · OCR + NLP`}
                  </div>
                </div>
              </div>
              {phase === "processing" && <span className="pulse-dot" />}
              {phase === "ready" && <EBadge tone="success" icon="check">Completato</EBadge>}
            </div>
            <div className="extract-body">
              {phase === "idle" ? (
                <div className="extract-empty">I campi compariranno qui non appena carichi il documento.</div>
              ) : (
                DI.fields.map((f, i) => (
                  <div key={i} className={"field-wrap" + (i < revealed ? " in" : "")}>
                    <Field label={f.key} value={f.value} conf={f.conf} />
                  </div>
                ))
              )}
            </div>
          </ECard>

          {phase === "ready" && (
            <div className="anomaly-stack">
              <div className="anomaly-box">
                <div className="anomaly-head">
                  <div className="round-ic danger"><EIcon name="alert" size={20} stroke={2.2} /></div>
                  <div>
                    <div className="anomaly-title">{DI.anomaly.title}</div>
                    <div className="anomaly-tag">Anomaly Detection · priorità alta</div>
                  </div>
                  <EBadge tone="danger" soft={false} style={{ marginLeft: "auto" }}>+{DI.anomaly.deltaPct}%</EBadge>
                </div>
                <p className="anomaly-text">{DI.anomaly.text}</p>
                <div className="anomaly-compare">
                  <div className="ac-item"><span className="ac-k">Media storica fornitore</span><span className="ac-v">{DI.anomaly.historicalAvg}</span></div>
                  <div className="ac-vs">vs</div>
                  <div className="ac-item danger"><span className="ac-k">Questa fattura</span><span className="ac-v">{DI.anomaly.thisInvoice}</span></div>
                </div>
                <HistoryBars data={DI.history} labels={DI.historyLabels} />
              </div>

              <div className="sync-row">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="round-ic" style={{ background: "#E8FAF0", color: "#13855A" }}>
                    <EIcon name={sync === "synced" ? "check" : "sync"} size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>
                      {sync === "synced" ? "Dato sincronizzato con l'ERP" : "API Gateway · integrazione non invasiva"}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                      {sync === "synced" ? "Nessuna modifica strutturale all'ERP." : "Invio del dato pulito, senza toccare l'ERP attuale."}
                    </div>
                  </div>
                </div>
                <EButton
                  variant={sync === "synced" ? "soft" : "primary"}
                  icon={sync === "syncing" ? "sync" : sync === "synced" ? "check" : "sync"}
                  onClick={doSync}
                  disabled={sync !== "none"}
                >
                  {sync === "none" ? "Sincronizza con ERP" : sync === "syncing" ? "Sincronizzazione…" : "Sincronizzato"}
                </EButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryBars({ data, labels }) {
  const max = Math.max(...data) * 1.1;
  return (
    <div className="hbars">
      {data.map((v, i) => {
        const last = i === data.length - 1;
        return (
          <div key={i} className="hbar-col">
            <div className="hbar-track">
              <div className={"hbar-fill" + (last ? " danger" : "")} style={{ height: (v / max) * 100 + "%" }} />
            </div>
            <div className="hbar-label">{labels[i]}</div>
          </div>
        );
      })}
    </div>
  );
}

window.DocIntelligenceModule = DocIntelligenceModule;

/* ---------------- Anomaly & Fraud Detection ---------------- */
function FraudDetectionModule({ client }) {
  const DI = window.AICHAIN.DOC_INTELLIGENCE;
  const k = DI.fraudKpis;
  const [filter, setFilter] = React.useState("all");
  const sevRank = { high: 3, medium: 2, low: 1 };
  const rows = DI.anomalies
    .filter((a) => filter === "all" || a.severity === filter)
    .sort((a, b) => b.risk - a.risk);

  const sevMeta = {
    high: { tone: "danger", label: "Alta", color: "#C23434" },
    medium: { tone: "warn", label: "Media", color: "#9A6B00" },
    low: { tone: "neutral", label: "Bassa", color: "#5C6178" },
  };

  return (
    <div className="screen">
      <ESectionTitle
        kicker="Edison · Anomaly & Fraud Detection"
        title="Anomalie rilevate"
        sub="Il motore monitora ogni documento in ingresso e segnala in tempo reale rischi di frode, duplicati e incongruenze."
      />

      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <window.KPICard label="Anomalie / mese" value={k.flagged} icon="alert" accent="#C23434" note="documenti segnalati" />
        <window.KPICard label="Importo a rischio" value={"€ " + k.atRisk} icon="shield" accent="#9A6B00" note="valore intercettato" />
        <window.KPICard label="Importo bloccato" value={"€ " + k.blocked} delta="prima della registrazione" deltaTone="success" icon="check" accent="#13855A" />
        <window.KPICard label="Falsi positivi" value={k.falsePos} unit="%" delta="−9 pt vs baseline" icon="target" accent="#5B3E91" />
      </div>

      <ECard pad={0}>
        <div className="fraud-head">
          <div>
            <h3 className="sec-title" style={{ fontSize: 19 }}>Coda anomalie</h3>
            <p className="sec-sub">{rows.length} documenti · ordinati per livello di rischio</p>
          </div>
          <div className="fraud-filters">
            {[["all", "Tutte"], ["high", "Alta"], ["medium", "Media"], ["low", "Bassa"]].map(([v, l]) => (
              <button key={v} className={"ff-chip" + (filter === v ? " on" : "")} onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="fraud-table-wrap">
          <table className="fraud-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Fornitore</th>
                <th>Data</th>
                <th className="ta-r">Importo</th>
                <th>Tipo anomalia</th>
                <th>Gravità</th>
                <th>Rischio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => {
                const sm = sevMeta[a.severity];
                return (
                  <tr key={a.id} className={"frow sev-" + a.severity}>
                    <td>
                      <div className="fr-file"><EIcon name="doc" size={16} /><span>{a.file}</span></div>
                      <div className="fr-id">{a.id}</div>
                    </td>
                    <td className="fr-supplier">{a.supplier}</td>
                    <td className="fr-date">{a.date}</td>
                    <td className="ta-r fr-amount">{a.amount}</td>
                    <td>
                      <div className="fr-type">{a.type}</div>
                      <div className="fr-note">{a.note}</div>
                    </td>
                    <td><EBadge tone={sm.tone}>{sm.label}</EBadge></td>
                    <td>
                      <div className="risk-cell">
                        <div className="risk-track"><div className="risk-fill" style={{ width: a.risk + "%", background: sm.color }} /></div>
                        <span className="risk-val" style={{ color: sm.color }}>{a.risk}</span>
                      </div>
                    </td>
                    <td><button className="fr-action">Rivedi</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="roi-foot">
          <EIcon name="shield" size={16} />
          Ogni documento viene controllato all'ingestione: importi fuori scala, duplicati, IBAN non corrispondenti e fornitori non in anagrafica vengono bloccati prima della registrazione contabile.
        </div>
      </ECard>
    </div>
  );
}

window.FraudDetectionModule = FraudDetectionModule;

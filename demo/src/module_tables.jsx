/* ============================================================
   Tabelle condivise — Gestione documentale & Contabilità
   ============================================================ */
const { Card: TCard, Badge: TBadge, KPICard: TKPI, SectionTitle: TSectionTitle, Icon: TIcon } = window;

/* ---------------- Gestione documentale ---------------- */
function DocArchiveModule({ client }) {
  const DI = window.AICHAIN.DOC_INTELLIGENCE;
  const k = DI.archiveKpis;
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const cats = ["all", ...Array.from(new Set(DI.documents.map((d) => d.cat)))];
  const statusMeta = {
    registered: { tone: "success", label: "Registrato" },
    archived: { tone: "neutral", label: "Archiviato" },
    review: { tone: "warn", label: "Da rivedere" },
  };
  const typeIcon = { Fattura: "receipt", Contratto: "doc", "Nota di credito": "receipt", DDT: "box", "Estratto conto": "coins", Polizza: "shield" };

  const rows = DI.documents.filter((d) => {
    const okCat = cat === "all" || d.cat === cat;
    const okQ = !q || (d.name + " " + d.supplier + " " + d.tags.join(" ")).toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <div className="screen">
      <TSectionTitle
        kicker="Edison · Gestione documentale"
        title="Archivio documentale"
        sub="Ogni documento è acquisito, indicizzato e ricercabile semanticamente. Conservazione a norma e audit-ready."
      />

      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <TKPI label="Documenti archiviati" value={k.total} icon="folder" accent="#00B4DB" note="indicizzati e ricercabili" />
        <TKPI label="Indicizzazione AI" value={k.indexed} unit="%" delta="OCR + classificazione" deltaTone="success" icon="scan" accent="#5B3E91" />
        <TKPI label="Tempo di ricerca" value={k.search} unit="sec" note="ricerca semantica" icon="clock" accent="#13855A" />
        <TKPI label="Conservazione" value={k.retention} note="a norma · audit-ready" icon="shield" accent="#A7883F" />
      </div>

      <TCard pad={0}>
        <div className="fraud-head">
          <div className="doc-search">
            <TIcon name="scan" size={17} />
            <input className="doc-search-input" placeholder="Cerca documento, fornitore o tag…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="fraud-filters">
            {cats.map((c) => (
              <button key={c} className={"ff-chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c === "all" ? "Tutte" : c}</button>
            ))}
          </div>
        </div>
        <div className="fraud-table-wrap">
          <table className="fraud-table doc-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Controparte</th>
                <th>Data</th>
                <th>Dimensione</th>
                <th>Stato</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d, i) => {
                const sm = statusMeta[d.status];
                return (
                  <tr key={i} className="frow">
                    <td>
                      <div className="fr-file"><TIcon name={typeIcon[d.type] || "doc"} size={16} /><span>{d.name}</span></div>
                      <div className="doc-tags">{d.tags.map((t, j) => <span key={j} className="doc-tag">{t}</span>)}</div>
                    </td>
                    <td className="fr-supplier">{d.type}</td>
                    <td><span className="cat-pill">{d.cat}</span></td>
                    <td className="fr-supplier">{d.supplier}</td>
                    <td className="fr-date">{d.date}</td>
                    <td className="fr-date">{d.size}</td>
                    <td><TBadge tone={sm.tone}>{sm.label}</TBadge></td>
                    <td><button className="fr-action">Apri</button></td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr><td colSpan="8" className="table-empty">Nessun documento corrisponde alla ricerca.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="roi-foot">
          <TIcon name="cloud" size={16} />
          Archivio sincronizzato in tempo reale dal flusso AIchain · ricerca semantica su contenuto e metadati, senza modifiche all'ERP.
        </div>
      </TCard>
    </div>
  );
}

/* ---------------- Contabilità & Fatturazione ---------------- */
function AccountingModule({ client }) {
  const A = window.AICHAIN.ACCOUNTING;
  const k = A.kpis;
  const [dir, setDir] = React.useState("all");
  const statusMeta = {
    registered: { tone: "info", label: "Registrata" },
    sent: { tone: "purple", label: "Inviata" },
    paid: { tone: "success", label: "Pagata" },
    review: { tone: "warn", label: "Da rivedere" },
    overdue: { tone: "danger", label: "Scaduta" },
  };
  const rows = A.invoices.filter((iv) => dir === "all" || iv.dir === dir);

  return (
    <div className="screen">
      <TSectionTitle
        kicker={(client ? client.name : "Edison") + " · Contabilità & Fatturazione"}
        title="Registro fatture"
        sub="Fatture attive e passive riconciliate in automatico dall'AI, con registrazione contabile in pochi secondi."
      />

      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <TKPI label="Fatture / mese" value={k.count} icon="receipt" accent="#5B3E91" note="attive + passive" />
        <TKPI label="Riconciliazione auto" value={k.reconciled} unit="%" delta="+11 pt" deltaTone="success" icon="check" accent="#13855A" />
        <TKPI label="Tempo registrazione" value={k.avgTime} unit="sec" note="da 4 min manuali" icon="clock" accent="#00B4DB" />
        <TKPI label="Scadute" value={k.overdue} note="da sollecitare" icon="alert" accent="#C23434" />
      </div>

      <TCard pad={0}>
        <div className="fraud-head">
          <div>
            <h3 className="sec-title" style={{ fontSize: 19 }}>Registro fatture</h3>
            <p className="sec-sub">{rows.length} documenti · valori in € · IVA inclusa nel totale</p>
          </div>
          <div className="fraud-filters">
            {[["all", "Tutte"], ["Attiva", "Attive"], ["Passiva", "Passive"]].map(([v, l]) => (
              <button key={v} className={"ff-chip" + (dir === v ? " on" : "")} onClick={() => setDir(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="fraud-table-wrap">
          <table className="fraud-table inv-table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Tipo</th>
                <th>Controparte</th>
                <th>Data</th>
                <th>Scadenza</th>
                <th className="ta-r">Imponibile</th>
                <th className="ta-r">IVA</th>
                <th className="ta-r">Totale</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((iv, i) => {
                const sm = statusMeta[iv.status];
                return (
                  <tr key={i} className="frow">
                    <td className="inv-num">{iv.num}</td>
                    <td>
                      <span className={"dir-pill " + (iv.dir === "Attiva" ? "out" : "in")}>
                        <TIcon name={iv.dir === "Attiva" ? "upload" : "doc"} size={13} />{iv.dir}
                      </span>
                    </td>
                    <td className="fr-supplier">{iv.party}</td>
                    <td className="fr-date">{iv.date}</td>
                    <td className="fr-date">{iv.due}</td>
                    <td className="ta-r inv-amt">€ {iv.taxable}</td>
                    <td className="ta-r inv-vat">€ {iv.vat}</td>
                    <td className="ta-r inv-total">€ {iv.total}</td>
                    <td><TBadge tone={sm.tone}>{sm.label}</TBadge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="roi-foot">
          <TIcon name="check" size={16} />
          Riconciliazione automatica al 99,1%: l'AI abbina fatture, pagamenti e ordini, registra in contabilità e segnala solo i casi che richiedono verifica.
        </div>
      </TCard>
    </div>
  );
}

Object.assign(window, { DocArchiveModule, AccountingModule });

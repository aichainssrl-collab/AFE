/* ============================================================
   Esperto AIchain — chat drawer (consulente AFC)
   Powered by window.claude.complete, con fallback offline.
   ============================================================ */
const { Icon: ChIcon } = window;

const KB = `Sei "Esperto AIchain", un consulente esperto di Amministrazione, Finanza e Controllo (AFC) che presenta la piattaforma AIchain Finance Engine di AIchain Solutions a potenziali partner durante incontri di Business Matching.

IDENTITÀ PRODOTTO
- AIchain Finance Engine è una piattaforma di AI applicata ai processi AFC.
- Architettura Serverless, modello pay-as-you-go: nessun costo fisso di licenza o infrastruttura, si paga solo l'elaborazione effettiva.
- Completamente gestita in Cloud, approccio Zero-Code: non richiede competenze tecniche interne né personale IT dedicato.
- Si integra con l'ERP esistente tramite API Gateway, senza modifiche strutturali all'ERP del cliente.

MODULI
1. Fast Closing (Chiusura mensile automatizzata): riconciliazione fatture, verifica quadrature, generazione report. Riduce il tempo di chiusura fino a 1,5 giorni (-70%). Forecasting accuracy fino al 94,8%.
2. Document Intelligence & Fraud Detection: estrazione automatica dei campi da fatture/documenti con indicatore di confidenza, e rilevamento proattivo di anomalie, duplicati e frodi (es. importi fuori scala rispetto allo storico fornitore).
3. ROI Calculator & AI Forecasting (Predictive Budgeting): confronto budget pianificato / spesa reale / previsione AI, simulazioni scenario "What-If" in tempo reale, ROI Tracker. Scostamento previsionale che scende da ~8% a <2%. ROI a 12 mesi ~312%, payback ~2,4 mesi.
4. Data Cleansing & Multi-Source Ingestion: unifica e pulisce dati frammentati da fonti diverse (ERP, CRM, Excel), corregge duplicati e record malformati, sblocca forecasting affidabile.

BARRIERE TIPICHE DEI PARTNER E RISPOSTE
- "Nessuna competenza tecnica interna" → Zero-Code, tutto gestito in Cloud, il team supervisiona solo il risultato.
- "Integrazione con ERP esistente" → API Gateway non invasivo, nessuna modifica strutturale.
- "Incertezza sul ROI" → ROI Tracker con risparmi misurabili e modello pay-as-you-go.
- "Dati frammentati su più fonti" → Data Cleansing e unificazione automatica.

STILE DI RISPOSTA
- Rispondi in italiano, con termini tecnici in inglese dove naturali (Fast Closing, Forecasting, ROI, API Gateway).
- Tono consulenziale, concreto, orientato al valore di business. Mai spiegare COME funziona l'algoritmo: mostra COSA ottiene il team AFC.
- Conciso: massimo 4-6 frasi. Niente elenchi lunghi se non richiesto. Niente markdown pesante.
- Se la domanda è fuori ambito, riportala con garbo al valore di AIchain per l'AFC.`;

function expertReplyFallback(q, client) {
  const t = q.toLowerCase();
  const pick = (arr) => arr;
  if (/fast closing|chiusura|tempo/.test(t))
    return "Il Fast Closing automatizza l'intero ciclo di chiusura mensile — riconciliazione, quadrature e report — portando i tempi da ~5 giorni a circa 1,5 (−70%). Il team AFC non configura nulla: supervisiona solo il risultato finale.";
  if (/erp|integr/.test(t))
    return "L'integrazione avviene tramite API Gateway: il dato pulito viene inviato al vostro ERP senza alcuna modifica strutturale. Continuate a usare il gestionale attuale, AIchain ci si affianca in modo non invasivo.";
  if (/roi|costo|prezzo|risparmi|investiment/.test(t))
    return "Il modello è Serverless pay-as-you-go: nessun costo fisso di licenza, si paga solo l'elaborazione. In media parliamo di ROI intorno al 312% a 12 mesi e payback di ~2,4 mesi, con risparmi misurabili nel ROI Tracker.";
  if (/frode|anomal|fattur|document/.test(t))
    return "Il modulo Document Intelligence estrae i campi delle fatture con confidenza e segnala in tempo reale anomalie, duplicati o importi fuori scala rispetto allo storico del fornitore — bloccando potenziali frodi prima della registrazione.";
  if (/dati|fonti|excel|crm|pulizia|cleansing/.test(t))
    return "Con il Data Cleansing unifichiamo fonti eterogenee (ERP, CRM, Excel) in un unico flusso, correggendo duplicati e record malformati. Solo a dato pulito si sbloccano forecasting e chiusura affidabili.";
  if (/forecast|prevision|budget|accuracy/.test(t))
    return "Il Forecasting AI confronta budget, spesa reale e previsione, con simulazioni What-If in tempo reale. Lo scostamento previsionale scende da ~8% a meno del 2%, con accuratezza fino al 94,8%.";
  if (/sicur|privacy|gdpr|dato al sicuro/.test(t))
    return "I dati restano nel vostro perimetro: AIchain elabora in Cloud gestito e restituisce risultati via API, senza duplicare l'ERP. L'approccio è pensato per ambienti AFC regolamentati.";
  const intro = client ? `Per ${client.name}, ` : "";
  return `${intro}AIchain Finance Engine porta l'AI sui processi AFC — Fast Closing, Document Intelligence, Forecasting e Data Cleansing — con un modello Zero-Code, Serverless e integrabile senza toccare il vostro ERP. Su cosa vuoi che entri nel dettaglio?`;
}

function suggestionsFor(client) {
  const base = [
    "Cos'è il Fast Closing e quanto fa risparmiare?",
    "Come vi integrate con il nostro ERP?",
    "Che ROI posso aspettarmi?",
    "Serve un team tecnico interno?",
  ];
  if (!client) return base;
  const map = {
    agfm: ["Davvero non serve personale IT?", "Quanto si riduce il tempo di chiusura?", "Come migliora la forecasting accuracy?"],
    edison: ["Come rilevate le frodi sulle fatture?", "L'integrazione tocca il nostro ERP?", "Gestite grandi volumi documentali?"],
    systra: ["Come calcolate il ROI?", "Cosa fa la simulazione What-If?", "Quanto è preciso il forecasting?"],
    medicair: ["Come unificate dati da fonti diverse?", "Quanti record correggete in automatico?", "Quando si sblocca il forecasting?"],
  };
  return map[client.id] || base;
}

function ChatDrawer({ open, onClose, client }) {
  const [msgs, setMsgs] = React.useState([
    { role: "bot", content: "Ciao, sono l'Esperto AIchain. Posso spiegarti come la piattaforma trasforma i processi AFC — Fast Closing, Document Intelligence, Forecasting, Data Cleansing. Cosa vuoi sapere?" },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const bodyRef = React.useRef(null);
  const sugg = suggestionsFor(client);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  async function send(text) {
    const q = (text != null ? text : input).trim();
    if (!q || busy) return;
    const history = [...msgs, { role: "user", content: q }];
    setMsgs(history);
    setInput("");
    setBusy(true);
    try {
      let answer;
      if (window.claude && window.claude.complete) {
        const ctx = client
          ? `\n\nCONTESTO ATTUALE: il presentatore ha selezionato il partner "${client.name}" (settore ${client.sector}), la cui barriera principale è "${client.barrierTag}". Tara la risposta su questo profilo quando pertinente.`
          : "";
        const convo = history
          .slice(-7)
          .map((m) => (m.role === "user" ? "PARTNER: " : "ESPERTO: ") + m.content)
          .join("\n");
        const prompt = `${KB}${ctx}\n\nCONVERSAZIONE FINORA:\n${convo}\n\nScrivi solo la prossima risposta dell'ESPERTO, in italiano, concisa (max 4-6 frasi).`;
        answer = await window.claude.complete({ messages: [{ role: "user", content: prompt }] });
        answer = (answer || "").replace(/^ESPERTO:\s*/i, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/^#+\s*/gm, "").replace(/^\s*[-*]\s+/gm, "• ").trim();
        if (!answer) answer = expertReplyFallback(q, client);
      } else {
        await new Promise((r) => setTimeout(r, 650));
        answer = expertReplyFallback(q, client);
      }
      setMsgs((m) => [...m, { role: "bot", content: answer }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "bot", content: expertReplyFallback(q, client) }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <React.Fragment>
      <div className={"chat-overlay" + (open ? " show" : "")} onClick={onClose} />
      <aside className={"chat-drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <header className="chat-head">
          <div className="chat-ava"><ChIcon name="spark2" size={20} /></div>
          <div className="chat-id">
            <div className="chat-name">Esperto AIchain</div>
            <div className="chat-role"><span className="chat-live" />Consulente AFC · online</div>
          </div>
          <button className="chat-close" onClick={onClose} aria-label="Chiudi">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        {client && (
          <div className="chat-ctx">
            <ChIcon name="building" size={14} />
            Contesto: <b>{client.name}</b>
          </div>
        )}

        <div className="chat-body" ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={"msg " + m.role}>
              {m.role === "bot" && <div className="msg-ava"><ChIcon name="spark2" size={14} /></div>}
              <div className="msg-bubble">{m.content}</div>
            </div>
          ))}
          {busy && (
            <div className="msg bot">
              <div className="msg-ava"><ChIcon name="spark2" size={14} /></div>
              <div className="msg-bubble typing"><span /><span /><span /></div>
            </div>
          )}
        </div>

        <div className="chat-sugg">
          {sugg.map((s, i) => (
            <button key={i} className="sugg-chip" onClick={() => send(s)} disabled={busy}>{s}</button>
          ))}
        </div>

        <div className="chat-input">
          <input
            className="ci-field"
            value={input}
            placeholder="Scrivi una domanda…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            disabled={busy}
          />
          <button className="ci-send" onClick={() => send()} disabled={busy || !input.trim()} aria-label="Invia">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div className="chat-foot-note">Risposte AI a scopo dimostrativo · dati simulati</div>
      </aside>
    </React.Fragment>
  );
}

function ExpertFab({ onClick, open }) {
  return (
    <button className={"expert-fab" + (open ? " hidden" : "")} onClick={onClick}>
      <span className="ef-ic"><ChIcon name="spark2" size={20} /></span>
      <span className="ef-label">Chiedi all'Esperto</span>
    </button>
  );
}

Object.assign(window, { ChatDrawer, ExpertFab });

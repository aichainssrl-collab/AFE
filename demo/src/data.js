/* ============================================================
   AIchain Finance Engine — Mock data layer
   All values simulated for the Business Matching PoC.
   ============================================================ */
(function () {
  // ---- Client / Partner definitions -------------------------
  const CLIENTS = [
    {
      id: "agfm",
      name: "AGFM",
      sector: "Servizi & Utility Locali",
      accent: "#5B3E91",
      accentSoft: "#EEE9F6",
      barrierTag: "Zero competenze tecniche interne",
      barrier:
        "Il team AFC teme che adottare l'AI richieda nuove competenze tecniche e personale IT dedicato.",
      pitch: "Semplificazione dei processi, nessun codice, tutto gestito in Cloud.",
      flagship: "fast-closing",
      objectives: ["Fast Closing", "Forecasting Accuracy", "Riduzione costi"],
      processes: ["Pianificazione & Budgeting", "Contabilità & Fatturazione", "Controllo di gestione & reporting"],
      nav: [
        { id: "overview", label: "Panoramica", icon: "grid" },
        { id: "fast-closing", label: "Fast Closing", icon: "bolt", flagship: true },
        { id: "budgeting", label: "Pianificazione & Budget", icon: "target" },
        { id: "accounting", label: "Contabilità & Fatturazione", icon: "receipt" },
        { id: "controlling", label: "Controllo di gestione", icon: "gauge" },
      ],
    },
    {
      id: "edison",
      name: "Edison",
      sector: "Energy & Utilities",
      accent: "#00B4DB",
      accentSoft: "#E1F6FB",
      barrierTag: "Integrazione con ERP esistente",
      barrier:
        "Grandi volumi documentali e timore che l'AI imponga modifiche strutturali all'ERP già in uso.",
      pitch: "Estrazione documentale intelligente e fraud detection, senza toccare l'ERP.",
      flagship: "doc-intelligence",
      objectives: ["Riduzione costi AFC", "Fraud Detection", "Document Intelligence"],
      processes: ["Gestione documentale", "Contabilità & Fatturazione"],
      nav: [
        { id: "overview", label: "Panoramica", icon: "grid" },
        { id: "doc-intelligence", label: "Document Intelligence", icon: "scan", flagship: true },
        { id: "fraud", label: "Anomaly & Fraud", icon: "shield" },
        { id: "doc-archive", label: "Gestione documentale", icon: "folder" },
        { id: "accounting", label: "Contabilità & Fatturazione", icon: "receipt" },
      ],
    },
    {
      id: "systra",
      name: "Systra",
      sector: "Infrastrutture & Mobilità",
      accent: "#3A266C",
      accentSoft: "#ECE8F4",
      barrierTag: "Incertezza sul ROI",
      barrier:
        "Necessità di dimostrare valore finanziario immediato e accuratezza predittiva prima di investire.",
      pitch: "ROI misurabile e forecasting AI con simulazioni di scenario in tempo reale.",
      flagship: "predictive-budgeting",
      objectives: ["Forecasting Accuracy", "Fast Closing", "ROI dimostrabile"],
      processes: ["Controllo di gestione", "Pianificazione & budgeting", "Contabilità"],
      nav: [
        { id: "overview", label: "Panoramica", icon: "grid" },
        { id: "predictive-budgeting", label: "Predictive Budgeting", icon: "trend", flagship: true },
        { id: "roi-tracker", label: "ROI Tracker", icon: "coins" },
        { id: "controlling", label: "Controllo di gestione", icon: "gauge" },
        { id: "accounting", label: "Contabilità", icon: "receipt" },
      ],
    },
    {
      id: "basedigitale",
      name: "Base Digitale",
      sector: "Trasformazione Digitale",
      accent: "#A7883F",
      accentSoft: "#F4EEDD",
      barrierTag: "Valore predittivo da dimostrare",
      barrier:
        "Servono prove concrete di accuratezza predittiva e ritorno economico prima di portare l'AI ai propri clienti.",
      pitch: "Forecasting AI ad alta precisione e ROI Tracker per quantificare il valore, scenario per scenario.",
      flagship: "predictive-budgeting",
      objectives: ["Forecasting Accuracy", "ROI dimostrabile", "Fast Closing"],
      processes: ["Pianificazione & budgeting", "Controllo di gestione", "Contabilità"],
      nav: [
        { id: "overview", label: "Panoramica", icon: "grid" },
        { id: "predictive-budgeting", label: "Predictive Budgeting", icon: "trend", flagship: true },
        { id: "roi-tracker", label: "ROI Tracker", icon: "coins" },
        { id: "controlling", label: "Controllo di gestione", icon: "gauge" },
        { id: "accounting", label: "Contabilità", icon: "receipt" },
      ],
    },
    {
      id: "medicair",
      name: "MedicAir",
      sector: "Healthcare & Dispositivi Medici",
      accent: "#00897B",
      accentSoft: "#DEF3F0",
      barrierTag: "Dati frammentati su più fonti",
      barrier:
        "Dati sparsi tra ERP, CRM ed Excel: impossibile ottenere una visione unica e affidabile.",
      pitch: "Unificazione e pulizia automatica dei dati per sbloccare forecasting affidabile.",
      flagship: "data-cleansing",
      objectives: ["Data Cleansing", "Fast Closing", "Forecasting Accuracy"],
      processes: ["Controllo di gestione & reporting", "Pianificazione & Budgeting", "Contabilità & Fatturazione"],
      nav: [
        { id: "overview", label: "Panoramica", icon: "grid" },
        { id: "data-cleansing", label: "Data Ingestion", icon: "layers", flagship: true },
        { id: "unified-forecast", label: "Forecasting Unificato", icon: "trend" },
        { id: "controlling", label: "Controllo di gestione", icon: "gauge" },
        { id: "accounting", label: "Contabilità & Fatturazione", icon: "receipt" },
      ],
    },
  ];

  // ---- AGFM — Fast Closing ----------------------------------
  const FAST_CLOSING = {
    steps: [
      { label: "Riconciliazione fatture correnti", detail: "2.847 movimenti elaborati", ms: 1700 },
      { label: "Verifica quadrature di bilancio", detail: "Partite aperte: 0 squadrature", ms: 1500 },
      { label: "Controllo IVA e ritenute", detail: "Aliquote validate automaticamente", ms: 1400 },
      { label: "Generazione report di chiusura", detail: "Bilancio + nota integrativa", ms: 1600 },
    ],
    kpis: {
      closingDays: "1.5",
      closingDelta: "-70%",
      accuracy: "94.8",
      hoursSaved: "112",
      costSaved: "18.400",
    },
    // forecasting accuracy, last 12 months (%)
    accuracySeries: [78.2, 80.1, 81.6, 80.9, 83.4, 85.7, 87.2, 88.9, 90.1, 92.4, 93.6, 94.8],
    accuracyLabels: ["Lug", "Ago", "Set", "Ott", "Nov", "Dic", "Gen", "Feb", "Mar", "Apr", "Mag", "Giu"],
    closingTrend: [5.0, 4.6, 4.1, 3.4, 2.8, 1.5], // giorni, ultimi 6 mesi
  };

  // ---- Edison — Document Intelligence -----------------------
  const DOC_INTELLIGENCE = {
    fileName: "Fattura_Fornitore_Energia.pdf",
    fields: [
      { key: "Fornitore", value: "Energetica Sud S.p.A.", conf: 99 },
      { key: "Partita IVA", value: "IT 04821970651", conf: 99 },
      { key: "N. Documento", value: "FT-2026-008842", conf: 98 },
      { key: "Data emissione", value: "28/05/2026", conf: 99 },
      { key: "Imponibile", value: "€ 38.420,00", conf: 97 },
      { key: "IVA (22%)", value: "€ 8.452,40", conf: 98 },
      { key: "Importo Totale", value: "€ 46.872,40", conf: 99 },
      { key: "Scadenza", value: "27/06/2026", conf: 96 },
    ],
    anomaly: {
      level: "danger",
      title: "Rilevata Anomalia: Rischio Frode / Duplicato",
      text:
        "L'importo di questa fattura supera del 45% la media storica per questo fornitore nel periodo di riferimento. Verificare possibile errore di fatturazione o duplicazione.",
      historicalAvg: "€ 32.300",
      thisInvoice: "€ 46.872",
      deltaPct: 45,
    },
    history: [29.8, 31.2, 30.6, 33.1, 32.0, 34.2, 31.9, 46.9], // k€ ultime fatture fornitore
    historyLabels: ["Ott", "Nov", "Dic", "Gen", "Feb", "Mar", "Apr", "Mag"],
    queue: [
      { name: "Fattura_Fornitore_Energia.pdf", status: "anomaly", amount: "€ 46.872" },
      { name: "Nota_Credito_Logistica.pdf", status: "ok", amount: "€ 2.140" },
      { name: "Fattura_Manutenzione_Q2.pdf", status: "ok", amount: "€ 7.890" },
      { name: "Fattura_Cloud_Provider.pdf", status: "review", amount: "€ 12.300" },
    ],
    // Lista anomalie rilevate (tabella Anomaly & Fraud Detection)
    anomalies: [
      {
        id: "FT-2026-008842",
        file: "Fattura_Fornitore_Energia.pdf",
        supplier: "Energetica Sud S.p.A.",
        date: "28/05/2026",
        amount: "€ 46.872,40",
        type: "Importo fuori scala",
        severity: "high",
        risk: 92,
        note: "+45% sulla media storica del fornitore",
      },
      {
        id: "FT-2026-008790",
        file: "Fattura_Cloud_Provider.pdf",
        supplier: "NordCloud Services Srl",
        date: "26/05/2026",
        amount: "€ 12.300,00",
        type: "Possibile duplicato",
        severity: "medium",
        risk: 64,
        note: "Stesso importo e fornitore di FT-2026-008611",
      },
      {
        id: "FT-2026-008763",
        file: "Fattura_Consulenza_IT.pdf",
        supplier: "Delta Advisory",
        date: "24/05/2026",
        amount: "€ 9.450,00",
        type: "IBAN non corrispondente",
        severity: "high",
        risk: 88,
        note: "IBAN diverso da quello anagrafico del fornitore",
      },
      {
        id: "FT-2026-008701",
        file: "Fattura_Trasporti_Mag.pdf",
        supplier: "LogiTrans S.p.A.",
        date: "21/05/2026",
        amount: "€ 5.980,00",
        type: "Scadenza anomala",
        severity: "low",
        risk: 38,
        note: "Termini di pagamento fuori dal contratto quadro",
      },
      {
        id: "FT-2026-008688",
        file: "Fattura_Materiali_B12.pdf",
        supplier: "Brixia Materiali",
        date: "19/05/2026",
        amount: "€ 21.540,00",
        type: "Fornitore non in anagrafica",
        severity: "medium",
        risk: 71,
        note: "Primo pagamento verso questo soggetto",
      },
      {
        id: "FT-2026-008642",
        file: "Nota_Credito_Q1.pdf",
        supplier: "Energetica Sud S.p.A.",
        date: "16/05/2026",
        amount: "€ 3.120,00",
        type: "Sequenza numerica irregolare",
        severity: "low",
        risk: 31,
        note: "Numerazione non progressiva rispetto allo storico",
      },
    ],
    fraudKpis: {
      flagged: 37,
      atRisk: "214k",
      blocked: "186k",
      falsePos: "3.1",
    },
    // Archivio documentale (tabella Gestione documentale)
    archiveKpis: { total: "184k", indexed: "100", search: "1.2", retention: "10 anni" },
    documents: [
      { name: "Fattura_Fornitore_Energia.pdf", type: "Fattura", cat: "Acquisti", supplier: "Energetica Sud S.p.A.", date: "28/05/2026", size: "248 KB", status: "registered", tags: ["Energia", "MT"] },
      { name: "Contratto_Quadro_Manutenzione.pdf", type: "Contratto", cat: "Legale", supplier: "Tecno Service Srl", date: "27/05/2026", size: "1.4 MB", status: "archived", tags: ["Quadro", "2026"] },
      { name: "Nota_Credito_Logistica.pdf", type: "Nota di credito", cat: "Acquisti", supplier: "LogiTrans S.p.A.", date: "26/05/2026", size: "192 KB", status: "registered", tags: ["Storno"] },
      { name: "Fattura_Cloud_Provider.pdf", type: "Fattura", cat: "IT", supplier: "NordCloud Services Srl", date: "26/05/2026", size: "210 KB", status: "review", tags: ["SaaS", "Ricorrente"] },
      { name: "DDT_Magazzino_Centrale.pdf", type: "DDT", cat: "Logistica", supplier: "Brixia Materiali", date: "24/05/2026", size: "176 KB", status: "registered", tags: ["Consegna"] },
      { name: "Fattura_Consulenza_IT.pdf", type: "Fattura", cat: "IT", supplier: "Delta Advisory", date: "24/05/2026", size: "204 KB", status: "review", tags: ["Consulenza"] },
      { name: "Estratto_Conto_Maggio.pdf", type: "Estratto conto", cat: "Tesoreria", supplier: "Banca Intesa", date: "23/05/2026", size: "512 KB", status: "archived", tags: ["Banca"] },
      { name: "Polizza_Assicurativa_2026.pdf", type: "Polizza", cat: "Legale", supplier: "Generali Italia", date: "20/05/2026", size: "880 KB", status: "archived", tags: ["RC", "Annuale"] },
    ],
  };

  // ---- Contabilità & Fatturazione (tabella fatture) ---------
  const ACCOUNTING = {
    kpis: { count: "3.280", reconciled: "99.1", avgTime: "8", overdue: "4" },
    invoices: [
      { num: "FT-2026-008842", dir: "Passiva", party: "Energetica Sud S.p.A.", date: "28/05/2026", due: "27/06/2026", taxable: "38.420,00", vat: "8.452,40", total: "46.872,40", status: "registered" },
      { num: "FT-2026-008840", dir: "Attiva", party: "Comune di Bari", date: "27/05/2026", due: "26/07/2026", taxable: "62.000,00", vat: "13.640,00", total: "75.640,00", status: "sent" },
      { num: "FT-2026-008836", dir: "Passiva", party: "Tecno Service Srl", date: "26/05/2026", due: "10/06/2026", taxable: "7.450,00", vat: "1.639,00", total: "9.089,00", status: "paid" },
      { num: "FT-2026-008833", dir: "Passiva", party: "NordCloud Services Srl", date: "26/05/2026", due: "25/06/2026", taxable: "10.082,00", vat: "2.218,00", total: "12.300,00", status: "review" },
      { num: "FT-2026-008829", dir: "Attiva", party: "Ferrovie Regionali S.p.A.", date: "24/05/2026", due: "08/06/2026", taxable: "118.500,00", vat: "26.070,00", total: "144.570,00", status: "overdue" },
      { num: "FT-2026-008821", dir: "Passiva", party: "Brixia Materiali", date: "22/05/2026", due: "21/06/2026", taxable: "17.655,00", vat: "3.885,00", total: "21.540,00", status: "registered" },
      { num: "FT-2026-008815", dir: "Attiva", party: "Autostrade del Sud", date: "20/05/2026", due: "19/06/2026", taxable: "54.300,00", vat: "11.946,00", total: "66.246,00", status: "paid" },
      { num: "FT-2026-008809", dir: "Passiva", party: "Delta Advisory", date: "19/05/2026", due: "03/06/2026", taxable: "7.745,00", vat: "1.705,00", total: "9.450,00", status: "registered" },
    ],
  };

  // ---- Systra — Predictive Budgeting & ROI ------------------
  const PREDICTIVE = {
    labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    actualMonths: 6, // first 6 are actual
    planned: [420, 430, 445, 440, 460, 470, 475, 480, 485, 490, 500, 510],
    actual: [435, 448, 452, 470, 463, 481, null, null, null, null, null, null],
    // base AI forecast (materials at baseline) — full 12 months
    forecastBase: [435, 448, 452, 470, 463, 481, 486, 492, 498, 503, 511, 519],
    roiTable: [
      {
        item: "Tempo Chiusura Mensile",
        traditional: "5 Giorni / Uomo",
        aichain: "1 Giorno / Uomo",
        saving: "80% ore risparmiate",
        kind: "good",
      },
      {
        item: "Errori di Previsione",
        traditional: "Scostamento ~8%",
        aichain: "Scostamento <2%",
        saving: "Riduzione rischio capitale",
        kind: "good",
      },
      {
        item: "Infrastruttura IT",
        traditional: "Costi licenze fisse",
        aichain: "Pay-as-you-go",
        saving: "Azzeramento costi fissi",
        kind: "good",
      },
    ],
    roiSummary: { monthlySaving: "31.200", annualSaving: "374.400", payback: "2.4", roiPct: "312" },
  };

  // ---- MedicAir — Data Cleansing ----------------------------
  const CLEANSING = {
    sources: [
      { name: "ERP Assistenza Domiciliare", type: "ERP", records: 21400, health: 62, icon: "server" },
      { name: "CRM Dispositivi Medici", type: "CRM", records: 14850, health: 71, icon: "users" },
      { name: "Excel Contabilità Logistica", type: "File", records: 9320, health: 38, icon: "sheet" },
      { name: "Gestionale Magazzino Farmaci", type: "DB", records: 4430, health: 55, icon: "box" },
    ],
    totalRecords: 50000,
    fixedRecords: 1240,
    duplicates: 612,
    malformed: 628,
    unifiedForecast: {
      labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set"],
      actualMonths: 5,
      actual: [128, 134, 131, 142, 139, null, null, null, null],
      forecast: [128, 134, 131, 142, 139, 146, 151, 155, 161], // k€ ricavi dispositivi
    },
  };

  // Italian thousands grouping (it-IT skips grouping for 4-digit numbers)
  window.itNum = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  window.AICHAIN = { CLIENTS, FAST_CLOSING, DOC_INTELLIGENCE, PREDICTIVE, CLEANSING, ACCOUNTING };
})();

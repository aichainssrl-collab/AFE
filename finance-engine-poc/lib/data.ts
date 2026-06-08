// AIchain Finance Engine — POC mock data layer (typed port of demo/src/data.js + app.jsx)

export type Kpi = {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "success" | "danger" | "neutral";
  note?: string;
  spark?: number[];
};

export type ProcessDashboard = {
  id: string;
  title: string;
  kpis: Kpi[];
};

export type IngestionSource = {
  name: string;
  meta: string;
  icon: "erp" | "crm" | "file" | "db";
  progress: number;
  status: "Disconnesso" | "Connesso";
};

export type ClientProfile = {
  id: string;
  name: string;
  sector: string;
  /** Eyebrow label shown above the name on the overview hero (uppercase in UI) */
  eyebrow?: string;
  accent: string;
  accentSoft: string;
  barrierTag: string;
  barrier: string;
  pitch: string;
  objectives: string[];
  processNames: string[];
  overviewKpis: Kpi[];
  dashboards: ProcessDashboard[];
  /** Data ingestion module sources (currently only modeled for MedicAir) */
  dataSources?: IngestionSource[];
  /** Optional real brand logo */
  logo?: string;
  /** Background for the logo chip: "accent" for white logos, "white" for colored logos */
  logoBg?: "accent" | "white";
};

export const CLIENTS: ClientProfile[] = [
  {
    id: "agfm",
    name: "AGFM",
    sector: "Consulenza & Tax Advisory",
    accent: "#1C3C62",
    accentSoft: "#E8EDF4",
    logo: "/agfm-logo.png",
    logoBg: "accent",
    barrierTag: "Zero competenze tecniche interne",
    barrier:
      "Il team AFC teme che adottare l'AI richieda nuove competenze tecniche e personale IT dedicato.",
    pitch: "Semplificazione dei processi, nessun codice, tutto gestito in cloud — onboarding guidato.",
    objectives: ["Fast Closing", "Forecasting Accuracy", "Riduzione costi"],
    processNames: ["Pianificazione & Budgeting", "Contabilità & Fatturazione", "Controllo di gestione & reporting"],
    overviewKpis: [
      { label: "Tempo di chiusura", value: "1.5", unit: "gg", delta: "−70%", deltaTone: "success", spark: [5, 4.6, 4.1, 3.4, 2.8, 1.5] },
      { label: "Forecasting Accuracy", value: "94.8", unit: "%", spark: [80, 83, 86, 89, 92, 94.8] },
      { label: "Costo evitato / mese", value: "€ 18.4k", note: "processi AFC" },
    ],
    dashboards: [
      {
        id: "fast-closing",
        title: "Fast Closing",
        kpis: [
          { label: "Tempo di chiusura", value: "1.5", unit: "gg", delta: "−70%", deltaTone: "success", spark: [5, 4.6, 4.1, 3.4, 2.8, 1.5] },
          { label: "Forecasting Accuracy", value: "94.8", unit: "%", spark: [80, 83, 86, 89, 92, 94.8] },
          { label: "Ore/uomo risparmiate", value: "112", unit: "h", note: "sul ciclo di chiusura" },
          { label: "Costo evitato / mese", value: "€ 18.4k", note: "riduzione costi operativi AFC" },
        ],
      },
      {
        id: "budgeting",
        title: "Pianificazione & Budgeting",
        kpis: [
          { label: "Budget allocato", value: "€ 5.59M", spark: [420, 445, 460, 475, 490, 510] },
          { label: "Aderenza al piano", value: "97.4", unit: "%", delta: "+5,1 pt", deltaTone: "success" },
          { label: "Cicli di revisione", value: "2", unit: "/mese", note: "vs 5 manuali" },
          { label: "Forecast a 6 mesi", value: "€ 2.95M", spark: [475, 480, 486, 492, 498, 503] },
        ],
      },
      {
        id: "accounting",
        title: "Contabilità & Fatturazione",
        kpis: [
          { label: "Fatture / mese", value: "3.280", spark: [2.4, 2.7, 2.9, 3.0, 3.1, 3.28] },
          { label: "Riconciliazione auto", value: "99.1", unit: "%", delta: "+11 pt", deltaTone: "success" },
          { label: "Tempo medio registrazione", value: "8", unit: "sec", note: "da 4 min" },
          { label: "Errori contabili", value: "−86", unit: "%", deltaTone: "success" },
        ],
      },
      {
        id: "controlling",
        title: "Controllo di gestione & reporting",
        kpis: [
          { label: "KPI monitorati", value: "48" },
          { label: "Report automatici", value: "21", unit: "/mese", note: "in tempo reale" },
          { label: "Scostamento medio", value: "<2", unit: "%", delta: "da ~8%", deltaTone: "success" },
          { label: "Tempo di reporting", value: "−74", unit: "%", deltaTone: "success", spark: [10, 8, 6, 4.5, 3.2, 2.6] },
        ],
      },
    ],
  },
  {
    id: "edison",
    name: "Edison",
    sector: "Energy & Utilities",
    accent: "#1032CF",
    accentSoft: "#E6E9FB",
    logo: "/edison-logo.svg",
    logoBg: "accent",
    barrierTag: "Integrazione con ERP esistente",
    barrier:
      "Grandi volumi documentali e timore che l'AI imponga modifiche strutturali all'ERP già in uso.",
    pitch: "Estrazione documentale intelligente e fraud detection, tramite connettore — senza toccare l'ERP.",
    objectives: ["Riduzione costi AFC", "Fraud Detection", "Document Intelligence"],
    processNames: ["Gestione documentale", "Contabilità & Fatturazione"],
    overviewKpis: [
      { label: "Documenti / mese", value: "12.400", spark: [8, 9, 9.5, 10.8, 11.6, 12.4] },
      { label: "Anomalie intercettate", value: "37", delta: "€ 214k a rischio", deltaTone: "danger" },
      { label: "Costo AFC ridotto", value: "−42%", deltaTone: "success", note: "vs gestione manuale" },
    ],
    dashboards: [
      {
        id: "doc-intelligence",
        title: "Document Intelligence",
        kpis: [
          { label: "Documenti classificati", value: "12.400", unit: "/mese", spark: [8, 9, 9.5, 10.8, 11.6, 12.4] },
          { label: "Accuratezza estrazione", value: "98.6", unit: "%" },
          { label: "Tempo medio elaborazione", value: "4", unit: "sec", note: "da 6 min" },
          { label: "Connettore ERP", value: "Attivo", note: "nessuna modifica strutturale" },
        ],
      },
      {
        id: "fraud",
        title: "Anomaly & Fraud Detection",
        kpis: [
          { label: "Anomalie intercettate", value: "37", deltaTone: "danger" },
          { label: "Valore a rischio rilevato", value: "€ 214k", deltaTone: "danger" },
          { label: "Falsi positivi", value: "3.1", unit: "%", deltaTone: "success" },
          { label: "Tempo medio rilevazione", value: "<1", unit: "h", note: "da gg a ore" },
        ],
      },
      {
        id: "doc-archive",
        title: "Gestione documentale",
        kpis: [
          { label: "Documenti archiviati", value: "184k" },
          { label: "Indicizzazione AI", value: "100", unit: "%" },
          { label: "Tempo di ricerca", value: "1.2", unit: "sec", note: "ricerca semantica" },
          { label: "Conservazione", value: "10 anni", note: "audit-ready" },
        ],
      },
      {
        id: "accounting",
        title: "Contabilità & Fatturazione",
        kpis: [
          { label: "Fatture riconciliate", value: "99.0", unit: "%" },
          { label: "Costo team AFC", value: "−42", unit: "%", deltaTone: "success" },
          { label: "Tempo chiusura mensile", value: "−35", unit: "%", deltaTone: "success" },
          { label: "Errori rilevati", value: "12", note: "su 12.400 documenti" },
        ],
      },
    ],
  },
  {
    id: "systra",
    name: "Systra",
    sector: "Infrastrutture & Mobilità",
    accent: "#643C5A",
    accentSoft: "#F0E8EE",
    logo: "/systra-logo.svg",
    logoBg: "white",
    barrierTag: "Incertezza sul ROI",
    barrier:
      "Necessità di dimostrare valore finanziario immediato e accuratezza predittiva prima di investire.",
    pitch: "ROI misurabile fin dal primo trimestre e forecasting AI con simulazioni di scenario in tempo reale.",
    objectives: ["Forecasting Accuracy", "Fast Closing", "ROI dimostrabile"],
    processNames: ["Controllo di gestione e reporting", "Pianificazione e budgeting", "Contabilità & Fatturazione"],
    overviewKpis: [
      { label: "ROI a 12 mesi", value: "312", unit: "%", spark: [40, 110, 180, 230, 280, 312] },
      { label: "Risparmio annuo", value: "€ 374k", note: "vs gestione attuale" },
      { label: "Scostamento previsioni", value: "<2", unit: "%", delta: "da ~8%", deltaTone: "success" },
    ],
    dashboards: [
      {
        id: "predictive-budgeting",
        title: "Predictive Budgeting",
        kpis: [
          { label: "Accuratezza forecast", value: "96.4", unit: "%", spark: [82, 86, 89, 92, 94, 96.4] },
          { label: "Scostamento medio", value: "<2", unit: "%", delta: "da ~8%", deltaTone: "success" },
          { label: "Scenari simulati", value: "128", unit: "/mese" },
          { label: "Tempo di chiusura", value: "−58", unit: "%", deltaTone: "success" },
        ],
      },
      {
        id: "roi-tracker",
        title: "ROI Tracker",
        kpis: [
          { label: "ROI cumulato", value: "312", unit: "%", spark: [40, 110, 180, 230, 280, 312] },
          { label: "Payback period", value: "3.4", unit: "mesi" },
          { label: "Risparmio annuo stimato", value: "€ 374k" },
          { label: "Costo implementazione", value: "€ 98k", note: "una tantum" },
        ],
      },
      {
        id: "controlling",
        title: "Controllo di gestione e reporting",
        kpis: [
          { label: "KPI monitorati", value: "52" },
          { label: "Report automatici", value: "26", unit: "/mese" },
          { label: "Tempo di reporting", value: "−68", unit: "%", deltaTone: "success" },
          { label: "Precisione previsioni", value: "96.4", unit: "%" },
        ],
      },
      {
        id: "accounting",
        title: "Contabilità",
        kpis: [
          { label: "Fatture / mese", value: "3.280" },
          { label: "Riconciliazione auto", value: "99.1", unit: "%", delta: "+11 pt", deltaTone: "success" },
          { label: "Tempo registrazione", value: "8", unit: "sec", note: "da 4 min" },
          { label: "Scadute", value: "4", note: "da sollecitare" },
        ],
      },
    ],
  },
  {
    id: "basedigitale",
    name: "Base Digitale",
    sector: "ICT & Trasformazione Digitale",
    accent: "#B3003C",
    accentSoft: "#FBE6EC",
    logo: "/basedigitale-logo.svg",
    logoBg: "white",
    barrierTag: "Valore predittivo da dimostrare",
    barrier:
      "Servono prove concrete di accuratezza predittiva e ritorno economico — anche in ottica canale verso i propri clienti.",
    pitch: "Forecasting AI ad alta precisione e ROI Tracker, replicabile come offerta verso i clienti finali.",
    objectives: ["Forecasting Accuracy", "ROI dimostrabile", "Fast Closing"],
    processNames: ["Controllo di gestione e reporting", "Pianificazione & Budgeting", "Contabilità & Fatturazione", "Gestione documentale"],
    overviewKpis: [
      { label: "Forecasting Accuracy", value: "96.2", unit: "%", spark: [84, 87, 90, 92, 94, 96.2] },
      { label: "ROI a 12 mesi", value: "287", unit: "%", note: "su portafoglio clienti" },
      { label: "Scostamento previsioni", value: "<2", unit: "%", delta: "da ~9%", deltaTone: "success" },
    ],
    dashboards: [
      {
        id: "predictive-budgeting",
        title: "Predictive Budgeting",
        kpis: [
          { label: "Accuratezza forecast", value: "96.2", unit: "%", spark: [84, 87, 90, 92, 94, 96.2] },
          { label: "Scostamento medio", value: "<2", unit: "%", delta: "da ~9%", deltaTone: "success" },
          { label: "Clienti pilota", value: "6" },
          { label: "Tempo setup per cliente", value: "5", unit: "gg" },
        ],
      },
      {
        id: "roi-tracker",
        title: "ROI Tracker",
        kpis: [
          { label: "ROI a 12 mesi", value: "287", unit: "%" },
          { label: "Payback period", value: "4.1", unit: "mesi" },
          { label: "Margine canale stimato", value: "15-25%", note: "revenue share" },
          { label: "Clienti raggiungibili", value: "120+", note: "portafoglio attuale" },
        ],
      },
      {
        id: "controlling",
        title: "Controllo di gestione e reporting",
        kpis: [
          { label: "KPI monitorati", value: "44" },
          { label: "Report automatici", value: "19", unit: "/mese" },
          { label: "Tempo di reporting", value: "−70", unit: "%", deltaTone: "success" },
          { label: "Precisione previsioni", value: "96.2", unit: "%" },
        ],
      },
      {
        id: "accounting",
        title: "Contabilità & Fatturazione",
        kpis: [
          { label: "Fatture / mese", value: "3.280" },
          { label: "Riconciliazione auto", value: "99.1", unit: "%", delta: "+11 pt", deltaTone: "success" },
          { label: "Tempo registrazione", value: "8", unit: "sec", note: "da 4 min" },
          { label: "Scadute", value: "4", note: "da sollecitare" },
        ],
      },
    ],
  },
  {
    id: "capitani-picone",
    name: "Studio Capitani Picone",
    sector: "Consulenza & Advisory professionale",
    eyebrow: "Studio professionale · ~50 anni",
    accent: "#1F3A5F",
    accentSoft: "#E6ECF3",
    logo: "/studio_capitani_picone_logo.jpeg",
    logoBg: "white",
    barrierTag: "Mancanza competenze tecniche interne",
    barrier:
      "Il team è composto da professionisti con forte specializzazione consulenziale, ma senza figure dedicate all'AI o all'innovation: serve una piattaforma gestita con onboarding guidato.",
    pitch:
      "AI come co-pilot del professionista: forecasting accuracy e fast closing senza sviluppo interno, replicabile su tutto il portafoglio clienti dello studio.",
    objectives: [
      "Fast Closing",
      "Forecasting Accuracy",
      "Anomaly Detection",
      "Riduzione costi AFC",
    ],
    processNames: [
      "Controllo di gestione e reporting",
      "Pianificazione & Budgeting",
    ],
    overviewKpis: [
      {
        label: "Fast Closing",
        value: "2.1",
        unit: "gg",
        delta: "−65%",
        deltaTone: "success",
        spark: [6, 5.2, 4.4, 3.5, 2.7, 2.1],
      },
      {
        label: "Forecasting Accuracy",
        value: "95.3",
        unit: "%",
        delta: "da ~86%",
        deltaTone: "success",
        spark: [78, 82, 86, 89, 92, 95.3],
      },
      {
        label: "Anomalie / mese",
        value: "8",
        note: "proattive, alert automatico",
      },
    ],
    dashboards: [
      {
        id: "fast-closing",
        title: "Fast Closing",
        kpis: [
          { label: "Tempo di chiusura", value: "2.1", unit: "gg", delta: "−65%", deltaTone: "success", spark: [6, 5.2, 4.4, 3.5, 2.7, 2.1] },
          { label: "Forecasting Accuracy", value: "95.3", unit: "%", spark: [78, 82, 86, 89, 92, 95.3] },
          { label: "Ore/uomo risparmiate", value: "96", unit: "h", note: "sul ciclo di chiusura" },
          { label: "Costo evitato / mese", value: "€ 14.2k", note: "riduzione costi operativi AFC" },
        ],
      },
      {
        id: "budgeting",
        title: "Pianificazione & Budgeting",
        kpis: [
          { label: "Budget gestito", value: "€ 3.20M", spark: [240, 258, 270, 285, 300, 320] },
          { label: "Aderenza al piano", value: "96.8", unit: "%", delta: "+6,2 pt", deltaTone: "success" },
          { label: "Cicli di revisione", value: "2", unit: "/mese", note: "vs 5 manuali" },
          { label: "Forecast a 6 mesi", value: "€ 1.74M", spark: [270, 276, 282, 288, 294, 300] },
        ],
      },
      {
        id: "accounting",
        title: "Contabilità & Fatturazione",
        kpis: [
          { label: "Fatture / mese", value: "1.860", spark: [1.3, 1.45, 1.6, 1.7, 1.78, 1.86] },
          { label: "Riconciliazione auto", value: "98.7", unit: "%", delta: "+12 pt", deltaTone: "success" },
          { label: "Tempo medio registrazione", value: "9", unit: "sec", note: "da 4 min" },
          { label: "Errori contabili", value: "−84", unit: "%", deltaTone: "success" },
        ],
      },
      {
        id: "controlling",
        title: "Controllo di gestione e reporting",
        kpis: [
          {
            label: "KPI monitorati",
            value: "42",
            spark: [22, 26, 30, 33, 38, 42],
          },
          {
            label: "Report automatici",
            value: "18",
            unit: "/mese",
            note: "in tempo reale",
            spark: [6, 9, 12, 14, 16, 18],
          },
          {
            label: "Tempo di reporting",
            value: "−72",
            unit: "%",
            deltaTone: "success",
            spark: [10, 8, 6.5, 5, 3.8, 2.8],
          },
          {
            label: "Precisione dati",
            value: "97.1",
            unit: "%",
            note: "fonti riconciliate",
            spark: [82, 86, 89, 92, 95, 97.1],
          },
        ],
      },
      {
        id: "predictive-budgeting",
        title: "Pianificazione & Budgeting predittivo",
        kpis: [
          {
            label: "Accuratezza forecast",
            value: "95.3",
            unit: "%",
            spark: [78, 82, 86, 89, 92, 95.3],
          },
          {
            label: "Scostamento medio",
            value: "<2.5",
            unit: "%",
            delta: "da ~7%",
            deltaTone: "success",
            spark: [7, 6, 5, 4, 3.2, 2.5],
          },
          {
            label: "Clienti pilota",
            value: "3",
            note: "portafoglio studio",
            spark: [0, 0, 1, 2, 2, 3],
          },
          {
            label: "Tempo di chiusura",
            value: "−58",
            unit: "%",
            deltaTone: "success",
            spark: [10, 8.5, 7, 5.8, 4.6, 4.2],
          },
        ],
      },
    ],
  },
  {
    id: "medicair",
    name: "MedicAir",
    sector: "Healthcare & Assistenza Domiciliare",
    eyebrow: "Healthcare & Dispositivi Medici",
    accent: "#00A1DF",
    accentSoft: "#E1F4FC",
    logo: "/medicair-logo.png",
    logoBg: "accent",
    barrierTag: "Dati frammentati su più fonti",
    barrier:
      "Dati sparsi tra ERP, CRM ed Excel: impossibile ottenere una visione unica e affidabile prima del forecasting.",
    pitch: "Fase 1: unificazione e pulizia automatica dei dati. Fase 2: forecasting affidabile costruito sopra.",
    objectives: ["Data Cleansing", "Fast Closing", "Forecasting Accuracy"],
    processNames: ["Controllo di gestione e reporting", "Pianificazione & Budgeting", "Contabilità & Fatturazione"],
    overviewKpis: [
      { label: "Record unificati", value: "50.000", note: "da 4 fonti" },
      { label: "Qualità del dato", value: "98", unit: "%", delta: "+38 pt", deltaTone: "success", spark: [55, 60, 70, 82, 92, 98] },
      { label: "Record corretti", value: "1.240", note: "duplicati + malformati" },
    ],
    dataSources: [
      { name: "ERP Assistenza Domiciliare", meta: "ERP · 21.400 record", icon: "erp", progress: 62, status: "Disconnesso" },
      { name: "CRM Dispositivi Medici", meta: "CRM · 14.850 record", icon: "crm", progress: 71, status: "Disconnesso" },
      { name: "Excel Contabilità Logistica", meta: "File · 9.320 record", icon: "file", progress: 38, status: "Disconnesso" },
      { name: "Gestionale Magazzino Farmaci", meta: "DB · 4.430 record", icon: "db", progress: 55, status: "Disconnesso" },
    ],
    dashboards: [
      {
        id: "data-ingestion",
        title: "Data Ingestion & Cleansing (Fase 1)",
        kpis: [
          { label: "Fonti integrate", value: "4", note: "ERP, CRM, Excel, archivi" },
          { label: "Record unificati", value: "50.000" },
          { label: "Qualità del dato", value: "98", unit: "%", delta: "+38 pt", deltaTone: "success", spark: [55, 60, 70, 82, 92, 98] },
          { label: "Duplicati risolti", value: "1.240" },
        ],
      },
      {
        id: "unified-forecast",
        title: "Forecasting Unificato (Fase 2)",
        kpis: [
          { label: "Accuratezza forecast", value: "93.5", unit: "%", note: "su dati consolidati" },
          { label: "Scostamento medio", value: "<3", unit: "%" },
          { label: "Tempo di chiusura", value: "−45", unit: "%", deltaTone: "success" },
          { label: "Affidabilità dati a monte", value: "98", unit: "%" },
        ],
      },
      {
        id: "controlling",
        title: "Controllo di gestione e reporting",
        kpis: [
          { label: "KPI monitorati", value: "38" },
          { label: "Report automatici", value: "14", unit: "/mese" },
          { label: "Tempo di reporting", value: "−52", unit: "%", deltaTone: "success" },
          { label: "Copertura dati", value: "100", unit: "%", note: "vs 62% iniziale" },
        ],
      },
      {
        id: "accounting",
        title: "Contabilità & Fatturazione",
        kpis: [
          { label: "Fatture / mese", value: "3.280" },
          { label: "Riconciliazione auto", value: "99.1", unit: "%", delta: "+11 pt", deltaTone: "success" },
          { label: "Tempo registrazione", value: "8", unit: "sec", note: "da 4 min" },
          { label: "Scadute", value: "4", note: "da sollecitare" },
        ],
      },
    ],
  },
];

/** Per-dashboard sidebar metadata (short nav label + icon key), keyed by dashboard id.
 *  Mirrors the design's per-partner navigation. Icons resolved in SidebarNav. */
export type NavIconKey =
  | "grid"
  | "bolt"
  | "target"
  | "receipt"
  | "gauge"
  | "scan"
  | "shield"
  | "folder"
  | "trend"
  | "coins"
  | "layers";

export const PROCESS_NAV_META: Record<string, { navLabel: string; icon: NavIconKey }> = {
  "fast-closing": { navLabel: "Fast Closing", icon: "bolt" },
  budgeting: { navLabel: "Pianificazione & Budget", icon: "target" },
  "doc-intelligence": { navLabel: "Document Intelligence", icon: "scan" },
  fraud: { navLabel: "Anomaly & Fraud", icon: "shield" },
  "doc-archive": { navLabel: "Gestione documentale", icon: "folder" },
  "predictive-budgeting": { navLabel: "Predictive Budgeting", icon: "trend" },
  "roi-tracker": { navLabel: "ROI Tracker", icon: "coins" },
  "data-ingestion": { navLabel: "Data Ingestion", icon: "layers" },
  "unified-forecast": { navLabel: "Forecasting Unificato", icon: "trend" },
  controlling: { navLabel: "Controllo di gestione", icon: "gauge" },
  accounting: { navLabel: "Contabilità & Fatturazione", icon: "receipt" },
};

/** The flagship (recommended-demo) dashboard id per client — gets the "DEMO" badge in the sidebar. */
export const CLIENT_FLAGSHIP: Record<string, string> = {
  agfm: "fast-closing",
  edison: "doc-intelligence",
  systra: "predictive-budgeting",
  basedigitale: "predictive-budgeting",
  "capitani-picone": "predictive-budgeting",
  medicair: "data-ingestion",
};

export function getClient(id: string) {
  return CLIENTS.find((c) => c.id === id);
}

// ---- Italian locale number formatting ----
export const itNum = (n: number) => Math.round(n).toLocaleString("it-IT");

// ---- AGFM · Fast Closing pipeline ----
export type PipelineStep = { label: string; detail: string; ms: number };

export const FAST_CLOSING = {
  steps: [
    { label: "Riconciliazione fatture correnti", detail: "2.847 movimenti elaborati", ms: 1700 },
    { label: "Verifica quadrature di bilancio", detail: "Partite aperte: 0 squadrature", ms: 1500 },
    { label: "Controllo IVA e ritenute", detail: "Aliquote validate automaticamente", ms: 1400 },
    { label: "Generazione report di chiusura", detail: "Bilancio + nota integrativa", ms: 1600 },
  ] as PipelineStep[],
  kpis: { closingDays: "1.5", closingDelta: "-70%", accuracy: "94.8", hoursSaved: "112", costSaved: "18.400" },
  accuracySeries: [78.2, 80.1, 81.6, 80.9, 83.4, 85.7, 87.2, 88.9, 90.1, 92.4, 93.6, 94.8],
  accuracyLabels: ["Lug", "Ago", "Set", "Ott", "Nov", "Dic", "Gen", "Feb", "Mar", "Apr", "Mag", "Giu"],
  closingTrend: [5.0, 4.6, 4.1, 3.4, 2.8, 1.5],
};

// ---- Edison · Document Intelligence ----
export type ExtractedField = { key: string; value: string; conf: number };
export type Anomaly = {
  id: string; file: string; supplier: string; date: string; amount: string;
  type: string; severity: "high" | "medium" | "low"; risk: number; note: string;
};
export type ArchivedDocument = {
  name: string; type: string; cat: string; supplier: string; date: string;
  size: string; status: "registered" | "archived" | "review"; tags: string[];
};

export const DOC_INTELLIGENCE = {
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
  ] as ExtractedField[],
  anomaly: {
    level: "danger",
    title: "Rilevata Anomalia: Rischio Frode / Duplicato",
    text: "L'importo di questa fattura supera del 45% la media storica per questo fornitore nel periodo di riferimento. Verificare possibile errore di fatturazione o duplicazione.",
    historicalAvg: "€ 32.300",
    thisInvoice: "€ 46.872",
    deltaPct: 45,
  },
  history: [29.8, 31.2, 30.6, 33.1, 32.0, 34.2, 31.9, 46.9],
  historyLabels: ["Ott", "Nov", "Dic", "Gen", "Feb", "Mar", "Apr", "Mag"],
  anomalies: [
    { id: "FT-2026-008842", file: "Fattura_Fornitore_Energia.pdf", supplier: "Energetica Sud S.p.A.", date: "28/05/2026", amount: "€ 46.872,40", type: "Importo fuori scala", severity: "high", risk: 92, note: "+45% sulla media storica del fornitore" },
    { id: "FT-2026-008790", file: "Fattura_Cloud_Provider.pdf", supplier: "NordCloud Services Srl", date: "26/05/2026", amount: "€ 12.300,00", type: "Possibile duplicato", severity: "medium", risk: 64, note: "Stesso importo e fornitore di FT-2026-008611" },
    { id: "FT-2026-008763", file: "Fattura_Consulenza_IT.pdf", supplier: "Delta Advisory", date: "24/05/2026", amount: "€ 9.450,00", type: "IBAN non corrispondente", severity: "high", risk: 88, note: "IBAN diverso da quello anagrafico del fornitore" },
    { id: "FT-2026-008701", file: "Fattura_Trasporti_Mag.pdf", supplier: "LogiTrans S.p.A.", date: "21/05/2026", amount: "€ 5.980,00", type: "Scadenza anomala", severity: "low", risk: 38, note: "Termini di pagamento fuori dal contratto quadro" },
    { id: "FT-2026-008688", file: "Fattura_Materiali_B12.pdf", supplier: "Brixia Materiali", date: "19/05/2026", amount: "€ 21.540,00", type: "Fornitore non in anagrafica", severity: "medium", risk: 71, note: "Primo pagamento verso questo soggetto" },
    { id: "FT-2026-008642", file: "Nota_Credito_Q1.pdf", supplier: "Energetica Sud S.p.A.", date: "16/05/2026", amount: "€ 3.120,00", type: "Sequenza numerica irregolare", severity: "low", risk: 31, note: "Numerazione non progressiva rispetto allo storico" },
  ] as Anomaly[],
  fraudKpis: { flagged: 37, atRisk: "214k", blocked: "186k", falsePos: "3.1" },
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
  ] as ArchivedDocument[],
};

// ---- Contabilità & Fatturazione (registro fatture, condiviso) ----
export type Invoice = {
  num: string; dir: "Attiva" | "Passiva"; party: string; date: string; due: string;
  taxable: string; vat: string; total: string;
  status: "registered" | "sent" | "paid" | "review" | "overdue";
};

export const ACCOUNTING = {
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
  ] as Invoice[],
};

// ---- Systra / Base Digitale · Predictive Budgeting & ROI ----
export const PREDICTIVE = {
  labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
  actualMonths: 6,
  planned: [420, 430, 445, 440, 460, 470, 475, 480, 485, 490, 500, 510],
  actual: [435, 448, 452, 470, 463, 481, null, null, null, null, null, null] as (number | null)[],
  forecastBase: [435, 448, 452, 470, 463, 481, 486, 492, 498, 503, 511, 519],
  roiTable: [
    { item: "Tempo Chiusura Mensile", traditional: "5 Giorni / Uomo", aichain: "1 Giorno / Uomo", saving: "80% ore risparmiate" },
    { item: "Errori di Previsione", traditional: "Scostamento ~8%", aichain: "Scostamento <2%", saving: "Riduzione rischio capitale" },
    { item: "Infrastruttura IT", traditional: "Costi licenze fisse", aichain: "Pay-as-you-go", saving: "Azzeramento costi fissi" },
  ],
  roiSummary: { monthlySaving: "31.200", annualSaving: "374.400", payback: "2.4", roiPct: "312" },
};

// ---- MedicAir · Data Cleansing / Ingestion ----
export type DataSource = { name: string; type: string; records: number; health: number; icon: string };

export const CLEANSING = {
  sources: [
    { name: "ERP Assistenza Domiciliare", type: "ERP", records: 21400, health: 62, icon: "server" },
    { name: "CRM Dispositivi Medici", type: "CRM", records: 14850, health: 71, icon: "users" },
    { name: "Excel Contabilità Logistica", type: "File", records: 9320, health: 38, icon: "sheet" },
    { name: "Gestionale Magazzino Farmaci", type: "DB", records: 4430, health: 55, icon: "box" },
  ] as DataSource[],
  totalRecords: 50000,
  fixedRecords: 1240,
  duplicates: 612,
  malformed: 628,
  unifiedForecast: {
    labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set"],
    actualMonths: 5,
    actual: [128, 134, 131, 142, 139, null, null, null, null] as (number | null)[],
    forecast: [128, 134, 131, 142, 139, 146, 151, 155, 161],
  },
};

// ---- Chat "Esperto AIchain" ----
export function expertReplyFallback(q: string, client?: ClientProfile | null) {
  const t = q.toLowerCase();
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

export function suggestionsFor(client?: ClientProfile | null) {
  const base = [
    "Cos'è il Fast Closing e quanto fa risparmiare?",
    "Come vi integrate con il nostro ERP?",
    "Che ROI posso aspettarmi?",
    "Serve un team tecnico interno?",
  ];
  if (!client) return base;
  const map: Record<string, string[]> = {
    agfm: ["Davvero non serve personale IT?", "Quanto si riduce il tempo di chiusura?", "Come migliora la forecasting accuracy?"],
    edison: ["Come rilevate le frodi sulle fatture?", "L'integrazione tocca il nostro ERP?", "Gestite grandi volumi documentali?"],
    systra: ["Come calcolate il ROI?", "Cosa fa la simulazione What-If?", "Quanto è preciso il forecasting?"],
    basedigitale: ["Come calcolate il ROI?", "Cosa fa la simulazione What-If?", "Quanto è preciso il forecasting?"],
    "capitani-picone": ["Serve un team tecnico interno?", "È replicabile sui clienti dello studio?", "Quanto migliora la forecasting accuracy?"],
    medicair: ["Come unificate dati da fonti diverse?", "Quanti record correggete in automatico?", "Quando si sblocca il forecasting?"],
  };
  return map[client.id] || base;
}

// ---- Analytics per prospect (overview charts) ----
export type AnalyticsPoint = { label: string; value: number };
export type BeforeAfter = { label: string; prima: number; dopo: number };
export type BreakdownSlice = { name: string; value: number };
export type ClientAnalytics = {
  trendTitle: string;
  trendUnit?: string;
  trend: AnalyticsPoint[];
  beforeAfterTitle: string;
  beforeAfterNote?: string;
  beforeAfter: BeforeAfter[];
  breakdownTitle: string;
  breakdownUnit?: string;
  breakdown: BreakdownSlice[];
};

const M = ["Lug", "Ago", "Set", "Ott", "Nov", "Dic", "Gen", "Feb", "Mar", "Apr", "Mag", "Giu"];
const series = (vals: number[]): AnalyticsPoint[] => vals.map((value, i) => ({ label: M[i] ?? `M${i + 1}`, value }));

export const CLIENT_ANALYTICS: Record<string, ClientAnalytics> = {
  agfm: {
    trendTitle: "Tempo di chiusura mensile",
    trendUnit: "gg",
    trend: series([5.0, 4.8, 4.5, 4.0, 3.6, 3.2, 2.8, 2.4, 2.1, 1.8, 1.6, 1.5]),
    beforeAfterTitle: "Prima vs Con AIchain",
    beforeAfterNote: "Indice 100 = situazione di partenza",
    beforeAfter: [
      { label: "Tempo chiusura", prima: 100, dopo: 30 },
      { label: "Costi AFC", prima: 100, dopo: 62 },
      { label: "Errori contabili", prima: 100, dopo: 14 },
    ],
    breakdownTitle: "Dove si risparmia tempo",
    breakdownUnit: "%",
    breakdown: [
      { name: "Riconciliazione", value: 40 },
      { name: "Quadrature di bilancio", value: 25 },
      { name: "Reportistica", value: 20 },
      { name: "Controlli IVA", value: 15 },
    ],
  },
  edison: {
    trendTitle: "Documenti elaborati / mese",
    trend: series([8000, 8600, 9000, 9500, 9800, 10400, 10800, 11200, 11600, 12000, 12200, 12400]),
    beforeAfterTitle: "Prima vs Con AIchain",
    beforeAfterNote: "Indice 100 = situazione di partenza",
    beforeAfter: [
      { label: "Tempo elaborazione", prima: 100, dopo: 2 },
      { label: "Costo AFC", prima: 100, dopo: 58 },
      { label: "Anomalie non rilevate", prima: 100, dopo: 8 },
    ],
    breakdownTitle: "Tipi di anomalia rilevati",
    breakdownUnit: "%",
    breakdown: [
      { name: "Importi fuori scala", value: 30 },
      { name: "Duplicati", value: 25 },
      { name: "IBAN non corrispondente", value: 20 },
      { name: "Fornitore non in anagrafica", value: 15 },
      { name: "Scadenze anomale", value: 10 },
    ],
  },
  systra: {
    trendTitle: "ROI cumulato",
    trendUnit: "%",
    trend: series([0, 30, 70, 110, 150, 190, 225, 255, 275, 290, 302, 312]),
    beforeAfterTitle: "Prima vs Con AIchain",
    beforeAfterNote: "Indice 100 = situazione di partenza",
    beforeAfter: [
      { label: "Scostamento previsioni", prima: 100, dopo: 25 },
      { label: "Tempo reporting", prima: 100, dopo: 32 },
      { label: "Costo processi", prima: 100, dopo: 70 },
    ],
    breakdownTitle: "Composizione del risparmio annuo",
    breakdownUnit: "%",
    breakdown: [
      { name: "Efficienza operativa", value: 45 },
      { name: "Riduzione errori", value: 25 },
      { name: "Ottimizzazione forecast", value: 20 },
      { name: "Compliance", value: 10 },
    ],
  },
  basedigitale: {
    trendTitle: "Forecasting Accuracy",
    trendUnit: "%",
    trend: series([84, 86, 88, 89.5, 91, 92.2, 93.4, 94.2, 95, 95.6, 96, 96.2]),
    beforeAfterTitle: "Prima vs Con AIchain",
    beforeAfterNote: "Indice 100 = situazione di partenza",
    beforeAfter: [
      { label: "Scostamento previsioni", prima: 100, dopo: 22 },
      { label: "Tempo reporting", prima: 100, dopo: 30 },
      { label: "Setup per cliente", prima: 100, dopo: 33 },
    ],
    breakdownTitle: "Portafoglio clienti per segmento",
    breakdownUnit: "%",
    breakdown: [
      { name: "PMI", value: 40 },
      { name: "Studi professionali", value: 30 },
      { name: "Enti & PA", value: 18 },
      { name: "Altri", value: 12 },
    ],
  },
  medicair: {
    trendTitle: "Qualità del dato",
    trendUnit: "%",
    trend: series([55, 58, 62, 68, 74, 80, 85, 89, 92, 95, 97, 98]),
    beforeAfterTitle: "Prima vs Con AIchain",
    beforeAfterNote: "Valori in % — più alto è meglio",
    beforeAfter: [
      { label: "Qualità dato", prima: 60, dopo: 98 },
      { label: "Copertura fonti", prima: 62, dopo: 100 },
      { label: "Affidabilità forecast", prima: 55, dopo: 97 },
    ],
    breakdownTitle: "Record unificati per fonte",
    breakdown: [
      { name: "ERP Assistenza Domiciliare", value: 21400 },
      { name: "CRM Dispositivi Medici", value: 14850 },
      { name: "Excel Contabilità Logistica", value: 9320 },
      { name: "Gestionale Magazzino Farmaci", value: 4430 },
    ],
  },
  "capitani-picone": {
    trendTitle: "Tempo di chiusura mensile",
    trendUnit: "gg",
    trend: series([5.0, 4.8, 4.5, 4.0, 3.6, 3.2, 2.8, 2.4, 2.1, 1.8, 1.6, 1.5]),
    beforeAfterTitle: "Prima vs Con AIchain",
    beforeAfterNote: "Indice 100 = situazione di partenza",
    beforeAfter: [
      { label: "Tempo chiusura", prima: 100, dopo: 30 },
      { label: "Costi AFC", prima: 100, dopo: 62 },
      { label: "Errori contabili", prima: 100, dopo: 14 },
    ],
    breakdownTitle: "Dove si risparmia tempo",
    breakdownUnit: "%",
    breakdown: [
      { name: "Riconciliazione", value: 40 },
      { name: "Quadrature di bilancio", value: 25 },
      { name: "Reportistica", value: 20 },
      { name: "Controlli IVA", value: 15 },
    ],
  },
};

// ---- Contesto di settore (sezioni di processo) ----
export type SectorBenchmark = {
  metric: string;
  you: number;
  sector: number;
  unit?: string;
  betterWhenLower?: boolean;
};
export type SectorContext = {
  sector: string;
  intro: string;
  insights: string[];
  benchmark: SectorBenchmark;
};

export const SECTOR_CONTEXT: Record<string, SectorContext> = {
  agfm: {
    sector: "Consulenza & Tax Advisory",
    intro:
      "Negli studi di consulenza lo stesso processo si ripete su molti clienti: ogni automazione si moltiplica per l'intero portafoglio.",
    insights: [
      "Riduzione del rischio di errore su scadenze e adempimenti fiscali.",
      "Il team si concentra su attività a valore (advisory) anziché su data entry.",
      "Onboarding guidato: nessun personale IT dedicato richiesto.",
    ],
    benchmark: { metric: "Tempo medio di chiusura", you: 1.5, sector: 5, unit: "gg", betterWhenLower: true },
  },
  edison: {
    sector: "Energy & Utilities",
    intro:
      "Nelle utility i volumi documentali sono enormi: l'AI scala senza aumentare il personale e tiene sotto controllo i rischi di frode.",
    insights: [
      "Controllo anomalie critico su forniture e fatturazione energetica.",
      "Integrazione tramite connettore, senza modifiche all'ERP esistente.",
      "Conservazione a norma e audit trail per i controlli di settore.",
    ],
    benchmark: { metric: "Tempo medio elaborazione documento", you: 4, sector: 360, unit: "sec", betterWhenLower: true },
  },
  systra: {
    sector: "Infrastrutture & Mobilità",
    intro:
      "Su commesse infrastrutturali pluriennali un forecasting accurato riduce il rischio di progetto e rende il ROI dimostrabile.",
    insights: [
      "Simulazioni di scenario su costi materiali, tempi e avanzamento commessa.",
      "ROI misurabile fin dal primo trimestre di adozione.",
      "Scostamenti di previsione monitorati in continuo.",
    ],
    benchmark: { metric: "Accuratezza forecast", you: 96.4, sector: 88, unit: "%" },
  },
  basedigitale: {
    sector: "ICT & Trasformazione Digitale",
    intro:
      "Il modello è replicabile come offerta verso i clienti finali: l'accuratezza predittiva diventa un argomento commerciale.",
    insights: [
      "Forecasting ad alta precisione come elemento di credibilità verso i clienti.",
      "Setup rapido per ogni nuovo cliente del portafoglio.",
      "Replicabile in ottica canale (white-label / revenue share).",
    ],
    benchmark: { metric: "Accuratezza forecast", you: 96.2, sector: 88, unit: "%" },
  },
  medicair: {
    sector: "Healthcare & Assistenza Domiciliare",
    intro:
      "Con dati sanitari frammentati tra ERP, CRM ed Excel, l'unificazione e la qualità del dato sono il prerequisito per ogni previsione affidabile.",
    insights: [
      "Qualità del dato critica per un forecasting affidabile (Fase 2).",
      "Tracciabilità e compliance su dati sensibili (GDPR).",
      "Una sola fonte di verità da quattro sistemi diversi.",
    ],
    benchmark: { metric: "Qualità del dato", you: 98, sector: 70, unit: "%" },
  },
  "capitani-picone": {
    sector: "Consulenza & Advisory professionale",
    intro:
      "In uno studio professionale lo stesso processo si ripete su molti clienti: l'AI come co-pilot moltiplica l'efficienza senza richiedere figure tecniche interne.",
    insights: [
      "Forecasting e fast closing replicabili su tutto il portafoglio clienti dello studio.",
      "Alert proattivi sulle anomalie, senza presidio manuale continuo.",
      "Piattaforma gestita con onboarding guidato: nessuno sviluppo interno.",
    ],
    benchmark: { metric: "Accuratezza forecast", you: 95.3, sector: 86, unit: "%" },
  },
};

// ---- Value summary per prospect ("Valore & risultati") ----
export type ValueTransform = { label: string; prima: string; dopo: string };
export type ValueProp = {
  howWeSolve: string[];
  whatYouGet: string[];
  transform: ValueTransform[];
  outcome: string;
};

export const VALUE_PROPS: Record<string, ValueProp> = {
  agfm: {
    howWeSolve: [
      "Piattaforma cloud gestita: zero codice e zero infrastruttura interna.",
      "Onboarding guidato del team AFC in pochi giorni.",
      "Connessione ai dati esistenti senza personale IT dedicato.",
      "Automazione di chiusura, budgeting e reporting.",
    ],
    whatYouGet: [
      "Chiusura mensile in 1,5 giorni invece di 5.",
      "Forecasting affidabile al 94,8%.",
      "Team libero dal data entry, focalizzato sull'advisory.",
      "Modello replicabile su tutti i clienti dello studio.",
    ],
    transform: [
      { label: "Tempo di chiusura", prima: "5 giorni", dopo: "1,5 giorni" },
      { label: "Competenze IT richieste", prima: "Personale dedicato", dopo: "Nessuna" },
      { label: "Errori contabili", prima: "Frequenti", dopo: "−86%" },
    ],
    outcome: "Un team AFC che fa di più, senza diventare un team tecnico.",
  },
  edison: {
    howWeSolve: [
      "Connettore non invasivo all'ERP esistente: nessuna modifica strutturale.",
      "Estrazione documentale AI su grandi volumi.",
      "Controllo anomalie e frodi su ogni documento in ingresso.",
      "Conservazione a norma e audit trail.",
    ],
    whatYouGet: [
      "12.400 documenti/mese elaborati in automatico.",
      "Anomalie e frodi intercettate prima della registrazione (€ 214k a rischio).",
      "−42% sul costo del processo AFC.",
      "ERP intatto: zero rischio sul sistema in produzione.",
    ],
    transform: [
      { label: "Elaborazione documento", prima: "6 minuti", dopo: "4 secondi" },
      { label: "Anomalie rilevate", prima: "Manuale / tardivo", dopo: "Real-time" },
      { label: "Costo AFC", prima: "100 (indice)", dopo: "−42%" },
    ],
    outcome: "Più controllo e meno costi, senza toccare l'ERP.",
  },
  systra: {
    howWeSolve: [
      "Forecasting AI con simulazioni di scenario in tempo reale.",
      "ROI tracker con misurazione del valore fin dal primo trimestre.",
      "Integrazione con i dati di commessa.",
      "Reporting automatico per il controllo di gestione.",
    ],
    whatYouGet: [
      "ROI a 12 mesi del 312%.",
      "Scostamento previsioni < 2% (da ~8%).",
      "Risparmio annuo stimato € 374k.",
      "Decisioni anticipate sulle commesse.",
    ],
    transform: [
      { label: "Scostamento previsioni", prima: "~8%", dopo: "<2%" },
      { label: "ROI a 12 mesi", prima: "Da dimostrare", dopo: "312%" },
      { label: "Tempo di reporting", prima: "100 (indice)", dopo: "−68%" },
    ],
    outcome: "Il valore non promesso, ma misurato.",
  },
  basedigitale: {
    howWeSolve: [
      "Forecasting ad alta precisione sui dati del cliente.",
      "Setup rapido e replicabile per ogni cliente del portafoglio.",
      "Modello a canale (white-label / revenue share).",
      "ROI tracker come argomento commerciale.",
    ],
    whatYouGet: [
      "Accuratezza forecast del 96,2%.",
      "Offerta AI replicabile verso 120+ clienti.",
      "Una nuova linea di ricavo a canale.",
      "Credibilità predittiva dimostrabile.",
    ],
    transform: [
      { label: "Accuratezza forecast", prima: "~88%", dopo: "96,2%" },
      { label: "Setup per cliente", prima: "100 (indice)", dopo: "−67%" },
      { label: "Offerta AI a catalogo", prima: "Assente", dopo: "Pronta" },
    ],
    outcome: "Da utilizzatore a rivenditore di valore AI.",
  },
  "capitani-picone": {
    howWeSolve: [
      "AI come co-pilot del professionista, su piattaforma gestita.",
      "Onboarding guidato: nessuno sviluppo interno.",
      "Fast closing, forecasting e anomaly detection automatizzati.",
      "Replicabile su tutto il portafoglio clienti dello studio.",
    ],
    whatYouGet: [
      "Chiusura in 2,1 giorni (−65%).",
      "Forecasting accuracy del 95,3%.",
      "Alert proattivi sulle anomalie.",
      "Un servizio AI offribile ai clienti dello studio.",
    ],
    transform: [
      { label: "Tempo di chiusura", prima: "~6 giorni", dopo: "2,1 giorni" },
      { label: "Competenze tecniche", prima: "Richieste", dopo: "Nessuna" },
      { label: "Forecasting accuracy", prima: "~86%", dopo: "95,3%" },
    ],
    outcome: "Più valore ai clienti dello studio, senza diventare tecnici.",
  },
  medicair: {
    howWeSolve: [
      "Fase 1: unificazione e pulizia automatica dei dati da ERP, CRM, Excel e gestionali.",
      "Scoring di qualità del dato in tempo reale.",
      "Fase 2: forecasting affidabile costruito sui dati consolidati.",
      "Compliance e tracciabilità su dati sensibili.",
    ],
    whatYouGet: [
      "50.000 record unificati da 4 fonti.",
      "Qualità del dato al 98% (+38 pt).",
      "1.240 record corretti automaticamente.",
      "Una sola fonte di verità per il forecasting.",
    ],
    transform: [
      { label: "Qualità del dato", prima: "60%", dopo: "98%" },
      { label: "Fonti dati", prima: "4 separate", dopo: "1 unificata" },
      { label: "Forecasting affidabile", prima: "Bloccato", dopo: "Sbloccato" },
    ],
    outcome: "Prima i dati giusti, poi previsioni di cui fidarsi.",
  },
};

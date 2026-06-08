"use client";

import { useState } from "react";
import {
  Database,
  Server,
  Users,
  FileSpreadsheet,
  Boxes,
  Plug,
  Sparkles,
  ScanText,
  Brain,
  ShieldAlert,
  Workflow,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Cloud,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ClientProfile } from "@/lib/data";

type Detail = {
  title: string;
  summary: string;
  applied: string[];
  tech?: string;
  benefit?: string;
};

const DETAILS: Record<string, Detail> = {
  erp: {
    title: "Integrazione ERP / gestionale",
    summary:
      "Il punto di partenza: i dati restano nell'ERP esistente, che non viene modificato né sostituito.",
    applied: [
      "Connettore in sola lettura via API o export schedulati",
      "Sincronizzazione incrementale (solo i nuovi movimenti)",
      "Mappatura dei campi contabili verso il modello unificato",
    ],
    tech: "API Gateway · connettori certificati · nessuna modifica strutturale all'ERP",
    benefit: "Adozione senza rischi sul sistema gestionale già in produzione.",
  },
  crm: {
    title: "Integrazione CRM",
    summary: "Anagrafiche clienti/fornitori e relazioni commerciali confluiscono nel motore.",
    applied: [
      "Allineamento anagrafiche con deduplica automatica",
      "Arricchimento dei documenti con i dati di controparte",
    ],
    tech: "Connettori CRM · matching anagrafico AI",
    benefit: "Dati di controparte coerenti su fatture, anomalie e forecast.",
  },
  excel: {
    title: "Fogli Excel & file",
    summary: "I dati 'fuori sistema' (Excel, CSV, PDF) vengono acquisiti e strutturati.",
    applied: [
      "Import guidato di fogli e cartelle",
      "Riconoscimento automatico di colonne e formati",
      "Validazione e segnalazione dei dati incoerenti",
    ],
    tech: "Parser file · OCR per i PDF · regole di validazione",
    benefit: "Si recupera il patrimonio informativo disperso in file locali.",
  },
  altri: {
    title: "Altri gestionali",
    summary: "Magazzino, logistica e sistemi verticali vengono collegati al flusso unico.",
    applied: [
      "Connettori dedicati per ciascun sistema",
      "Normalizzazione verso uno schema dati comune",
    ],
    tech: "Connettori modulari · ETL",
    benefit: "Visione 360° dei processi, non solo della contabilità.",
  },
  connettori: {
    title: "Connettori / API Gateway",
    summary: "Lo strato di integrazione non invasivo che orchestra tutte le sorgenti.",
    applied: [
      "Un gateway unico gestisce autenticazione e routing dei dati",
      "Sincronizzazione pianificabile (tempo reale o batch)",
      "Logging completo di ogni scambio per audit",
    ],
    tech: "API Gateway · OAuth/OIDC · code asincrone",
    benefit: "Integrazione sicura e tracciabile senza toccare i sistemi sorgente.",
  },
  datalake: {
    title: "Data Lake unificato",
    summary: "Tutti i dati, puliti e normalizzati, in un unico livello sicuro e interrogabile.",
    applied: [
      "Storage cifrato nel perimetro UE",
      "Modello dati comune per contabilità, documenti e anagrafiche",
      "Versionamento e storicizzazione dei dati",
    ],
    tech: "PostgreSQL · Vector DB · cifratura at-rest",
    benefit: "Base affidabile su cui costruire forecasting e reporting.",
  },
  cleansing: {
    title: "AI Data Cleansing",
    summary: "Pulizia e unificazione automatica: la Fase 1 che sblocca tutto il resto.",
    applied: [
      "Deduplica e fusione di record provenienti da fonti diverse",
      "Correzione di dati malformati e mancanti",
      "Scoring di qualità del dato in tempo reale",
    ],
    tech: "Modelli ML di record-linkage · regole + AI",
    benefit: "Da dati frammentati a un unico flusso affidabile (es. 50.000 record unificati).",
  },
  docintel: {
    title: "Document Intelligence",
    summary: "Estrazione e comprensione automatica dei documenti contabili.",
    applied: [
      "OCR + AI per leggere fatture, DDT, contratti",
      "Estrazione campi (importi, IVA, scadenze) con indicatore di confidenza",
      "Ricerca semantica sui contenuti (RAG su vector DB)",
    ],
    tech: "OCR · RAG · Vector DB · LLM",
    benefit: "Classificazione documentale in secondi, con accuratezza > 98%.",
  },
  predittivi: {
    title: "Motori predittivi",
    summary:
      "I modelli AI che trasformano i dati storici in previsioni e budget affidabili.",
    applied: [
      "Forecasting di ricavi, costi e cash flow su dati consolidati",
      "Simulazioni di scenario 'What-If' in tempo reale",
      "Predictive budgeting con scostamenti monitorati continuamente",
    ],
    tech: "Modelli LSTM / Transformer · TensorFlow · retraining periodico sui dati del cliente",
    benefit: "Decisioni anticipate con accuratezza tipica > 95% e scostamenti < 2%.",
  },
  fraud: {
    title: "Anomaly & Fraud Detection",
    summary: "Controllo automatico di ogni documento in ingresso per rischi e anomalie.",
    applied: [
      "Rilevamento di importi fuori scala, duplicati, IBAN non corrispondenti",
      "Punteggio di rischio per documento, ordinato per priorità",
      "Blocco automatico oltre una soglia configurabile, prima della registrazione",
    ],
    tech: "Modelli di anomaly detection (Z-score / ML) · regole di business",
    benefit: "Intercetta valore a rischio (es. €214k) prima che diventi un problema.",
  },
  automation: {
    title: "Process Automation",
    summary: "L'automazione dei processi AFC orchestrata dal motore.",
    applied: [
      "Fast Closing: chiusura mensile in pipeline automatica",
      "Riconciliazione e registrazione contabile automatica",
      "Generazione di report e bilanci in autonomia",
    ],
    tech: "Workflow engine · regole + AI · pianificazione",
    benefit: "Tempi di chiusura ridotti fino al 70%, meno errori manuali.",
  },
  dashboard: {
    title: "Dashboard web",
    summary: "L'interfaccia che il team AFC usa ogni giorno (è ciò che state vedendo ora).",
    applied: [
      "KPI live e dashboard per ogni processo",
      "Drill-down su tabelle (fatture, anomalie, documenti)",
      "Accesso multi-ruolo con permessi (RBAC)",
    ],
    tech: "Next.js · shadcn/ui · grafici real-time",
    benefit: "Nessun codice per l'utente: tutto via interfaccia guidata.",
  },
  esperto: {
    title: "Esperto AIchain",
    summary: "L'assistente conversazionale che spiega dati e processi in linguaggio naturale.",
    applied: [
      "Domande in linguaggio naturale sui propri dati AFC",
      "Consapevole del contesto (partner e modulo aperto)",
      "Suggerimenti e spiegazioni proattive",
    ],
    tech: "LLM · RAG sui dati del cliente · guardrail di sicurezza",
    benefit: "Riduce la dipendenza da competenze tecniche interne.",
  },
};

function Node({
  id,
  icon: Icon,
  title,
  desc,
  accent,
  onOpen,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className="flex flex-1 items-start gap-3 rounded-[11px] border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2"
      style={{ outlineColor: accent }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}

function Layer({
  step,
  title,
  accent,
  children,
}: {
  step: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          {step}
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </div>
  );
}

function Flow() {
  return (
    <div className="flex justify-center py-0.5">
      <ArrowDown className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

const STACK = [
  "Next.js + shadcn/ui",
  "RAG + Vector DB",
  "TensorFlow",
  "LLM (OpenAI / on-prem)",
  "OCR Document AI",
  "API Gateway",
  "Hyperledger / Polygon",
  "PostgreSQL",
];

const PHASES = [
  { n: "1", t: "Discovery & assessment", d: "Analisi processi AFC, fonti dati e vincoli ERP" },
  { n: "2", t: "Integrazione non invasiva", d: "Connettori/API verso ERP e gestionali, senza modifiche" },
  { n: "3", t: "Training & tuning modelli", d: "Forecasting, document intelligence e anomaly detection sui dati reali" },
  { n: "4", t: "Go-live & dashboard", d: "Rilascio piattaforma, onboarding utenti e KPI live" },
  { n: "5", t: "Supporto & evoluzione", d: "Monitoraggio, retraining e nuovi processi" },
];

export function ArchitectureDiagram({ client }: { client: ClientProfile }) {
  const accent = client.accent;
  const erpSource = client.dataSources?.[0]?.name ?? "ERP aziendale";
  const [active, setActive] = useState<string | null>(null);
  const detail = active ? DETAILS[active] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Architettura della soluzione</CardTitle>
          <p className="text-sm text-muted-foreground">
            Come l&apos;AIchain Finance Engine si integra nell&apos;ecosistema di {client.name}. Clicca su un
            blocco per vederne il dettaglio e come verrà applicato.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Layer step="1" title="Sorgenti dati" accent={accent}>
            <Node id="erp" icon={Server} title={erpSource} desc="Gestionale / ERP" accent={accent} onOpen={setActive} />
            <Node id="crm" icon={Users} title="CRM" desc="Anagrafiche & clienti" accent={accent} onOpen={setActive} />
            <Node id="excel" icon={FileSpreadsheet} title="Excel & file" desc="Fogli e documenti" accent={accent} onOpen={setActive} />
            <Node id="altri" icon={Boxes} title="Altri gestionali" desc="Magazzino, logistica…" accent={accent} onOpen={setActive} />
          </Layer>

          <Flow />

          <Layer step="2" title="Integrazione (non invasiva)" accent={accent}>
            <Node id="connettori" icon={Plug} title="Connettori / API Gateway" desc="Nessuna modifica all'ERP esistente" accent={accent} onOpen={setActive} />
            <Node id="datalake" icon={Database} title="Data Lake unificato" desc="Normalizzazione & storage sicuro" accent={accent} onOpen={setActive} />
          </Layer>

          <Flow />

          <Layer step="3" title="AIchain Finance Engine · Core AI" accent={accent}>
            <Node id="cleansing" icon={Sparkles} title="Data Cleansing" desc="Deduplica & qualità del dato" accent={accent} onOpen={setActive} />
            <Node id="docintel" icon={ScanText} title="Document Intelligence" desc="OCR + RAG su documenti" accent={accent} onOpen={setActive} />
            <Node id="predittivi" icon={Brain} title="Motori predittivi" desc="Forecasting & budgeting AI" accent={accent} onOpen={setActive} />
            <Node id="fraud" icon={ShieldAlert} title="Anomaly & Fraud" desc="Rilevamento anomalie real-time" accent={accent} onOpen={setActive} />
          </Layer>

          <Flow />

          <Layer step="4" title="Automazione & Esperienza utente" accent={accent}>
            <Node id="automation" icon={Workflow} title="Process Automation" desc="Fast Closing, contabilità, reporting" accent={accent} onOpen={setActive} />
            <Node id="dashboard" icon={LayoutDashboard} title="Dashboard web" desc="Next.js + shadcn, KPI live" accent={accent} onOpen={setActive} />
            <Node id="esperto" icon={MessageSquareText} title="Esperto AIchain" desc="Assistente conversazionale" accent={accent} onOpen={setActive} />
          </Layer>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldCheck className="h-4 w-4" style={{ color: accent }} />
              Sicurezza & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• GDPR — dati nel perimetro UE</li>
              <li>• eIDAS 2.0 — firme e identità qualificate</li>
              <li>• Audit trail su blockchain (Hyperledger / Polygon)</li>
              <li>• RBAC, SSO (SAML/OIDC) e cifratura end-to-end</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Cloud className="h-4 w-4" style={{ color: accent }} />
              Deployment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• On-premise oppure private cloud EU</li>
              <li>• Modello Zero-Code, Serverless e scalabile</li>
              <li>• Affiancamento all&apos;ERP, senza sostituirlo</li>
              <li>• Aggiornamenti gestiti e monitoraggio continuo</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Stack tecnologico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {STACK.map((t) => (
              <span
                key={t}
                className="rounded-full border px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: `${accent}12`, color: accent, borderColor: `${accent}33` }}
              >
                {t}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Fasi di implementazione</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {PHASES.map((p) => (
              <li key={p.n} className="flex items-start gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {p.n}
                </span>
                <div>
                  <p className="text-sm font-medium">{p.t}</p>
                  <p className="text-xs text-muted-foreground">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>{detail.title}</DialogTitle>
                <DialogDescription>{detail.summary}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
                    Come verrà applicato
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {detail.applied.map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                {detail.tech && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tecnologie</p>
                    <p className="text-sm">{detail.tech}</p>
                  </div>
                )}
                {detail.benefit && (
                  <div className="rounded-md p-3 text-sm" style={{ backgroundColor: `${accent}12` }}>
                    <span className="font-medium" style={{ color: accent }}>
                      Beneficio per {client.name}:{" "}
                    </span>
                    {detail.benefit}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

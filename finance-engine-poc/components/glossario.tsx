import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Term = { term: string; def: string };

const TERMS: Term[] = [
  { term: "AFC", def: "Amministrazione, Finanza e Controllo: l'area aziendale che gestisce conti, budget e reportistica." },
  { term: "Fast Closing", def: "Chiusura contabile rapida: completare la chiusura mensile/annuale in poco tempo grazie all'automazione." },
  { term: "Forecasting", def: "Previsione: stima dell'andamento futuro di ricavi, costi e cassa basata sui dati storici." },
  { term: "Budgeting", def: "Pianificazione del budget: definizione e gestione delle risorse economiche previste." },
  { term: "Predictive Budgeting", def: "Budget predittivo: pianificazione assistita dall'AI che anticipa scostamenti e scenari." },
  { term: "Data Cleansing", def: "Pulizia dei dati: correzione di duplicati, errori e dati mancanti per renderli affidabili." },
  { term: "Document Intelligence", def: "Lettura intelligente dei documenti: estrazione automatica dei dati da fatture e documenti." },
  { term: "Anomaly & Fraud Detection", def: "Rilevamento anomalie e frodi: individuazione automatica di importi sospetti, duplicati e irregolarità." },
  { term: "Reporting", def: "Reportistica: produzione di report e cruscotti per monitorare l'andamento aziendale." },
  { term: "Riconciliazione", def: "Confronto e abbinamento automatico tra fatture, pagamenti e movimenti contabili." },
  { term: "What-If", def: "Simulazione 'cosa succede se': ricalcolo delle previsioni al variare di un'ipotesi (es. costi +25%)." },
  { term: "ROI", def: "Return On Investment, ritorno sull'investimento: quanto rende ciò che si è speso." },
  { term: "KPI", def: "Key Performance Indicator, indicatore chiave di prestazione: metrica che misura un risultato." },
  { term: "ERP", def: "Enterprise Resource Planning: il gestionale aziendale che governa contabilità, ordini e magazzino." },
  { term: "CRM", def: "Customer Relationship Management: il sistema che gestisce clienti e relazioni commerciali." },
  { term: "RAG", def: "Retrieval-Augmented Generation: l'AI risponde recuperando informazioni dai documenti aziendali reali." },
  { term: "OCR", def: "Optical Character Recognition: riconoscimento del testo contenuto in immagini e PDF." },
  { term: "LLM", def: "Large Language Model: modello di intelligenza artificiale che comprende e genera linguaggio naturale." },
  { term: "API", def: "Interfaccia che permette a due software di scambiarsi dati in automatico." },
  { term: "On-premise", def: "Installazione presso i server del cliente, all'interno della sua infrastruttura." },
  { term: "Cloud", def: "Servizio erogato via internet su server gestiti, senza infrastruttura locale." },
  { term: "SSO", def: "Single Sign-On: accesso unico con le credenziali aziendali a più applicazioni." },
  { term: "GDPR", def: "Regolamento europeo sulla protezione dei dati personali." },
  { term: "eIDAS 2.0", def: "Normativa UE su identità digitale e firme elettroniche qualificate." },
  { term: "Audit trail", def: "Registro tracciabile e immutabile di tutte le operazioni, utile per i controlli." },
];

export function Glossario() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          Glossario · termini e acronimi
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Spiegazione in italiano dei termini tecnici e inglesi usati in questa pagina.
        </p>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {TERMS.map((t) => (
            <div key={t.term} className="text-sm">
              <dt className="font-semibold">{t.term}</dt>
              <dd className="text-muted-foreground">{t.def}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

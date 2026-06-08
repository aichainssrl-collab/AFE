# Medicair — Analisi di Fattibilità (V-Lab Smart Finance)

## Storia / contesto cliente
Medicair è un'azienda italiana leader nei servizi di assistenza domiciliare e tecnologie medicali, con soluzioni integrate per pazienti cronici. Settore sanitario/healthcare, alta sensibilità su dati e compliance.

## Problema
- Processi AFC da implementare: controllo di gestione e reporting, pianificazione & budgeting, contabilità & fatturazione.
- **Barriere (doppia, le più impegnative del gruppo):**
  1. Difficoltà di integrazione con l'ERP attuale;
  2. Qualità o frammentazione dei dati esistenti.
- Orizzonte: misto — lungo termine (oltre 12 mesi) e medio termine (6-12 mesi) a seconda del processo.
- Obiettivi: riduzione tempi di chiusura mensile (fast closing), maggiore precisione nelle previsioni (forecasting accuracy).

## Analisi di fattibilità
**Bassa nel breve, condizionata a un intervento preliminare di data quality.** È il profilo più complesso: due barriere strutturali che si rinforzano a vicenda — dati frammentati rendono l'integrazione ERP più difficile, e un'integrazione difficile perpetua la frammentazione. Qualunque modulo AFC (forecasting, reporting) costruito su dati di bassa qualità produrrebbe risultati inaffidabili, vanificando l'obiettivo stesso.

## Soluzione proposta — AIchain Finance Engine
1. **Sequenziare l'intervento in due fasi esplicite** (da comunicare chiaramente in demo, per gestire le aspettative):
   - **Fase 1 — Data foundation**: usare ZenTratto (RAG + vector DB) per consolidare, indicizzare e "ripulire" semanticamente i documenti/dati AFC frammentati, creando una base dati affidabile e ricercabile, indipendente dall'ERP.
   - **Fase 2 — Moduli AFC (forecasting, fast closing)**: costruiti SOPRA la base dati consolidata della Fase 1, con integrazione ERP graduale via connettore (Enterprise Agent), non big-bang.
2. **Non promettere risultati di forecasting/reporting accurati prima della Fase 1** — sarebbe il principale rischio di delusione e di perdita di fiducia con un cliente enterprise healthcare.
3. **Compliance healthcare**: evidenziare lo stack on-premise/private EU cloud e l'audit trail (sinergia con SignSiSure) come elemento differenziante per un settore ad alta sensibilità sui dati dei pazienti.
4. **Demo consigliata**: presentare la Fase 1 (data consolidation) come progetto a sé stante, vendibile e misurabile in tempi brevi (6 mesi), che apre la strada — solo dopo — ai moduli AFC più ambiziosi.

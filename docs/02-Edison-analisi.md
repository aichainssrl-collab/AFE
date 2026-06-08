# Edison — Analisi di Fattibilità (V-Lab Smart Finance)

## Storia / contesto cliente
Edison è il principale player energetico in Italia ed Europa: produzione di energia rinnovabile e low-carbon, gas naturale, mobilità sostenibile e servizi energetici/ambientali. Grande impresa, processi AFC complessi e maturi.

## Problema
- Processi AFC da implementare: gestione documentale, contabilità & fatturazione.
- **Barriera principale:** difficoltà di integrazione con l'ERP attuale — tipico di una grande impresa con sistemi legacy stratificati.
- Orizzonte: lungo termine (oltre 12 mesi).
- Obiettivi: ridurre i costi operativi del team AFC, identificazione proattiva di anomalie o frodi.

## Analisi di fattibilità
**Media-bassa nel breve, alta nel lungo periodo se ben gestita l'integrazione.** Il problema non è l'adozione (Edison ha competenze interne) ma l'interoperabilità tecnica con l'ERP esistente. Il ciclo di vendita sarà lungo (>12 mesi, tipico enterprise) e richiederà una fase di assessment tecnico prima di qualunque commitment.

## Soluzione proposta — AIchain Finance Engine
1. **Approccio "API-first / connettore"**: proporre un layer di integrazione (Enterprise Agent) che si affianca all'ERP esistente senza sostituirlo — riduce il rischio percepito e accorcia i tempi di adozione iniziale.
2. **Gestione documentale con RAG (ZenTratto)**: indicizzazione semantica dei documenti AFC esistenti, sganciata dall'ERP, come primo step a basso attrito che genera valore immediato mentre si pianifica l'integrazione profonda.
3. **Anomaly/fraud detection**: modulo dedicato di rilevazione anomalie sulle transazioni contabili — è l'obiettivo a maggior impatto comunicativo per un'azienda della dimensione di Edison (compliance + risk).
4. **Demo consigliata**: dimostrare l'integrazione "leggera" via connettore, NON una sostituzione dell'ERP — è la chiave per superare la barriera dichiarata e aprire un percorso di proof-of-concept prima dell'impegno di lungo periodo.

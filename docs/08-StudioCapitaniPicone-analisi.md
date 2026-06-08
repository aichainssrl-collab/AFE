# Studio Capitani Picone — Analisi di Fattibilità (V-Lab Smart Finance)

## Storia / contesto cliente
Studio Capitani Picone opera da quasi cinquant'anni offrendo ai propri clienti un supporto professionale in ogni ambito dell'operatività aziendale e societaria. L'effetto sinergico delle molteplici specializzazioni dei suoi Professionisti rappresenta un elevato valore aggiunto nell'attività consulenziale. È uno studio professionale storico, radicato sul territorio, con un portafoglio clienti ampio e diversificato e una forte reputazione costruita su relazioni di lungo periodo.

## Problema
- Processi AFC da implementare:
  - **Controllo di gestione e reporting**
  - **Pianificazione e budgeting**
  - (Contabilità e fatturazione non rientrano nel perimetro di questo engagement — è un gap da chiarire in fase di assessment, vedi sotto.)
- **Barriera principale:** mancanza di competenze tecniche interne — il team è composto da professionisti con forte specializzazione consulenziale, ma senza figure dedicate all'AI o all'innovation.
- Orizzonte temporale: medio termine (6-12 mesi).
- Obiettivi con AI:
  1. Riduzione dei tempi di chiusura mensile (Fast Closing).
  2. Maggiore precisione nelle previsioni (Forecasting Accuracy).
  3. Identificazione proattiva di anomalie o frodi.
  4. Riduzione dei costi operativi del team AFC.

## Analisi di fattibilità
**Alta, con le stesse condizioni di AGFM ma con un perimetro più mirato.** Il profilo è quasi sovrapponibile ad AGFM (consulenza, barriera = skills gap, orizzonte 6-12 mesi, identici 4 obiettivi AI) — si differenzia per:
- **Perimetro AFC ridotto a 2 processi** (Controllo di gestione + Pianificazione) → POC più snello, time-to-value più rapido, ROI più facile da dimostrare.
- **Longevità dello studio (~50 anni)** → forte attenzione a continuity, affidabilità e "non rompere ciò che funziona": l'AI deve essere presentata come *co-pilot* del professionista, non come sostituto.
- **Diversificazione portafoglio clienti** → il forecasting accuracy ha un moltiplicatore di valore: migliorare la precisione per cliente si traduce in marginalità migliore su tutto il portafoglio.

Nessuna barriera strutturale nota (no ERP legacy menzionato, no problemi di qualità dati): il gap è di know-how, non di infrastruttura.

## Soluzione proposta — AIchain Finance Engine
1. **Modulo "Controllo di gestione & reporting" assistito da AI**: generazione automatica di report periodici con RAG sui dati contabili/gestionali dei clienti dello studio, riutilizzando lo stack ZenTratto. Ogni report cita la fonte → fondamentale per la fiducia del professionista.
2. **Pianificazione & budgeting predittivo**: forecasting ML multi-tenant (un modello per cliente dello studio oppure modello anonimizzato cross-portafoglio, da validare in fase tecnica) per supportare la definizione dei budget e il rolling forecast.
3. **Anomaly detection sul flusso AFC**: individuazione proattiva di scostamenti anomali o pattern sospetti nei dati gestionali dei clienti, alert al professionista referente. Risponde direttamente all'obiettivo "identificazione proattiva di anomalie o frodi".
4. **Posizionamento "senza competenze tecniche richieste"** (identico ad AGFM): la barriera principale (skills gap) diventa l'argomento di vendita. Piattaforma gestita/managed, onboarding guidato, affiancamento iniziale del team AFC, niente sviluppo interno.
5. **Demo consigliata**: focus su **Fast Closing** (KPI più tangibile e misurabile in 6-12 mesi) + **Forecasting Accuracy** su un singolo cliente-pilota dello studio → proof-of-value rapido che il professionista può replicare sugli altri clienti.

## Note di scoping (da chiarire in fase di assessment)
- La **contabilità e fatturazione** non è nei processi dichiarati: confermare se lo studio vuole gestirli internamente (e quindi non rientrano nel perimetro AI) o se è un'omissione. Se entrano, il perimetro si allarga e diventa simile ad AGFM.
- **Modello dati multi-tenant**: serve una convenzione chiara su separazione dei dati tra clienti dello studio (compliance, riservatezza, GDPR).
- **Onboarding dei 50 anni di storico**: capire se e quanto storico è digitalizzato, perché la qualità del forecasting dipende dalla profondità delle serie temporali disponibili.

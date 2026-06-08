// Test: il documento di analisi per Studio Capitani Picone deve esistere e
// contenere la stessa struttura delle altre analisi in /docs (storia,
// problema, fattibilità, soluzione proposta).

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docPath = resolve(
  __dirname,
  "../docs/08-StudioCapitaniPicone-analisi.md",
);

test("Esiste il file di analisi per Studio Capitani Picone", () => {
  assert.ok(existsSync(docPath), `File non trovato: ${docPath}`);
});

const md = readFileSync(docPath, "utf8");

test("Titolo H1 in testa al documento", () => {
  assert.match(md, /^#\s+Studio Capitani Picone\s+—\s+Analisi di Fattibilità/m);
});

test("Sezione 'Storia / contesto cliente' presente", () => {
  assert.match(md, /^##\s+Storia\s*\/\s*contesto cliente\s*$/m);
  assert.match(md, /quasi cinquant['’]anni/i);
  assert.match(md, /valore aggiunto/i);
});

test("Sezione 'Problema' con processi AFC, barriera, orizzonte e obiettivi", () => {
  assert.match(md, /^##\s+Problema\s*$/m);
  assert.match(md, /Controllo di gestione e reporting/);
  assert.match(md, /Pianificazione e budgeting/);
  assert.match(md, /\*\*Barriera principale:\*\*\s+mancanza di competenze tecniche interne/i);
  assert.match(md, /[Mm]edio termine\s*\(6-12 mesi\)/);
  assert.match(md, /Fast Closing/);
  assert.match(md, /Forecasting Accuracy/);
  assert.match(md, /anomalie o frodi/i);
  assert.match(md, /costi operativi del team AFC/i);
});

test("Sezione 'Analisi di fattibilità' presente e con giudizio 'Alta'", () => {
  assert.match(md, /^##\s+Analisi di fattibilità\s*$/m);
  assert.match(md, /\*\*Alta\b/);
});

test("Sezione 'Soluzione proposta' con moduli AIchain coerenti", () => {
  assert.match(md, /^##\s+Soluzione proposta\s+—\s+AIchain Finance Engine\s*$/m);
  assert.match(md, /RAG/);
  assert.match(md, /forecasting ML|modello ML/i);
  assert.match(md, /Anomaly detection/i);
  assert.match(md, /co-pilot/i);
});

test("Confronto con AGFM esplicitamente nel documento", () => {
  assert.match(md, /AGFM/);
  assert.match(md, /(sovrapponibile|simile|identic)/i);
});

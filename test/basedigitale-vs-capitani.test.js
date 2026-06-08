// Test: le richieste di "Studio Capitani Picone" (vedi
// docs/08-StudioCapitaniPicone-analisi.md) NON corrispondono al profilo
// Base Digitale nel POC. Questo test fissa i vincoli minimi di disambiguazione
// per evitare di riutilizzare la scheda Base Digitale per Capitani Picone.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../finance-engine-poc/lib/data.ts");
const capitaniDoc = resolve(
  __dirname,
  "../docs/08-StudioCapitaniPicone-analisi.md",
);
const baseDigitaleDoc = resolve(__dirname, "../docs/04-BaseDigitale-analisi.md");

const src = readFileSync(dataPath, "utf8");
const capitani = readFileSync(capitaniDoc, "utf8");
const base = existsSync(baseDigitaleDoc)
  ? readFileSync(baseDigitaleDoc, "utf8")
  : "";

/* Estrae il blocco del client Base Digitale da lib/data.ts (parsing robusto) */
const baseBlockMatch = src.match(/id:\s*"basedigitale"/);
assert.ok(baseBlockMatch, "Blocco 'basedigitale' non trovato in lib/data.ts");
const bStart = src.lastIndexOf("{", baseBlockMatch.index);
assert.ok(bStart >= 0, "Apertura graffa di Base Digitale non trovata");
let bDepth = 0;
let bEnd = -1;
for (let i = bStart; i < src.length; i++) {
  const ch = src[i];
  if (ch === "{") bDepth++;
  else if (ch === "}") {
    bDepth--;
    if (bDepth === 0) { bEnd = i + 1; break; }
  }
}
assert.ok(bEnd > 0, "Chiusura di Base Digitale non trovata");
const baseBlock = src.slice(bStart, bEnd);

test("Base Digitale (POC) ha un perimetro AFC più ampio di Capitani Picone", () => {
  // Base Digitale include Contabilità & Fatturazione e Gestione documentale
  // mentre Capitani Picone dichiara solo 2 processi (Controllo + Pianificazione).
  assert.match(baseBlock, /Contabilità & Fatturazione/);
  assert.match(baseBlock, /Gestione documentale/);

  const procCount = (baseBlock.match(/processNames:\s*\[([^\]]+)\]/)?.[1] || "")
    .split(",")
    .filter((s) => s.trim().length > 0).length;
  assert.ok(procCount >= 4, `Base Digitale dovrebbe avere ≥4 processi, trovati ${procCount}`);
});

test("Base Digitale (POC) ha barriera opposta a Capitani Picone", () => {
  // Capitani Picone: "mancanza di competenze tecniche interne"
  // Base Digitale: "valore predittivo da dimostrare" / ROI incerto
  assert.match(capitani, /mancanza di competenze tecniche interne/i);
  assert.match(baseBlock, /Valore predittivo da dimostrare/);
  assert.match(baseBlock, /accuratezza predittiva e ritorno economico/i);
});

test("Base Digitale (POC) è posizionato come cliente ICT/canale, non studio di consulenza", () => {
  assert.match(baseBlock, /sector:\s*"ICT & Trasformazione Digitale"/);
  assert.match(capitani, /Studio Capitani Picone/);
  assert.match(capitani, /[Cc]onsulenz|[Pp]rofessionist/i);
});

test("Base Digitale (POC) NON cita 'anomalie o frodi' come obiettivo di onboarding", () => {
  // Capitani Picone ha 4 obiettivi, Base Digitale ne ha 3 e non menziona frodi.
  const objectivesMatch = baseBlock.match(/objectives:\s*\[([^\]]+)\]/);
  assert.ok(objectivesMatch, "objectives di Base Digitale non trovato");
  const objectives = objectivesMatch[1];
  assert.doesNotMatch(
    objectives,
    /anomalie|fraud|frodi/i,
    "Base Digitale non dovrebbe avere frodi/anomalie tra gli obiettivi",
  );
  assert.match(capitani, /anomalie o frodi/i);
});

test("AGFM (POC) è il profilo più vicino a Capitani Picone (stessa barriera + settore)", () => {
  // Sanity check: AGFM e Capitani Picone condividono barriera e settore.
  const agfmBlockMatch = src.match(/id:\s*"agfm"/);
  assert.ok(agfmBlockMatch, "Blocco 'agfm' non trovato in lib/data.ts");
  const aStart = src.lastIndexOf("{", agfmBlockMatch.index);
  assert.ok(aStart >= 0);
  let aDepth = 0;
  let aEnd = -1;
  for (let i = aStart; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") aDepth++;
    else if (ch === "}") {
      aDepth--;
      if (aDepth === 0) { aEnd = i + 1; break; }
    }
  }
  const agfmBlock = src.slice(aStart, aEnd);
  assert.match(agfmBlock, /Zero competenze tecniche interne/);
  assert.match(agfmBlock, /Consulenza/);
});

test("Doc 04-BaseDigitale-analisi.md conferma la non-corrispondenza", () => {
  if (!base) return; // doc opzionale in CI
  // La nota chiave: Base Digitale è "player tecnico" e "partner/canale", non cliente finale puro.
  assert.match(base, /player tecnico|integratore|canale/i);
});

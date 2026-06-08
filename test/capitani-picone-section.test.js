// Test: verifica che la sezione demo personalizzata per "Studio Capitani
// Picone" sia presente nel POC e coerente con le richieste di onboarding
// (vedi docs/08-StudioCapitaniPicone-analisi.md).

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../finance-engine-poc/lib/data.ts");
const docPath = resolve(
  __dirname,
  "../docs/08-StudioCapitaniPicone-analisi.md",
);
const clientNav = resolve(
  __dirname,
  "../finance-engine-poc/components/client-nav.tsx",
);
const appIndex = resolve(__dirname, "../finance-engine-poc/app/page.tsx");

const src = readFileSync(dataPath, "utf8");

const blockMatch = src.match(/id:\s*"capitani-picone"/);
assert.ok(blockMatch, "Blocco 'capitani-picone' non trovato in lib/data.ts");

// Parsing del blocco bilanciando le graffe
const startIdx = src.lastIndexOf("{", blockMatch.index);
assert.ok(startIdx >= 0, "Apertura graffa del blocco non trovata");
let depth = 0;
let endIdx = -1;
for (let i = startIdx; i < src.length; i++) {
  const ch = src[i];
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) { endIdx = i + 1; break; }
  }
}
assert.ok(endIdx > 0, "Chiusura del blocco non trovata");
const block = src.slice(startIdx, endIdx);

test("Demo Capitani Picone: id e nome corretti", () => {
  assert.match(block, /id:\s*"capitani-picone"/);
  assert.match(block, /name:\s*"Studio Capitani Picone"/);
});

test("Demo Capitani Picone: settore consulenziale con eyebrow '50 anni'", () => {
  assert.match(block, /sector:\s*"Consulenza & Advisory professionale"/);
  assert.match(block, /eyebrow:\s*"Studio professionale · ~50 anni"/);
});

test("Demo Capitani Picone: barriera = competenze tecniche mancanti", () => {
  assert.match(block, /barrierTag:\s*"Mancanza competenze tecniche interne"/);
  assert.match(block, /barriere|barrier/i);
  assert.match(block, /senza figure dedicate all'AI/);
});

test("Demo Capitani Picone: 4 obiettivi coerenti con la richiesta", () => {
  const objsMatch = block.match(/objectives:\s*\[([^\]]+)\]/);
  assert.ok(objsMatch, "objectives non trovato");
  const objs = objsMatch[1];
  assert.match(objs, /Fast Closing/);
  assert.match(objs, /Forecasting Accuracy/);
  assert.match(objs, /Anomaly Detection/);
  assert.match(objs, /Riduzione costi AFC/);
});

test("Demo Capitani Picone: perimetro AFC ristretto a 2 processi", () => {
  const procMatch = block.match(/processNames:\s*\[([^\]]+)\]/);
  assert.ok(procMatch, "processNames non trovato");
  const proc = procMatch[1];
  assert.match(proc, /Controllo di gestione e reporting/);
  assert.match(proc, /Pianificazione & Budgeting/);
  // Non deve contenere Contabilità & Fatturazione
  assert.doesNotMatch(
    proc,
    /Contabilità & Fatturazione|Gestione documentale/,
    "processNames deve essere ristretto a 2 processi",
  );
});

test("Demo Capitani Picone: overviewKpis (3) coerenti", () => {
  // Estrai la sezione overviewKpis: bilanciando le quadre
  const start = block.indexOf("overviewKpis:");
  assert.ok(start >= 0, "overviewKpis non trovato");
  const i0 = block.indexOf("[", start);
  let depth = 0;
  let i1 = -1;
  for (let i = i0; i < block.length; i++) {
    if (block[i] === "[") depth++;
    else if (block[i] === "]") {
      depth--;
      if (depth === 0) { i1 = i; break; }
    }
  }
  assert.ok(i1 > 0, "fine overviewKpis non trovata");
  const kpis = block.slice(i0 + 1, i1);
  const objs = (kpis.match(/\{/g) || []).length;
  assert.equal(objs, 3, `overviewKpis dovrebbe avere 3 elementi, trovati ${objs}`);
  assert.match(kpis, /Fast Closing/);
  assert.match(kpis, /Forecasting Accuracy/);
  assert.match(kpis, /Anomalie/);
});

test("Demo Capitani Picone: 2 dashboard (Controllo + Pianificazione)", () => {
  const start = block.indexOf("dashboards:");
  assert.ok(start >= 0, "dashboards non trovato");
  const i0 = block.indexOf("[", start);
  let depth = 0;
  let i1 = -1;
  for (let i = i0; i < block.length; i++) {
    if (block[i] === "[") depth++;
    else if (block[i] === "]") {
      depth--;
      if (depth === 0) { i1 = i; break; }
    }
  }
  assert.ok(i1 > 0, "fine dashboards non trovata");
  const dbs = block.slice(i0 + 1, i1);
  const ids = (dbs.match(/id:\s*"([^"]+)"/g) || []).map((s) =>
    s.match(/"([^"]+)"/)?.[1],
  );
  assert.deepEqual(
    ids,
    ["controlling", "predictive-budgeting"],
    `Dashboard ids inattesi: ${JSON.stringify(ids)}`,
  );
});

test("Demo Capitani Picone: ogni dashboard ha almeno 1 KPI con spark (parità con AGFM)", () => {
  // Parsing delle singole dashboard dentro il blocco
  const start = block.indexOf("dashboards:");
  const i0 = block.indexOf("[", start);
  let depth = 0;
  let i1 = -1;
  for (let i = i0; i < block.length; i++) {
    if (block[i] === "[") depth++;
    else if (block[i] === "]") {
      depth--;
      if (depth === 0) { i1 = i; break; }
    }
  }
  const dbs = block.slice(i0 + 1, i1);

  // Estrai ogni dashboard bilancando le graffe
  const dashboardRanges = [];
  let dStart = -1;
  let dDepth = 0;
  for (let i = 0; i < dbs.length; i++) {
    const ch = dbs[i];
    if (ch === "{") {
      if (dDepth === 0) dStart = i;
      dDepth++;
    } else if (ch === "}") {
      dDepth--;
      if (dDepth === 0) dashboardRanges.push([dStart, i + 1]);
    }
  }
  assert.ok(dashboardRanges.length === 2, `Attese 2 dashboard, trovate ${dashboardRanges.length}`);

  // AGFM: tutte le 4 dashboard hanno almeno 1 spark — stesso pattern richiesto qui.
  // Sanity check anche su AGFM
  const agfmMatch = src.match(/id:\s*"agfm"/);
  assert.ok(agfmMatch);
  const aStart = src.lastIndexOf("{", agfmMatch.index);
  let aDepth = 0;
  let aEnd = -1;
  for (let i = aStart; i < src.length; i++) {
    if (src[i] === "{") aDepth++;
    else if (src[i] === "}") {
      aDepth--;
      if (aDepth === 0) { aEnd = i + 1; break; }
    }
  }
  const agfmBlock = src.slice(aStart, aEnd);
  const agfmSparks = (agfmBlock.match(/spark:/g) || []).length;
  assert.ok(agfmSparks >= 4, `AGFM dovrebbe avere ≥4 spark, trovati ${agfmSparks}`);

  // Capitani Picone: tutte le 2 dashboard devono avere ≥1 spark
  for (const [s, e] of dashboardRanges) {
    const dash = dbs.slice(s, e);
    const id = dash.match(/id:\s*"([^"]+)"/)?.[1];
    const sparks = (dash.match(/spark:/g) || []).length;
    assert.ok(
      sparks >= 1,
      `Dashboard '${id}' deve avere ≥1 spark, trovati ${sparks}`,
    );
  }
});

test("Demo Capitani Picone: registrato in CLIENT_FLAGSHIP", () => {
  assert.match(
    src,
    /CLIENT_FLAGSHIP[\s\S]*?"capitani-picone":\s*"predictive-budgeting"/,
  );
});

test("Demo Capitani Picone: CLIENT_ANALYTICS replica AGFM (trend+breakdown+beforeAfter)", () => {
  // Trova l'inizio di CLIENT_ANALYTICS
  const analyticsStart = src.indexOf("export const CLIENT_ANALYTICS");
  assert.ok(analyticsStart > 0, "CLIENT_ANALYTICS non trovato");
  // Da qui in poi cerchiamo le chiavi "agfm:" e "capitani-picone:"
  const analyticsSrc = src.slice(analyticsStart);

  // Estrai il blocco "chiave: { ... }" a partire dalla chiave.
  // Le chiavi in CLIENT_ANALYTICS possono essere identifier semplici (es. agfm:)
  // oppure quoted (es. "capitani-picone":). Cerchiamo entrambi.
  function extractEntry(srcAfter, key) {
    const candidates = [`${key}:`, `"${key}":`];
    let idx = -1;
    for (const c of candidates) {
      idx = srcAfter.indexOf(c);
      if (idx >= 0) break;
    }
    assert.ok(idx >= 0, `Chiave ${key} non trovata in CLIENT_ANALYTICS`);
    const braceOpen = srcAfter.indexOf("{", idx);
    let depth = 0;
    let end = -1;
    for (let i = braceOpen; i < srcAfter.length; i++) {
      if (srcAfter[i] === "{") depth++;
      else if (srcAfter[i] === "}") {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    return srcAfter.slice(braceOpen, end);
  }

  const cpBlock = extractEntry(analyticsSrc, "capitani-picone");
  const agfmBlock = extractEntry(analyticsSrc, "agfm");

  // 1. trend presente (12 punti)
  const trendMatch = cpBlock.match(/trend:\s*series\(\[([^\]]+)\]\)/);
  assert.ok(trendMatch, "trend non trovato in CLIENT_ANALYTICS");
  const trendValues = trendMatch[1].split(",").map((s) => Number(s.trim()));
  assert.equal(trendValues.length, 12, "trend deve avere 12 punti");

  // 2. beforeAfter con 3 entry
  const baMatch = cpBlock.match(/beforeAfter:\s*\[([\s\S]*?)\n\s*\],/);
  assert.ok(baMatch, "beforeAfter non trovato");
  const baCount = (baMatch[1].match(/\{/g) || []).length;
  assert.equal(baCount, 3, `beforeAfter deve avere 3 entry, trovate ${baCount}`);

  // 3. breakdown con 4 slice
  const bdMatch = cpBlock.match(/breakdown:\s*\[([\s\S]*?)\n\s*\],/);
  assert.ok(bdMatch, "breakdown non trovato");
  const bdCount = (bdMatch[1].match(/\{/g) || []).length;
  assert.equal(bdCount, 4, `breakdown deve avere 4 slice, trovate ${bdCount}`);

  // 4. Parità con AGFM: stesse series, stessi beforeAfter, stesso breakdown
  // trend identico
  const agfmTrend = agfmBlock.match(/trend:\s*series\(\[([^\]]+)\]\)/)?.[1];
  assert.ok(agfmTrend);
  assert.equal(
    trendMatch[1].replace(/\s/g, ""),
    agfmTrend.replace(/\s/g, ""),
    "trend di Capitani Picone deve essere identico ad AGFM",
  );
  // breakdown identico
  const agfmBd = agfmBlock.match(/breakdown:\s*\[([\s\S]*?)\n\s*\],/)?.[1];
  assert.ok(agfmBd);
  assert.equal(
    bdMatch[1].replace(/\s/g, ""),
    agfmBd.replace(/\s/g, ""),
    "breakdown di Capitani Picone deve essere identico ad AGFM",
  );
  // beforeAfter identico
  const agfmBa = agfmBlock.match(/beforeAfter:\s*\[([\s\S]*?)\n\s*\],/)?.[1];
  assert.ok(agfmBa);
  assert.equal(
    baMatch[1].replace(/\s/g, ""),
    agfmBa.replace(/\s/g, ""),
    "beforeAfter di Capitani Picone deve essere identico ad AGFM",
  );
});

test("Demo Capitani Picone: logo referenziato e file presente in public/", () => {
  assert.match(
    block,
    /logo:\s*"\/studio_capitani_picone_logo\.jpeg"/,
    "Proprietà logo non trovata o path errato",
  );
  const logoPath = resolve(
    __dirname,
    "../finance-engine-poc/public/studio_capitani_picone_logo.jpeg",
  );
  assert.ok(
    existsSync(logoPath),
    `File logo non trovato: ${logoPath}`,
  );
});

test("Doc 08-StudioCapitaniPicone-analisi.md presente e coerente", () => {
  assert.ok(existsSync(docPath));
  const doc = readFileSync(docPath, "utf8");
  assert.match(doc, /Studio Capitani Picone/);
});

test("(opzionale) Capitani Picone compare nel selettore clienti", () => {
  // Solo se i file esistono: il selettore principale è /app/page.tsx o
  // components/client-nav.tsx. Verifichiamo almeno uno dei due.
  const sources = [appIndex, clientNav].filter(existsSync);
  if (sources.length === 0) return; // struttura diversa, non bloccare
  const all = sources.map((p) => readFileSync(p, "utf8")).join("\n");
  // Non pretendiamo match esatto: il selettore potrebbe elencare i clienti
  // dinamicamente da CLIENTS. Verifichiamo solo che non ci sia un filtro
  // hard-coded che escluda 'capitani-picone'.
  assert.doesNotMatch(
    all,
    /excludeClients\s*=\s*\[[^\]]*capitani-picone/,
  );
});

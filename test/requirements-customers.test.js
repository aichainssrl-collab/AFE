// Test: il file /finance-engine-poc/data/requirements_customers.json raccoglie
// i requisiti di tutti i clienti come backup "server-side". L'index
// (app/page.tsx) deve mostrare la card "Dati raccolti — Requisiti cliente".

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(
  __dirname,
  "../finance-engine-poc/data/requirements_customers.json",
);
const pagePath = resolve(__dirname, "../finance-engine-poc/app/page.tsx");
const cardPath = resolve(
  __dirname,
  "../finance-engine-poc/components/collected-requirements-card.tsx",
);

test("File requirements_customers.json esiste", () => {
  assert.ok(existsSync(jsonPath), `File non trovato: ${jsonPath}`);
});

const raw = readFileSync(jsonPath, "utf8");
let doc;
test("File requirements_customers.json è JSON valido", () => {
  doc = JSON.parse(raw);
  assert.ok(doc, "JSON non parsabile");
});

test("Documento: metadata (version, title, exportedAt, schemaRef, totals)", () => {
  assert.equal(doc.version, "1.0");
  assert.match(doc.title, /Requisiti raccolti/);
  assert.ok(doc.exportedAt, "exportedAt mancante");
  assert.equal(doc.schemaRef, "lib/spec-questions.json");
  assert.ok(doc.totals, "totals mancante");
  assert.equal(doc.totals.clients, doc.clients.length);
  assert.equal(doc.totals.withCollectedSpecs, doc.clients.length);
});

test("Documento: 6 sezioni form (anagrafica, sistemi, processi, dati, compliance, progetto)", () => {
  const expected = [
    "anagrafica",
    "sistemi",
    "processi",
    "dati",
    "compliance",
    "progetto",
  ];
  for (const s of expected) {
    assert.ok(
      doc.sections.includes(s),
      `Sezione '${s}' mancante in sections[]`,
    );
  }
  assert.equal(doc.sections.length, 6);
});

test("Documento: 6 clienti con id univoci", () => {
  assert.equal(doc.clients.length, 6);
  const ids = doc.clients.map((c) => c.id);
  assert.equal(new Set(ids).size, 6, `IDs duplicati: ${ids.join(",")}`);
  for (const id of ["agfm", "edison", "systra", "basedigitale", "medicair", "capitani-picone"]) {
    assert.ok(ids.includes(id), `Cliente '${id}' mancante`);
  }
});

test("Ogni cliente: anagrafica, sistemi, processi, dati, compliance, progetto, custom", () => {
  for (const c of doc.clients) {
    for (const k of [
      "id",
      "name",
      "sector",
      "horizonMonths",
      "anagrafica",
      "sistemi",
      "processi",
      "dati",
      "compliance",
      "progetto",
      "custom",
    ]) {
      assert.ok(c[k] !== undefined, `Cliente '${c.id ?? "?"}' manca il campo '${k}'`);
    }
  }
});

test("Ogni cliente: anagrafica contiene campi chiave", () => {
  for (const c of doc.clients) {
    assert.ok(c.anagrafica.ragione_sociale, `${c.id}: ragione_sociale vuota`);
    assert.ok(c.anagrafica.settore, `${c.id}: settore vuoto`);
    assert.ok(typeof c.anagrafica.dipendenti_afc === "number", `${c.id}: dipendenti_afc non numerico`);
  }
});

test("Ogni cliente: processi ha almeno 1 processi_target, barriera, volumi", () => {
  for (const c of doc.clients) {
    assert.ok(
      Array.isArray(c.processi.processi_target) && c.processi.processi_target.length >= 1,
      `${c.id}: processi_target vuoto`,
    );
    assert.ok(c.processi.barriera, `${c.id}: barriera vuota`);
    assert.equal(typeof c.processi.fatture_mese, "number");
    assert.equal(typeof c.processi.documenti_mese, "number");
    assert.equal(typeof c.processi.tempo_chiusura, "number");
  }
});

test("Ogni cliente: compliance ha deployment + almeno 1 normativa", () => {
  for (const c of doc.clients) {
    assert.ok(c.compliance.deployment, `${c.id}: deployment vuoto`);
    assert.ok(
      Array.isArray(c.compliance.normative) && c.compliance.normative.length >= 1,
      `${c.id}: normative vuote`,
    );
  }
});

test("Ogni cliente: custom ha almeno 1 risposta (sezione specifica)", () => {
  for (const c of doc.clients) {
    assert.ok(
      c.custom && Object.keys(c.custom).length >= 1,
      `${c.id}: custom vuoto (attesa sezione dedicata)`,
    );
  }
});

test("Id dei clienti nel JSON corrispondono a CLIENTS in lib/data.ts", () => {
  const dataTs = readFileSync(
    resolve(__dirname, "../finance-engine-poc/lib/data.ts"),
    "utf8",
  );
  for (const c of doc.clients) {
    assert.match(
      dataTs,
      new RegExp(`id:\\s*"${c.id.replace(/-/g, "-")}"`),
      `Cliente '${c.id}' presente in requirements_customers.json ma non in lib/data.ts`,
    );
  }
});

test("Componente CollectedRequirementsCard esiste", () => {
  assert.ok(existsSync(cardPath), `Componente non trovato: ${cardPath}`);
  const card = readFileSync(cardPath, "utf8");
  assert.match(card, /export function CollectedRequirementsCard/);
  assert.match(card, /Dati raccolti/);
});

test("Index (app/page.tsx) importa e usa CollectedRequirementsCard", () => {
  assert.ok(existsSync(pagePath));
  const page = readFileSync(pagePath, "utf8");
  assert.match(
    page,
    /import\s*\{[^}]*CollectedRequirementsCard[^}]*\}\s*from\s*["']@\/components\/collected-requirements-card["']/,
    "Index non importa CollectedRequirementsCard",
  );
  assert.match(
    page,
    /<CollectedRequirementsCard\s*\/>/,
    "Index non renderizza CollectedRequirementsCard",
  );
});

test("Card usa 'requirements_customers.json' come sorgente dati", () => {
  const card = readFileSync(cardPath, "utf8");
  assert.match(
    card,
    /from\s+["']@\/data\/requirements_customers\.json["']/,
    "Card non importa requirements_customers.json",
  );
});

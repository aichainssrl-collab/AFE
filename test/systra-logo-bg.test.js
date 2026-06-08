// Test: il client Systra deve avere lo sfondo del logo impostato su "white"
// in modo che lo span che contiene /systra-logo.svg abbia background bianco.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataTsPath = resolve(
  __dirname,
  "../finance-engine-poc/lib/data.ts",
);

const source = readFileSync(dataTsPath, "utf8");

// Estrae il blocco del client Systra (parsing robusto)
const systraBlockMatch = source.match(/id:\s*"systra"/);
assert.ok(
  systraBlockMatch,
  "Blocco del client 'systra' non trovato in lib/data.ts",
);
const sStart = source.lastIndexOf("{", systraBlockMatch.index);
assert.ok(sStart >= 0, "Apertura graffa di Systra non trovata");
let sDepth = 0;
let sEnd = -1;
for (let i = sStart; i < source.length; i++) {
  const ch = source[i];
  if (ch === "{") sDepth++;
  else if (ch === "}") {
    sDepth--;
    if (sDepth === 0) { sEnd = i + 1; break; }
  }
}
const systraBlock = source.slice(sStart, sEnd);

// Estrae il valore di logoBg
const logoBgMatch = systraBlock.match(/logoBg:\s*"([^"]+)"/);
assert.ok(
  logoBgMatch,
  "Proprietà 'logoBg' non trovata nel blocco del client Systra",
);
const logoBg = logoBgMatch[1];

test("Systra: logoBg deve essere 'white' (sfondo bianco del logo)", () => {
  assert.equal(logoBg, "white");
});

test("Systra: deve avere un logo associato", () => {
  const logoMatch = systraBlock.match(/logo:\s*"([^"]+)"/);
  assert.ok(logoMatch, "Proprietà 'logo' non trovata per Systra");
  assert.equal(logoMatch[1], "/systra-logo.svg");
});

// Verifica anche che i componenti che rendono il logo applichino
// il colore bianco quando logoBg === "white"
const sidebarNav = readFileSync(
  resolve(__dirname, "../finance-engine-poc/components/sidebar-nav.tsx"),
  "utf8",
);
const overviewHero = readFileSync(
  resolve(__dirname, "../finance-engine-poc/components/overview-hero-card.tsx"),
  "utf8",
);

test("Sidebar: applica background bianco al logo quando logoBg === 'white'", () => {
  assert.match(
    sidebarNav,
    /backgroundColor:\s*client\.logoBg\s*===\s*"white"\s*\?\s*"#ffffff"\s*:\s*client\.accent/,
    "sidebar-nav.tsx non applica #ffffff quando logoBg è 'white'",
  );
  assert.match(
    sidebarNav,
    /borderColor:\s*client\.logoBg\s*===\s*"white"\s*\?\s*"var\(--border\)"\s*:\s*client\.accent/,
    "sidebar-nav.tsx non applica var(--border) al bordo quando logoBg è 'white'",
  );
});

test("OverviewHeroCard: applica background bianco al logo quando logoBg === 'white'", () => {
  assert.match(
    overviewHero,
    /backgroundColor:\s*client\.logoBg\s*===\s*"white"\s*\?\s*"#ffffff"\s*:\s*client\.accent/,
    "overview-hero-card.tsx non applica #ffffff quando logoBg è 'white'",
  );
  assert.match(
    overviewHero,
    /borderColor:\s*client\.logoBg\s*===\s*"white"\s*\?\s*"var\(--border\)"\s*:\s*client\.accent/,
    "overview-hero-card.tsx non applica var(--border) al bordo quando logoBg è 'white'",
  );
});

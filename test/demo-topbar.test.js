// Test: la stessa header (topbar) presente nella POC Next.js deve essere
// applicata anche al file demo "AIchain Finance Engine.html".
//
// In concreto ci aspettiamo:
//  1. Il CSS del topbar (.topbar, .tb-left, .tb-right, .tb-logo, .tb-divider,
//     .tb-titles, .tb-title, .tb-sub, .tb-demo, .tb-expert, .cdrop) presente
//     nel file demo.
//  2. Il sorgente demo/src/app.jsx monti la <header className="topbar"> con
//     logo Aichain, divider, "Finance Engine" + "AFC Intelligence Platform",
//     pill "Demo Mode", bottone "Esperto AIchain" e ClientDropdown.
//  3. Lo stylesheet sia coerente con la POC di riferimento (gradient navy
//     #050636 → #161045).

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const demoHtmlPath = resolve(
  __dirname,
  "../demo/AIchain Finance Engine.html",
);
const demoAppJsx = resolve(__dirname, "../demo/src/app.jsx");
const pocTopbar = resolve(
  __dirname,
  "../finance-engine-poc/components/topbar.tsx",
);

const html = readFileSync(demoHtmlPath, "utf8");
const appJsx = readFileSync(demoAppJsx, "utf8");

/* --- 1. CSS presente nel file demo --- */
test("Demo HTML: contiene la regola .topbar con altezza 64px", () => {
  assert.match(html, /\.topbar\s*\{[^}]*height:\s*64px/);
});

test("Demo HTML: contiene le sotto-sezioni tb-left, tb-right, tb-titles", () => {
  assert.match(html, /\.tb-left\s*\{/);
  assert.match(html, /\.tb-right\s*\{/);
  assert.match(html, /\.tb-titles\s*\{/);
  assert.match(html, /\.tb-title\s*\{/);
  assert.match(html, /\.tb-sub\s*\{/);
  assert.match(html, /\.tb-logo\s*\{/);
  assert.match(html, /\.tb-divider\s*\{/);
});

test("Demo HTML: pill Demo Mode + bottone Esperto AIchain", () => {
  assert.match(html, /\.tb-demo\s*\{/);
  assert.match(html, /\.tb-demo-dot\s*\{/);
  assert.match(html, /\.tb-expert\s*\{/);
  assert.match(html, /\.tb-expert:hover\s*\{/);
});

test("Demo HTML: dropdown del partner (.cdrop)", () => {
  assert.match(html, /\.cdrop\s*\{/);
  assert.match(html, /\.cdrop-btn\s*\{/);
  assert.match(html, /\.cdrop-dot\s*\{/);
  assert.match(html, /\.cdrop-menu\s*\{/);
  assert.match(html, /\.cdrop-item\s*\{/);
});

test("Demo HTML: gradient navy coerente con la POC", () => {
  assert.match(
    html,
    /\.topbar\s*\{[^}]*background:\s*linear-gradient\([^)]*#050636[\s\S]*?#161045/,
    "Gradient navy non trovato in .topbar",
  );
});

/* --- 2. Markup della topbar nel sorgente demo/src/app.jsx --- */
test("App.jsx demo: monta <header className=\"topbar\">", () => {
  assert.match(appJsx, /<header\s+className="topbar">/);
});

test("App.jsx demo: include il logo Aichain in tb-left", () => {
  assert.match(appJsx, /<img\s+src="assets\/aichain-logo\.jpeg"/);
});

test("App.jsx demo: include divider, 'Finance Engine' e 'AFC Intelligence Platform'", () => {
  assert.match(appJsx, /className="tb-divider"/);
  assert.match(appJsx, /Finance Engine/);
  assert.match(appJsx, /AFC Intelligence Platform/);
});

test("App.jsx demo: include pill 'Demo Mode' e bottone 'Esperto AIchain'", () => {
  assert.match(appJsx, /Demo Mode/);
  assert.match(appJsx, /Esperto AIchain/);
  assert.match(appJsx, /<ClientDropdown\s+clientId=\{clientId\}\s+onPick=\{pickClient\}/);
});

test("Demo HTML: include <script ... src=\"src/app.jsx\">", () => {
  assert.match(html, /<script[^>]+src="src\/app\.jsx"/);
});

/* --- 3. Coerenza con la POC di riferimento --- */
test("POC topbar: contiene le stesse etichette della demo", () => {
  assert.ok(existsSync(pocTopbar), `File non trovato: ${pocTopbar}`);
  const topbarTsx = readFileSync(pocTopbar, "utf8");
  assert.match(topbarTsx, /Finance Engine/);
  assert.match(topbarTsx, /AFC Intelligence Platform/);
  assert.match(topbarTsx, /Demo Mode/);
  assert.match(topbarTsx, /Esperto AIchain/);
});

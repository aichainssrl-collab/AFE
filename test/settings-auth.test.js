// Test: sezione Settings con creazione utenze per cliente + tenant
// isolation. Verifica la struttura di:
//  - lib/auth.ts: types, validazione, canAccessClient, listAccessibleClientIds
//  - route /settings e /denied
//  - componente UserSwitcher e TenantGate
//  - integrazione con page.tsx (link Settings + filtro clienti)

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../finance-engine-poc");

const authPath = resolve(ROOT, "lib/auth.ts");
const authCtxPath = resolve(ROOT, "components/auth-context.tsx");
const settingsPagePath = resolve(ROOT, "app/settings/page.tsx");
const settingsPanelPath = resolve(ROOT, "components/settings-panel.tsx");
const deniedPagePath = resolve(ROOT, "app/denied/page.tsx");
const userSwitcherPath = resolve(ROOT, "components/user-switcher.tsx");
const tenantGatePath = resolve(ROOT, "components/tenant-gate.tsx");
const clientGatePath = resolve(ROOT, "components/client-overview-gate.tsx");
const clientGridPath = resolve(ROOT, "components/client-grid.tsx");
const layoutPath = resolve(ROOT, "app/layout.tsx");
const homePath = resolve(ROOT, "app/page.tsx");

const clients = ["agfm", "edison", "systra", "basedigitale", "medicair", "capitani-picone"];

/* --- 1. Auth module ---------------------------------------------------- */

test("Auth module: esiste lib/auth.ts", () => {
  assert.ok(existsSync(authPath), `File mancante: ${authPath}`);
});

const authSrc = readFileSync(authPath, "utf8");

test("Auth module: type User (id, name, email, role, clientId, createdAt)", () => {
  assert.match(authSrc, /export\s+interface\s+User\b/);
  assert.match(authSrc, /role:\s*UserRole/);
  assert.match(authSrc, /clientId\?:/);
});

test("Auth module: UserRole 'admin' | 'viewer'", () => {
  assert.match(authSrc, /export\s+type\s+UserRole\s*=\s*["']admin["']\s*\|\s*["']viewer["']/);
});

test("Auth module: STORAGE_KEYS per USERS e SESSION", () => {
  assert.match(authSrc, /USERS:\s*["']aichain:users["']/);
  assert.match(authSrc, /SESSION:\s*["']aichain:session["']/);
});

test("Auth module: canAccessClient (admin=true per tutti, viewer=solo suo)", () => {
  assert.match(authSrc, /export\s+function\s+canAccessClient\b/);
  const block = authSrc.match(
    /export\s+function\s+canAccessClient[\s\S]*?\n\}/,
  );
  assert.ok(block, "funzione canAccessClient non trovata");
  const body = block[0];
  assert.match(body, /user\.role\s*===\s*["']admin["']/);
  assert.match(body, /user\.clientId\s*===\s*clientId/);
});

test("Auth module: listAccessibleClientIds ritorna tutti per admin, solo [clientId] per viewer", () => {
  const block = authSrc.match(
    /export\s+function\s+listAccessibleClientIds[\s\S]*?\n\}/,
  );
  assert.ok(block);
  const body = block[0];
  assert.match(body, /CLIENTS\.map/);
  assert.match(body, /user\.clientId\s*\?\s*\[user\.clientId\]/);
});

test("Auth module: validateUserInput (no nome, email non valida, viewer senza clientId, duplicato)", () => {
  assert.match(authSrc, /export\s+function\s+validateUserInput\b/);
  const block = authSrc.match(
    /export\s+function\s+validateUserInput[\s\S]*?\n\}/,
  );
  assert.ok(block);
  const body = block[0];
  assert.match(body, /name.*2 caratteri|nome.*2 caratteri/i);
  assert.match(body, /email.*non valida|email.*non valida/i);
  assert.match(body, /viewer.*cliente|viewer.*cliente/i);
  assert.match(body, /esiste|non esiste/i);
  assert.match(body, /già usata/i);
});

/* --- 2. AuthProvider + useAuth ----------------------------------------- */

test("AuthContext: file components/auth-context.tsx presente", () => {
  assert.ok(existsSync(authCtxPath));
});

const authCtxSrc = readFileSync(authCtxPath, "utf8");

test("AuthContext: export AuthProvider + useAuth", () => {
  assert.match(authCtxSrc, /export\s+function\s+AuthProvider\b/);
  assert.match(authCtxSrc, /export\s+function\s+useAuth\b/);
});

test("AuthContext: espone hydrated flag (per evitare flicker SSR)", () => {
  assert.match(authCtxSrc, /hydrated:\s*boolean/);
});

/* --- 3. Layout avvolge in AuthProvider -------------------------------- */

test("Layout: avvolge children in <AuthProvider>", () => {
  const layout = readFileSync(layoutPath, "utf8");
  assert.match(layout, /<AuthProvider>\{children\}<\/AuthProvider>/);
});

/* --- 4. Route /settings + /denied ------------------------------------- */

test("Route /settings esiste", () => {
  assert.ok(existsSync(settingsPagePath));
});

test("Route /denied esiste", () => {
  assert.ok(existsSync(deniedPagePath));
});

test("Route /settings: renderizza SettingsPanel", () => {
  const page = readFileSync(settingsPagePath, "utf8");
  assert.match(page, /<SettingsPanel\s*\/>/);
});

test("Route /denied: messaggio di accesso negato", () => {
  const page = readFileSync(deniedPagePath, "utf8");
  assert.match(page, /Accesso negato/);
  assert.match(page, /\/settings/);
  assert.match(page, /href=["']\/["']/);
});

/* --- 5. SettingsPanel: form, lista, gating ---------------------------- */

test("SettingsPanel: file presente", () => {
  assert.ok(existsSync(settingsPanelPath));
});

const settingsPanelSrc = readFileSync(settingsPanelPath, "utf8");

test("SettingsPanel: renderizza form creazione utente con ruolo + cliente", () => {
  assert.match(settingsPanelSrc, /Nuova utenza/);
  assert.match(settingsPanelSrc, /admin|viewer/);
  assert.match(settingsPanelSrc, /Cliente \(stanza\)/);
});

test("SettingsPanel: lista utenti con badge ruolo + cliente", () => {
  assert.match(settingsPanelSrc, /Utenze \(/);
  assert.match(settingsPanelSrc, /variant="default".*admin|admin.*default/);
});

test("SettingsPanel: vista viewer (no form, mostra solo info account)", () => {
  assert.match(settingsPanelSrc, /Il tuo account/);
  assert.match(settingsPanelSrc, /stanza|Stanza/);
});

test("SettingsPanel: vista non-autenticato (mostra form primo admin)", () => {
  assert.match(settingsPanelSrc, /Accesso richiesto|primo amministratore/i);
});

/* --- 6. UserSwitcher --------------------------------------------------- */

test("UserSwitcher: file presente + export", () => {
  assert.ok(existsSync(userSwitcherPath));
  const src = readFileSync(userSwitcherPath, "utf8");
  assert.match(src, /export\s+function\s+UserSwitcher\b/);
});

test("UserSwitcher: link a /settings per admin, logout per tutti", () => {
  const src = readFileSync(userSwitcherPath, "utf8");
  assert.match(src, /\/settings/);
  assert.match(src, /logout/);
});

test("UserSwitcher: vista 'Accedi' se non loggato", () => {
  const src = readFileSync(userSwitcherPath, "utf8");
  assert.match(src, /Accedi/);
});

/* --- 7. TenantGate + ClientOverviewGate ------------------------------ */

test("TenantGate: file presente", () => {
  assert.ok(existsSync(tenantGatePath));
});

const tgSrc = readFileSync(tenantGatePath, "utf8");

test("TenantGate: redirect a /settings se non loggato, a /denied se non autorizzato", () => {
  assert.match(tgSrc, /router\.replace\(["']\/settings["']\)/);
  assert.match(tgSrc, /router\.replace\(["']\/denied["']\)/);
});

test("TenantGate: controlla canAccessClient", () => {
  assert.match(tgSrc, /canAccessClient\(clientId\)/);
});

test("ClientOverviewGate: combinazione di UserSwitcher + TenantGate", () => {
  assert.ok(existsSync(clientGatePath));
  const src = readFileSync(clientGatePath, "utf8");
  assert.match(src, /export\s+function\s+ClientOverviewGate\b/);
  assert.match(src, /<UserSwitcher\s*\/>/);
  assert.match(src, /<TenantGate\s+clientId=\{clientId\}>/);
});

/* --- 8. Integrazione nelle pagine [client]/... ----------------------- */

const clientPages = [
  "app/[client]/page.tsx",
  "app/[client]/[process]/page.tsx",
  "app/[client]/architettura/page.tsx",
  "app/[client]/valore/page.tsx",
  "app/[client]/specifiche/page.tsx",
];

for (const p of clientPages) {
  test(`Pagina ${p} è wrappata in <ClientOverviewGate clientId={client.id}>`, () => {
    const path = resolve(ROOT, p);
    assert.ok(existsSync(path), `File non trovato: ${p}`);
    const src = readFileSync(path, "utf8");
    assert.match(
      src,
      /<ClientOverviewGate\s+clientId=\{client\.id\}>/,
      `${p} non wrappata in ClientOverviewGate`,
    );
    assert.match(
      src,
      /<\/ClientOverviewGate>/,
      `${p} non chiude ClientOverviewGate`,
    );
  });
}

/* --- 9. ClientGrid: filtro tenant ------------------------------------- */

test("ClientGrid: file presente + export", () => {
  assert.ok(existsSync(clientGridPath));
  const src = readFileSync(clientGridPath, "utf8");
  assert.match(src, /export\s+function\s+ClientGrid\b/);
});

test("ClientGrid: logica di filtro admin vs viewer", () => {
  const src = readFileSync(clientGridPath, "utf8");
  assert.match(src, /admin/);
  assert.match(src, /viewer/);
  assert.match(src, /other-tenant/);
  assert.match(src, /unauthenticated/);
});

test("Home page: usa ClientGrid (filtro tenant) + UserSwitcher + link Settings", () => {
  const src = readFileSync(homePath, "utf8");
  assert.match(src, /<ClientGrid\s*\/>/);
  assert.match(src, /<UserSwitcher\s*\/>/);
  assert.match(src, /href=["']\/settings["']/);
});

/* --- 10. UI primitives necessari presenti ----------------------------- */

test("DropdownMenu primitive presente (per UserSwitcher)", () => {
  const path = resolve(ROOT, "components/ui/dropdown-menu.tsx");
  assert.ok(existsSync(path), "components/ui/dropdown-menu.tsx non trovato");
});

/* --- 11. Sanity check: parità dei clienti tra data.ts e auth ----------- */

test("lib/auth.ts è generico (non hardcoda gli id cliente)", () => {
  // L'auth module NON deve hardcodare gli id cliente: deve usare
  // CLIENTS.some(...) per restare generico. Verifichiamo:
  assert.match(
    authSrc,
    /CLIENTS\.some/,
    "lib/auth.ts non usa CLIENTS.some(...) per la validazione",
  );
  // Nessun id cliente hardcodato
  const hardcodedClient = clients.find((c) =>
    new RegExp(`["']${c}["']`).test(authSrc),
  );
  assert.equal(
    hardcodedClient,
    undefined,
    `lib/auth.ts hardcoda l'id cliente '${hardcodedClient}' — dovrebbe essere generico`,
  );
});

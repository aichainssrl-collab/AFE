// Demo auth: gestione utenze multi-tenant lato client (localStorage).
//
// SCOPO: separare le "stanze" dei clienti in modo che un utente associato
// ad un cliente X veda solo la sua stanza e NON possa navigare nelle altre.
//
// ATTENZIONE: questo è un meccanismo di gating dimostrativo. NON è una
// vera autenticazione server-side. Per ambienti di produzione serve:
//   - autenticazione gestita da IdP (Auth0, Clerk, NextAuth con OIDC)
//   - sessione firmata server-side (JWT / cookie httpOnly)
//   - controllo autorizzazione lato server su ogni route / API
// Vedi TODO in fondo al file per i punti di migrazione.

import { CLIENTS } from "@/lib/data";

/* --- Types -------------------------------------------------------------- */

export type UserRole = "admin" | "viewer";

export interface User {
  /** id univoco (uuid-like locale) */
  id: string;
  /** nome visualizzato */
  name: string;
  /** email (non validata; serve solo come label) */
  email: string;
  /** ruolo: admin = può creare utenze e vedere tutto, viewer = vede solo la sua stanza */
  role: UserRole;
  /** id del cliente a cui l'utente è associato (undefined per admin) */
  clientId?: string;
  /** ISO timestamp creazione */
  createdAt: string;
}

export interface Session {
  /** id utente attualmente impersonato */
  userId: string;
  /** ISO timestamp login */
  loggedInAt: string;
}

/* --- Storage keys ------------------------------------------------------- */

export const STORAGE_KEYS = {
  USERS: "aichain:users",
  SESSION: "aichain:session",
} as const;

/* --- Helpers ------------------------------------------------------------ */

/** Genera un id locale (no crypto.randomUUID lato SSR safety). */
export function generateId(): string {
  // crypto.randomUUID è disponibile in tutti i browser moderni e in Node >= 14.17
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback deterministico (non crittografico)
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/* --- CRUD utenti (persistenza localStorage) ---------------------------- */

export function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as User[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function addUser(input: Omit<User, "id" | "createdAt">): User {
  const users = loadUsers();
  const user: User = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return user;
}

export function deleteUser(userId: string): void {
  const users = loadUsers().filter((u) => u.id !== userId);
  saveUsers(users);
}

/* --- Sessione ----------------------------------------------------------- */

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  if (session === null) {
    window.localStorage.removeItem(STORAGE_KEYS.SESSION);
  } else {
    window.localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }
}

export function login(userId: string): Session {
  const session: Session = {
    userId,
    loggedInAt: new Date().toISOString(),
  };
  saveSession(session);
  return session;
}

export function logout(): void {
  saveSession(null);
}

/* --- Autorizzazione (tenant isolation) --------------------------------- */

/** Restituisce l'utente attualmente loggato (se esiste). */
export function getCurrentUser(): User | null {
  const session = loadSession();
  if (!session) return null;
  const users = loadUsers();
  return users.find((u) => u.id === session.userId) ?? null;
}

/**
 * Verifica se l'utente può accedere al cliente `clientId`.
 *
 * - admin: può accedere a tutti i clienti (clientId parametro ignorato)
 * - viewer senza clientId: nessun accesso (configurazione non valida)
 * - viewer con clientId: può accedere SOLO al proprio clientId
 * - nessun utente loggato: nessun accesso
 */
export function canAccessClient(user: User | null, clientId: string): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "viewer") {
    return Boolean(user.clientId) && user.clientId === clientId;
  }
  return false;
}

/** Lista di clienti che l'utente è autorizzato a vedere. */
export function listAccessibleClientIds(user: User | null): string[] {
  if (!user) return [];
  if (user.role === "admin") {
    return CLIENTS.map((c) => c.id);
  }
  return user.clientId ? [user.clientId] : [];
}

/* --- Validazione input -------------------------------------------------- */

export interface UserInputError {
  field: "name" | "email" | "role" | "clientId";
  message: string;
}

/** Valida un input utente lato client. */
export function validateUserInput(
  input: Omit<User, "id" | "createdAt">,
  existingUsers: User[] = [],
): UserInputError[] {
  const errors: UserInputError[] = [];
  if (!input.name || input.name.trim().length < 2) {
    errors.push({ field: "name", message: "Nome deve essere almeno 2 caratteri" });
  }
  if (!input.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) {
    errors.push({ field: "email", message: "Email non valida" });
  }
  if (!["admin", "viewer"].includes(input.role)) {
    errors.push({ field: "role", message: "Ruolo non valido" });
  }
  if (input.role === "viewer") {
    if (!input.clientId) {
      errors.push({ field: "clientId", message: "Viewer deve avere un cliente associato" });
    } else if (!CLIENTS.some((c) => c.id === input.clientId)) {
      errors.push({ field: "clientId", message: `Cliente '${input.clientId}' non esiste` });
    }
  }
  if (input.email) {
    const dupe = existingUsers.find(
      (u) => u.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (dupe) {
      errors.push({ field: "email", message: "Email già usata" });
    }
  }
  return errors;
}

/* --- TODO migrazione a real auth --------------------------------------- */
// 1. Spostare loadUsers/saveUsers in un'API server-side (/api/users).
// 2. Sostituire la sessione localStorage con un cookie httpOnly firmato.
// 3. Middleware Next.js (middleware.ts) per redirect a /login se non auth.
// 4. canAccessClient deve essere verificato anche nelle API server-side
//    che leggono dati per cliente (es. /api/clients/[id]/kpi).

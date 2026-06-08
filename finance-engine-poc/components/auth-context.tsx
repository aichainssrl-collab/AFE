"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addUser,
  deleteUser as deleteUserFromStorage,
  loadSession,
  loadUsers,
  login as loginToStorage,
  logout as logoutFromStorage,
  canAccessClient as canAccessClientLib,
  listAccessibleClientIds as listAccessibleClientIdsLib,
  type User,
  type UserRole,
  type UserInputError,
  validateUserInput,
} from "@/lib/auth";

/* --- Context shape ----------------------------------------------------- */

interface AuthContextValue {
  /** Utente attualmente loggato (null se nessuno). */
  currentUser: User | null;
  /** Lista di tutti gli utenti (visibile solo in admin). */
  users: User[];
  /** True se l'utente è admin. */
  isAdmin: boolean;
  /** True se c'è un utente loggato. */
  isAuthenticated: boolean;
  /** True dopo l'idratazione lato client (false durante SSR). */
  hydrated: boolean;
  /** Crea un nuovo utente (admin-only). Restituisce errori di validazione. */
  createUser: (input: Omit<User, "id" | "createdAt">) => UserInputError[];
  /** Cancella un utente (admin-only). */
  removeUser: (userId: string) => void;
  /** Login (demo): imposta la sessione per l'utente userId. */
  login: (userId: string) => void;
  /** Logout: rimuove la sessione. */
  logout: () => void;
  /** Può accedere al cliente `clientId`? Vedi lib/auth.ts. */
  canAccessClient: (clientId: string) => boolean;
  /** Lista di clienti accessibili all'utente corrente. */
  listAccessibleClientIds: () => string[];
  /** Forza un re-read da localStorage (utile dopo modifiche esterne). */
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* --- Provider ---------------------------------------------------------- */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    const loaded = loadUsers();
    setUsers(loaded);
    const session = loadSession();
    if (session) {
      const found = loaded.find((u) => u.id === session.userId);
      setCurrentUser(found ?? null);
    } else {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    // Sincronizza anche se il tab diventa visibile
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [refresh]);

  const createUser = useCallback(
    (input: Omit<User, "id" | "createdAt">): UserInputError[] => {
      const existing = loadUsers();
      const errors = validateUserInput(input, existing);
      if (errors.length > 0) return errors;
      addUser(input);
      refresh();
      return [];
    },
    [refresh],
  );

  const removeUser = useCallback(
    (userId: string) => {
      deleteUserFromStorage(userId);
      // Se cancello l'utente loggato, faccio logout
      const session = loadSession();
      if (session?.userId === userId) {
        logoutFromStorage();
      }
      refresh();
    },
    [refresh],
  );

  const login = useCallback(
    (userId: string) => {
      loginToStorage(userId);
      refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    logoutFromStorage();
    setCurrentUser(null);
  }, []);

  const canAccessClient = useCallback(
    (clientId: string) => canAccessClientLib(currentUser, clientId),
    [currentUser],
  );

  const listAccessibleClientIds = useCallback(
    () => listAccessibleClientIdsLib(currentUser),
    [currentUser],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      users,
      isAdmin: currentUser?.role === "admin",
      isAuthenticated: currentUser !== null,
      hydrated,
      createUser,
      removeUser,
      login,
      logout,
      canAccessClient,
      listAccessibleClientIds,
      refresh,
    }),
    [
      currentUser,
      users,
      hydrated,
      createUser,
      removeUser,
      login,
      logout,
      canAccessClient,
      listAccessibleClientIds,
      refresh,
    ],
  );

  // Per evitare flicker SSR, in attesa di hydration non renderizziamo
  // contenuti dipendenti dall'auth.
  if (!hydrated) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* --- Hook -------------------------------------------------------------- */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve essere usato dentro <AuthProvider>");
  }
  return ctx;
}

/* --- Helper re-export -------------------------------------------------- */
export type { User, UserRole, UserInputError };

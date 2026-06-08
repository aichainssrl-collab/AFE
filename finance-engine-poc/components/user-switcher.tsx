"use client";

import { useRouter } from "next/navigation";
import { LogIn, LogOut, Settings, Shield, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth, type User } from "@/components/auth-context";
import { CLIENTS } from "@/lib/data";

/**
 * UserSwitcher — selettore "demo" dell'utenza attiva.
 *
 * Viene mostrato nella topbar dell'app. Permette di:
 *  - vedere l'utente loggato (nome + ruolo)
 *  - cambiare utente (demo: nessuna password, solo click)
 *  - fare logout
 *  - andare a /settings (solo admin)
 *
 * NON è un'autenticazione reale: serve solo a testare l'isolamento
 * multi-tenant in modalità demo.
 */
export function UserSwitcher() {
  const router = useRouter();
  const { currentUser, users, isAdmin, login, logout } = useAuth();

  // Non loggato: bottone "Accedi" che porta a /settings
  if (!currentUser) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          router.push("/settings");
        }}
      >
        <LogIn className="mr-2 h-4 w-4" /> Accedi
      </Button>
    );
  }

  const myClient = currentUser.clientId
    ? CLIENTS.find((c) => c.id === currentUser.clientId)
    : null;

  function pick(userId: string) {
    login(userId);
    // After switching, reindirizza alla home per applicare filtri tenant
    router.push("/");
    router.refresh();
  }

  function doLogout() {
    logout();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm" className="max-w-[180px]">
          {currentUser.role === "admin" ? (
            <Shield className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <UserIcon className="mr-2 h-4 w-4" />
          )}
          <span className="truncate">{currentUser.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="space-y-0.5">
          <div className="text-sm font-semibold">{currentUser.name}</div>
          <div className="text-xs font-normal text-muted-foreground">
            {currentUser.email}
          </div>
          {myClient && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Stanza:</span>
              <span
                className="rounded border px-1.5 py-0.5 text-[10px]"
                style={{ borderColor: myClient.accent, color: myClient.accent }}
              >
                {myClient.name}
              </span>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.length > 1 && (
          <>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Cambia utenza (demo)
            </DropdownMenuLabel>
            {users
              .filter((u) => u.id !== currentUser.id)
              .map((u) => (
                <UserRow key={u.id} user={u} onPick={pick} />
              ))}
            <DropdownMenuSeparator />
          </>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => {
              router.push("/settings");
            }}
          >
            <Settings className="mr-2 h-4 w-4" /> Gestione utenze
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={doLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserRow({ user, onPick }: { user: User; onPick: (id: string) => void }) {
  const cli = user.clientId ? CLIENTS.find((c) => c.id === user.clientId) : null;
  return (
    <DropdownMenuItem onClick={() => onPick(user.id)}>
      {user.role === "admin" ? (
        <Shield className="mr-2 h-4 w-4 text-primary" />
      ) : (
        <UserIcon className="mr-2 h-4 w-4" />
      )}
      <span className="flex-1 truncate">{user.name}</span>
      {cli && (
        <span
          className="ml-2 rounded border px-1.5 py-0.5 text-[10px]"
          style={{ borderColor: cli.accent, color: cli.accent }}
        >
          {cli.name}
        </span>
      )}
    </DropdownMenuItem>
  );
}

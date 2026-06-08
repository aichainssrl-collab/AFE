"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, UserPlus, Shield, User as UserIcon, LogIn, LogOut } from "lucide-react";
import { useAuth, type User, type UserInputError } from "@/components/auth-context";
import { CLIENTS } from "@/lib/data";

export function SettingsPanel() {
  const router = useRouter();
  const { currentUser, users, isAdmin, isAuthenticated, createUser, removeUser, login, logout } =
    useAuth();

  // Se non loggato, mostro solo "scegli utente" o login
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accesso richiesto</CardTitle>
          <CardDescription>
            Seleziona un&apos;utenza esistente per accedere (demo), oppure chiedi a
            un amministratore di creare la tua.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nessuna utenza presente. Per iniziare, apri questa pagina
              autenticandoti come amministratore: in modalità demo, se non
              esistono admin, puoi creare il primo admin dal bottone qui sotto.
            </p>
          ) : (
            <UserPicker users={users} onPick={login} />
          )}
          <FirstAdminForm />
        </CardContent>
      </Card>
    );
  }

  // Viewer: può solo vedere le informazioni della propria utenza
  if (!isAdmin) {
    const myClient = currentUser!.clientId
      ? CLIENTS.find((c) => c.id === currentUser!.clientId)
      : null;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Il tuo account</CardTitle>
          <CardDescription>
            Sei loggato come <strong>{currentUser!.name}</strong> con ruolo{" "}
            <Badge variant="secondary">viewer</Badge>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Email: </span>
            {currentUser!.email}
          </div>
          <div>
            <span className="text-muted-foreground">Stanza: </span>
            {myClient ? (
              <Badge variant="outline" style={{ borderColor: myClient.accent }}>
                {myClient.name} ({myClient.sector})
              </Badge>
            ) : (
              <Badge variant="destructive">Nessun cliente associato</Badge>
            )}
          </div>
          <div className="rounded-md border border-amber-500/30 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Puoi accedere solo alla tua stanza. Navigando verso un altro
            cliente vedrai un messaggio di accesso negato.
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Admin: gestione utenze
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle>
                <Shield className="mr-2 inline h-4 w-4" /> Amministratore: {currentUser!.name}
              </CardTitle>
              <CardDescription>
                Crea e gestisci le utenze. Ogni viewer è associato a un solo
                cliente (la sua &quot;stanza&quot;).
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => { logout(); router.push("/"); }}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </CardHeader>
      </Card>

      <CreateUserForm onCreate={createUser} />

      <UsersList users={users} currentUserId={currentUser!.id} onRemove={removeUser} />
    </div>
  );
}

/* --- Sub-components ---------------------------------------------------- */

function FirstAdminForm() {
  const { createUser, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<UserInputError[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = createUser({ name, email, role: "admin" });
    setErrors(errs);
    if (errs.length === 0) {
      // auto-login del primo admin appena creato
      const u = name.toLowerCase();
      // Trova l'utente appena creato
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("aichain:users");
        if (raw) {
          const list = JSON.parse(raw) as User[];
          const me = list.find(
            (x) => x.email.toLowerCase() === email.toLowerCase(),
          );
          if (me) login(me.id);
        }
      }
      void u;
      setName("");
      setEmail("");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-md border p-3">
      <div className="text-sm font-medium">Crea il primo amministratore</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="first-name">Nome</Label>
          <Input
            id="first-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Mario Rossi"
          />
        </div>
        <div>
          <Label htmlFor="first-email">Email</Label>
          <Input
            id="first-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario@azienda.it"
          />
        </div>
      </div>
      {submitted && errors.length > 0 && (
        <ul className="text-xs text-red-600">
          {errors.map((e, i) => (
            <li key={i}>
              <strong>{e.field}:</strong> {e.message}
            </li>
          ))}
        </ul>
      )}
      <Button type="submit">
        <UserPlus className="mr-2 h-4 w-4" /> Crea admin e accedi
      </Button>
    </form>
  );
}

function UserPicker({ users, onPick }: { users: User[]; onPick: (id: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>Utenze disponibili</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {users.map((u) => (
          <Button
            key={u.id}
            variant="outline"
            className="justify-start text-left"
            onClick={() => onPick(u.id)}
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span className="flex-1 truncate">
              {u.name} <span className="text-xs text-muted-foreground">({u.email})</span>
            </span>
            <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}

function CreateUserForm({ onCreate }: { onCreate: (input: Omit<User, "id" | "createdAt">) => UserInputError[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [clientId, setClientId] = useState<string>(CLIENTS[0]?.id ?? "");
  const [errors, setErrors] = useState<UserInputError[]>([]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = onCreate({
      name,
      email,
      role,
      clientId: role === "viewer" ? clientId : undefined,
    });
    setErrors(errs);
    if (errs.length === 0) {
      setName("");
      setEmail("");
      setRole("viewer");
      setClientId(CLIENTS[0]?.id ?? "");
    }
  }

  const fieldError = (field: UserInputError["field"]) =>
    errors.find((e) => e.field === field)?.message;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          <UserPlus className="mr-2 inline h-4 w-4" /> Nuova utenza
        </CardTitle>
        <CardDescription>
          Crea un nuovo utente. Se è <code>viewer</code>, associa il cliente
          (la sua &quot;stanza&quot;). Se è <code>admin</code>, può accedere a
          tutte le stanze.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="new-name">Nome</Label>
            <Input
              id="new-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Luigi Bianchi"
            />
            {fieldError("name") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="luigi@azienda.it"
            />
            {fieldError("email") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("email")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="new-role">Ruolo</Label>
            <Select
              value={role}
              onValueChange={(v) => {
                if (v === "admin" || v === "viewer") setRole(v);
              }}
            >
              <SelectTrigger id="new-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">admin</SelectItem>
                <SelectItem value="viewer">viewer</SelectItem>
              </SelectContent>
            </Select>
            {fieldError("role") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("role")}</p>
            )}
          </div>
          {role === "viewer" && (
            <div>
              <Label htmlFor="new-client">Cliente (stanza)</Label>
              <Select
                value={clientId}
                onValueChange={(v) => {
                  if (v) setClientId(v);
                }}
              >
                <SelectTrigger id="new-client">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("clientId") && (
                <p className="mt-1 text-xs text-red-600">{fieldError("clientId")}</p>
              )}
            </div>
          )}
          <div className="sm:col-span-2">
            <Button type="submit">
              <UserPlus className="mr-2 h-4 w-4" /> Crea utenza
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function UsersList({
  users,
  currentUserId,
  onRemove,
}: {
  users: User[];
  currentUserId: string;
  onRemove: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Utenze ({users.length})</CardTitle>
        <CardDescription>
          Lista delle utenze attive. Le utenze cancellate sono rimosse dal
          localStorage del browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Nome</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Ruolo</th>
                <th className="px-3 py-2 font-medium">Cliente</th>
                <th className="px-3 py-2 font-medium">Creata</th>
                <th className="px-3 py-2 font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const cli = u.clientId ? CLIENTS.find((c) => c.id === u.clientId) : null;
                return (
                  <tr key={u.id} className="hover:bg-secondary/30">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {u.role === "admin" ? (
                          <Shield className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className="font-medium">{u.name}</span>
                        {u.id === currentUserId && (
                          <Badge variant="outline" className="text-[10px]">
                            tu
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                    <td className="px-3 py-2">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      {cli ? (
                        <Badge
                          variant="outline"
                          style={{ borderColor: cli.accent }}
                        >
                          {cli.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                      {new Date(u.createdAt).toLocaleString("it-IT")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Cancellare l'utenza "${u.name}"?`)) {
                            onRemove(u.id);
                          }
                        }}
                        disabled={u.id === currentUserId}
                        title={
                          u.id === currentUserId
                            ? "Non puoi cancellare te stesso"
                            : "Cancella"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

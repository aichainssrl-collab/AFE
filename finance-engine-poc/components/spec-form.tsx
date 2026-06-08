"use client";

import { useEffect, useState } from "react";
import { Check, Download, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import spec from "@/lib/spec-questions.json";

type Answer = string | string[];
type Answers = Record<string, Answer>;
type SpecQuestion = {
  id: string;
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
};
type SpecSection = {
  id: string;
  title: string;
  description?: string;
  questions: SpecQuestion[];
};

const PROSPECT_SECTIONS = spec.prospectSections as Record<string, SpecSection>;

export function SpecForm({
  clientId,
  prospectName,
  initialValues,
}: {
  clientId?: string;
  prospectName?: string;
  initialValues?: Answers;
}) {
  const storageKey = clientId ? `aichain:spec-form:${clientId}` : "aichain:spec-form";

  // Common sections + the prospect's dedicated ad-hoc section (if any)
  const sections: SpecSection[] = [
    ...(spec.sections as SpecSection[]),
    ...(clientId && PROSPECT_SECTIONS[clientId] ? [PROSPECT_SECTIONS[clientId]] : []),
  ];

  const [answers, setAnswers] = useState<Answers>(initialValues ?? {});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setAnswers({ ...(initialValues ?? {}), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function set(id: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  }

  function toggle(id: string, option: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [id]: next };
    });
    setSaved(false);
  }

  function handleSave() {
    localStorage.setItem(storageKey, JSON.stringify(answers));
    setSaved(true);
  }

  function handleDownload() {
    const payload = {
      form: spec.title,
      version: spec.version,
      prospect: prospectName ?? clientId ?? null,
      compiledAt: new Date().toISOString(),
      answers,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = clientId ? `specifiche-${clientId}.json` : "specifiche-sviluppo.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            {(section.questions as SpecQuestion[]).map((q) => {
              const wide = q.type === "textarea" || q.type === "checkbox";
              return (
                <div key={q.id} className={wide ? "sm:col-span-2 space-y-2" : "space-y-2"}>
                  <Label htmlFor={q.id} className="text-sm font-medium">
                    {q.label}
                    {"required" in q && q.required && <span className="text-destructive"> *</span>}
                  </Label>

                  {(q.type === "text" || q.type === "email" || q.type === "number") && (
                    <Input
                      id={q.id}
                      type={q.type}
                      placeholder={q.placeholder}
                      value={(answers[q.id] as string) ?? ""}
                      onChange={(e) => set(q.id, e.target.value)}
                    />
                  )}

                  {q.type === "textarea" && (
                    <Textarea
                      id={q.id}
                      placeholder={q.placeholder}
                      value={(answers[q.id] as string) ?? ""}
                      onChange={(e) => set(q.id, e.target.value)}
                    />
                  )}

                  {q.type === "select" && q.options && (
                    <Select value={(answers[q.id] as string) ?? ""} onValueChange={(v) => set(q.id, v ?? "")}>
                      <SelectTrigger id={q.id}>
                        <SelectValue placeholder="Seleziona…" />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {q.type === "radio" && q.options && (
                    <RadioGroup
                      value={(answers[q.id] as string) ?? ""}
                      onValueChange={(v) => set(q.id, v ?? "")}
                      className="gap-2 pt-1"
                    >
                      {q.options.map((o) => (
                        <div key={o} className="flex items-center gap-2">
                          <RadioGroupItem id={`${q.id}-${o}`} value={o} />
                          <Label htmlFor={`${q.id}-${o}`} className="text-sm font-normal">
                            {o}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {q.type === "checkbox" && q.options && (
                    <div className="grid gap-2 pt-1 sm:grid-cols-2">
                      {q.options.map((o) => {
                        const checked = Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(o);
                        return (
                          <div key={o} className="flex items-center gap-2">
                            <Checkbox id={`${q.id}-${o}`} checked={checked} onCheckedChange={() => toggle(q.id, o)} />
                            <Label htmlFor={`${q.id}-${o}`} className="text-sm font-normal">
                              {o}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSave} className="gap-1.5">
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Salvato" : "Salva form"}
        </Button>
        <Button variant="outline" onClick={handleDownload} className="gap-1.5">
          <Download className="h-4 w-4" />
          Scarica JSON
        </Button>
        {saved && <span className="text-sm text-muted-foreground">Risposte salvate localmente nel browser.</span>}
      </div>
    </div>
  );
}

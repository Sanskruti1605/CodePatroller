import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileCode2, GitPullRequest, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, SeverityBadge, StatusBadge } from "@/components/severity-badge";
import { demoCode, demoFile, findings } from "@/lib/mock-data";
import { useFindingStatuses } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Security Review — PR #42 — CodePatroller" },
      { name: "description", content: "Line-by-line simulated security review of a sample Python authentication pull request." },
      { property: "og:title", content: "Security Review — CodePatroller" },
      { property: "og:description", content: "Line-by-line simulated security review of a sample Python authentication pull request." },
    ],
  }),
  component: Review,
});

const prFindings = findings.filter((f) => f.pr === 42);
const lines = demoCode.split("\n");

function Review() {
  const [selectedId, setSelectedId] = useState(prFindings[0]!.id);
  const [statuses, setStatuses] = useFindingStatuses();
  const selected = prFindings.find((f) => f.id === selectedId)!;
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    lineRefs.current[selected.line]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selected.line]);

  const setStatus = (s: "open" | "resolved" | "dismissed") => {
    setStatuses((prev) => ({ ...prev, [selected.id]: s }));
    toast.success(`${selected.title} marked as ${s}`);
  };
  const status = statuses[selected.id] ?? "open";

  return (
    <div>
      <PageHeader title="Security Review" description="campus-auth-service · Sample PR">
        <div className="flex items-center gap-2 text-sm">
          <GitPullRequest className="h-4 w-4 text-primary" />
          <span className="font-medium">#42 Add login & registration endpoints</span>
        </div>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b bg-muted px-4 py-2 text-sm font-mono">
            <FileCode2 className="h-4 w-4 text-muted-foreground" /> {demoFile}
          </div>
          <div className="max-h-[70vh] overflow-auto py-2 font-mono text-[13px] leading-6">
            {lines.map((code, i) => {
              const n = i + 1;
              const f = prFindings.find((x) => x.line === n);
              const active = selected.line === n;
              return (
                <div
                  key={n}
                  ref={(el) => { lineRefs.current[n] = el; }}
                  onClick={() => f && setSelectedId(f.id)}
                  className={cn(
                    "flex border-l-4 border-transparent",
                    f && "cursor-pointer bg-sev-critical/5",
                    active && "border-primary bg-highlight",
                  )}
                >
                  <span className="w-12 shrink-0 select-none pr-3 text-right text-muted-foreground">{n}</span>
                  <span className="w-5 shrink-0">{f && <span className="mt-2 block h-2 w-2 rounded-full bg-sev-critical" />}</span>
                  <pre className="flex-1 whitespace-pre pr-4 [font-variant-ligatures:none]">{code || " "}</pre>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            {prFindings.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg border bg-card p-3 text-left transition hover:border-primary/50",
                  f.id === selectedId && "border-primary ring-2 ring-primary/20",
                )}
              >
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{f.cwe} · line {f.line}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={statuses[f.id] ?? "open"} />
                  <SeverityBadge severity={f.severity} />
                </div>
              </button>
            ))}
          </div>

          <Card className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{selected.title}</h2>
              <SeverityBadge severity={selected.severity} />
            </div>
            <p className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Simulated AI explanation
            </p>
            <Section title="Description">{selected.description}</Section>
            <Section title="Impact">{selected.impact}</Section>
            <Section title="Recommended fix">{selected.fix}</Section>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold">Safer code example</h3>
              <pre className="overflow-auto rounded-md border bg-success/5 p-3 font-mono text-xs leading-5">{selected.saferCode}</pre>
            </div>
            <div className="flex flex-wrap gap-2 border-t pt-4">
              {status === "open" ? (
                <>
                  <Button size="sm" onClick={() => setStatus("resolved")}><CheckCircle2 className="h-4 w-4" />Resolve</Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus("dismissed")}><XCircle className="h-4 w-4" />Dismiss</Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setStatus("open")}><RotateCcw className="h-4 w-4" />Reopen</Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

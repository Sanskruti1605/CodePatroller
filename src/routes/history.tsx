import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, SeverityBadge, StatusBadge } from "@/components/severity-badge";
import { findings, scanHistory, severityOrder } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — CodePatroller" },
      { name: "description", content: "Previous simulated pull request scans and their results." },
      { property: "og:title", content: "Scan History — CodePatroller" },
      { property: "og:description", content: "Previous simulated pull request scans and their results." },
    ],
  }),
  component: History,
});

function History() {
  const [sel, setSel] = useState<(typeof scanHistory)[number] | null>(null);
  return (
    <div>
      <PageHeader title="Scan History" description="Sample record of previous scans." />
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Scan</TableHead><TableHead>Repository</TableHead><TableHead>PR</TableHead><TableHead>Date</TableHead><TableHead>Duration</TableHead><TableHead>Result</TableHead><TableHead /></TableRow>
          </TableHeader>
          <TableBody>
            {scanHistory.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono">{s.id}</TableCell>
                <TableCell>{s.repo}</TableCell>
                <TableCell>#{s.pr}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>{s.duration}</TableCell>
                <TableCell>{s.result === "Failed" ? <StatusBadge status="failed" /> : s.result}</TableCell>
                <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => setSel(s)}>Details</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent>
          {sel && (
            <>
              <DialogHeader>
                <DialogTitle>Scan {sel.id}</DialogTitle>
                <DialogDescription>{sel.repo} · PR #{sel.pr} · {sel.date}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-2">
                {severityOrder.map((s) => (
                  <div key={s} className="rounded-md border p-2 text-center">
                    <p className="text-xl font-semibold">{sel[s]}</p>
                    <SeverityBadge severity={s} />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {findings.filter((f) => f.pr === sel.pr && f.repo === sel.repo).map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <span>{f.title} <span className="font-mono text-xs text-muted-foreground">{f.file}:{f.line}</span></span>
                    <SeverityBadge severity={f.severity} />
                  </div>
                ))}
                {sel.result === "Failed" && <p className="text-sm text-muted-foreground">Simulated failure: repository checkout timed out.</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

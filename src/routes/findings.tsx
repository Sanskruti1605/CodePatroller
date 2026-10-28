import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, SeverityBadge, StatusBadge } from "@/components/severity-badge";
import { findings, severityOrder, type FindingStatus } from "@/lib/mock-data";
import { useFindingStatuses } from "@/lib/demo-store";

export const Route = createFileRoute("/findings")({
  head: () => ({
    meta: [
      { title: "Security Findings — CodePatroller" },
      { name: "description", content: "Search, filter and triage sample security findings." },
      { property: "og:title", content: "Security Findings — CodePatroller" },
      { property: "og:description", content: "Search, filter and triage sample security findings." },
    ],
  }),
  component: Findings,
});

function Findings() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("all");
  const [st, setSt] = useState("all");
  const [statuses, setStatuses] = useFindingStatuses();

  const rows = findings
    .map((f) => ({ ...f, status: statuses[f.id] ?? "open" }))
    .filter((f) => (f.title + f.file + f.repo + f.cwe).toLowerCase().includes(q.toLowerCase()))
    .filter((f) => sev === "all" || f.severity === sev)
    .filter((f) => st === "all" || f.status === st);

  const update = (id: string, s: FindingStatus) => {
    setStatuses((p) => ({ ...p, [id]: s }));
    toast.success(`${id} marked as ${s}`);
  };

  return (
    <div>
      <PageHeader title="Security Findings" description="Status changes are saved in your browser." />
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search findings…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={sev} onValueChange={setSev}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            {severityOrder.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={st} onValueChange={setSt}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "open", "resolved", "dismissed"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "All statuses" : s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Finding</TableHead><TableHead>Severity</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((f) => (
              <TableRow key={f.id}>
                <TableCell>
                  {f.pr === 42 ? <Link to="/review" className="font-medium hover:text-primary">{f.title}</Link> : <span className="font-medium">{f.title}</span>}
                  <p className="text-xs text-muted-foreground">{f.id} · {f.cwe} · {f.repo} #{f.pr}</p>
                </TableCell>
                <TableCell><SeverityBadge severity={f.severity} /></TableCell>
                <TableCell className="font-mono text-xs">{f.file}:{f.line}</TableCell>
                <TableCell><StatusBadge status={f.status} /></TableCell>
                <TableCell className="space-x-2 text-right whitespace-nowrap">
                  {f.status === "open" ? (
                    <>
                      <Button size="sm" onClick={() => update(f.id, "resolved")}>Resolve</Button>
                      <Button size="sm" variant="outline" onClick={() => update(f.id, "dismissed")}>Dismiss</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => update(f.id, "open")}>Reopen</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No findings match.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

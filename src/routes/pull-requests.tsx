import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Play, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, StatusBadge } from "@/components/severity-badge";
import { pullRequests, repositories } from "@/lib/mock-data";
import { useLocalState } from "@/lib/demo-store";

export const Route = createFileRoute("/pull-requests")({
  head: () => ({
    meta: [
      { title: "Pull Requests — CodePatroller" },
      { name: "description", content: "Search, filter and run simulated security analysis on pull requests." },
      { property: "og:title", content: "Pull Requests — CodePatroller" },
      { property: "og:description", content: "Search, filter and run simulated security analysis on pull requests." },
    ],
  }),
  component: PRs,
});

function PRs() {
  const [q, setQ] = useState("");
  const [repo, setRepo] = useState("all");
  const [status, setStatus] = useState("all");
  const [overrides, setOverrides] = useLocalState<Record<number, string>>("cp-pr-status", {});
  const [scanning, setScanning] = useState<{ id: number; progress: number } | null>(null);

  const rows = pullRequests
    .map((p) => ({ ...p, status: overrides[p.id] ?? p.status }))
    .filter((p) => (p.title + p.author + p.id).toLowerCase().includes(q.toLowerCase()))
    .filter((p) => repo === "all" || p.repo === repo)
    .filter((p) => status === "all" || p.status === status);

  const analyze = (id: number) => {
    if (scanning) return;
    let progress = 0;
    setScanning({ id, progress });
    toast.info(`Simulated analysis started for PR #${id}`);
    const t = setInterval(() => {
      progress += 20;
      setScanning({ id, progress });
      if (progress >= 100) {
        clearInterval(t);
        setScanning(null);
        setOverrides((o) => ({ ...o, [id]: "scanned" }));
        toast.success(`PR #${id} analysis complete (sample results)`);
      }
    }, 500);
  };

  return (
    <div>
      <PageHeader title="Pull Requests" description="Run a simulated security analysis on any PR." />
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search PRs…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={repo} onValueChange={setRepo}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All repositories</SelectItem>
            {repositories.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "scanned", "pending", "failed"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "All statuses" : s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>PR</TableHead><TableHead>Repository</TableHead><TableHead>Author</TableHead><TableHead>Findings</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">#{p.id} {p.title}</TableCell>
                <TableCell>{p.repo}</TableCell>
                <TableCell>{p.author}</TableCell>
                <TableCell>{p.findings}</TableCell>
                <TableCell>
                  {scanning?.id === p.id ? <Progress value={scanning.progress} className="w-24" /> : <StatusBadge status={p.status} />}
                </TableCell>
                <TableCell className="space-x-2 text-right whitespace-nowrap">
                  {p.id === 42 && <Button asChild size="sm" variant="outline"><Link to="/review">Review</Link></Button>}
                  <Button size="sm" disabled={!!scanning} onClick={() => analyze(p.id)}>
                    {scanning?.id === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}Analyze PR
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No pull requests match.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

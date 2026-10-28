import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/severity-badge";
import { repositories } from "@/lib/mock-data";
import { useLocalState } from "@/lib/demo-store";

export const Route = createFileRoute("/repositories")({
  head: () => ({
    meta: [
      { title: "Repositories — CodePatroller" },
      { name: "description", content: "Repositories monitored for pull request security scanning (demo)." },
      { property: "og:title", content: "Repositories — CodePatroller" },
      { property: "og:description", content: "Repositories monitored for pull request security scanning (demo)." },
    ],
  }),
  component: Repos,
});

type Repo = (typeof repositories)[number];

function Repos() {
  const [added, setAdded] = useLocalState<Repo[]>("cp-repos", []);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const all = [...repositories, ...added];

  const add = () => {
    if (!name.trim() || !owner.trim()) { toast.error("Enter owner and repository name"); return; }
    setAdded([...added, { id: crypto.randomUUID(), name: name.trim(), owner: owner.trim(), language: "—", prs: 0, lastScan: "Never", issues: 0 }]);
    toast.success(`${owner}/${name} added (simulated)`);
    setName(""); setOwner(""); setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Repositories" description="Repositories connected for PR scanning.">
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Add Repository</Button>
      </PageHeader>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Repository</TableHead><TableHead>Language</TableHead><TableHead>PRs</TableHead><TableHead>Open issues</TableHead><TableHead>Last scan</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {all.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.owner}/<span className="text-primary">{r.name}</span></TableCell>
                <TableCell>{r.language}</TableCell>
                <TableCell>{r.prs}</TableCell>
                <TableCell>{r.issues}</TableCell>
                <TableCell className="text-muted-foreground">{r.lastScan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Repository</DialogTitle>
            <DialogDescription>Demo only — no real GitHub connection is made.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Owner</Label><Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="nandini-k" /></div>
            <div className="space-y-1.5"><Label>Repository name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-project" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={add}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

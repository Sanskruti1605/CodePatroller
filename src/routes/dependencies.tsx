import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ScanSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, SeverityBadge } from "@/components/severity-badge";
import { dependencies } from "@/lib/mock-data";
import { useLocalState } from "@/lib/demo-store";

export const Route = createFileRoute("/dependencies")({
  head: () => ({
    meta: [
      { title: "Dependency Analysis — CodePatroller" },
      { name: "description", content: "Sample vulnerable dependencies with a simulated dependency scan." },
      { property: "og:title", content: "Dependency Analysis — CodePatroller" },
      { property: "og:description", content: "Sample vulnerable dependencies with a simulated dependency scan." },
    ],
  }),
  component: Deps,
});

function Deps() {
  const [progress, setProgress] = useState<number | null>(null);
  const [lastScan, setLastScan] = useLocalState<string>("cp-dep-scan", "Not run yet");

  const scan = () => {
    let p = 0;
    setProgress(0);
    const t = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(t);
        setProgress(null);
        setLastScan(new Date().toLocaleString());
        toast.success("Simulated dependency scan complete — showing sample data");
      }
    }, 250);
  };

  return (
    <div>
      <PageHeader title="Dependency Analysis" description={`Last simulated scan: ${lastScan}`}>
        <Button onClick={scan} disabled={progress !== null}>
          {progress !== null ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}Run dependency scan
        </Button>
      </PageHeader>
      {progress !== null && (
        <Card className="mb-4 p-4">
          <p className="mb-2 text-sm">Checking manifests against sample advisory list… {progress}%</p>
          <Progress value={progress} />
        </Card>
      )}
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Package</TableHead><TableHead>Installed</TableHead><TableHead>Latest</TableHead><TableHead>Severity</TableHead><TableHead>Advisory</TableHead><TableHead>Repository</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {dependencies.map((d) => (
              <TableRow key={d.repo + d.name}>
                <TableCell className="font-mono font-medium">{d.name}</TableCell>
                <TableCell className="font-mono">{d.version}</TableCell>
                <TableCell className="font-mono text-success">{d.latest}</TableCell>
                <TableCell><SeverityBadge severity={d.severity} /></TableCell>
                <TableCell>{d.advisory}</TableCell>
                <TableCell className="text-muted-foreground">{d.repo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

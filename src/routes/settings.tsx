import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/severity-badge";
import { useLocalState } from "@/lib/demo-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CodePatroller" },
      { name: "description", content: "Scan preferences, notifications and GitHub integration status (demo)." },
      { property: "og:title", content: "Settings — CodePatroller" },
      { property: "og:description", content: "Scan preferences, notifications and GitHub integration status (demo)." },
    ],
  }),
  component: SettingsPage,
});

const defaults = {
  autoScan: true, depScan: true, aiExplain: true, blockCritical: false,
  emailAlerts: true, prComments: true, weeklyDigest: false,
};
const labels: Record<keyof typeof defaults, string> = {
  autoScan: "Scan new pull requests automatically",
  depScan: "Include dependency analysis",
  aiExplain: "Generate AI explanations (simulated)",
  blockCritical: "Flag PRs with critical findings as blocking",
  emailAlerts: "Email alerts for critical findings",
  prComments: "Post findings as PR comments",
  weeklyDigest: "Weekly security digest",
};

function SettingsPage() {
  const [s, setS] = useLocalState("cp-settings", defaults);
  const toggle = (k: keyof typeof defaults) => {
    setS({ ...s, [k]: !s[k] });
    toast.success("Preference saved");
  };
  const group = (keys: (keyof typeof defaults)[]) =>
    keys.map((k) => (
      <div key={k} className="flex items-center justify-between py-2">
        <Label htmlFor={k}>{labels[k]}</Label>
        <Switch id={k} checked={s[k]} onCheckedChange={() => toggle(k)} />
      </div>
    ));

  return (
    <div className="max-w-3xl space-y-4">
      <PageHeader title="Settings" />
      <Card>
        <CardHeader><CardTitle className="text-base">Scan preferences</CardTitle></CardHeader>
        <CardContent className="divide-y">{group(["autoScan", "depScan", "aiExplain", "blockCritical"])}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="divide-y">{group(["emailAlerts", "prComments", "weeklyDigest"])}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GitHub integration</CardTitle>
          <CardDescription>Simulated — this demo does not connect to GitHub.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Github className="h-6 w-6" />
            <div>
              <p className="font-medium">Demo connection</p>
              <p className="text-sm text-muted-foreground">Using sample repositories only</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.info("GitHub integration is not available in demo mode")}>Connect GitHub</Button>
        </CardContent>
      </Card>
    </div>
  );
}

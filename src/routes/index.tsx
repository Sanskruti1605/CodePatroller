import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { AlertTriangle, FolderGit2, GitPullRequest, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, SeverityBadge, StatusBadge } from "@/components/severity-badge";
import { findings, pullRequests, repositories, severityOrder, trend } from "@/lib/mock-data";
import { useFindingStatuses } from "@/lib/demo-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CodePatroller" },
      { name: "description", content: "Overview of simulated PR security scans, severities and trends." },
      { property: "og:title", content: "Dashboard — CodePatroller" },
      { property: "og:description", content: "Overview of simulated PR security scans, severities and trends." },
    ],
  }),
  component: Dashboard,
});

const sevColor: Record<string, string> = {
  critical: "var(--sev-critical)", high: "var(--sev-high)", medium: "var(--chart-3)", low: "var(--sev-low)",
};

function Dashboard() {
  const [statuses] = useFindingStatuses();
  const open = findings.filter((f) => (statuses[f.id] ?? "open") === "open");
  const sevData = severityOrder.map((s) => ({ name: s, count: open.filter((f) => f.severity === s).length }));
  const stats = [
    { label: "Repositories", value: repositories.length, icon: FolderGit2 },
    { label: "Pull Requests", value: pullRequests.length, icon: GitPullRequest },
    { label: "Open Findings", value: open.length, icon: AlertTriangle },
    { label: "Resolved", value: findings.length - open.length, icon: ShieldCheck },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Security Dashboard" description="Illustrative overview based on sample data." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-3xl font-semibold">{s.value}</p>
              </div>
              <s.icon className="h-8 w-8 text-primary/70" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Open findings by severity</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={sevData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {sevData.map((d) => <Cell key={d.name} fill={sevColor[d.name]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Vulnerability trend (sample)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                {severityOrder.map((s) => <Line key={s} type="monotone" dataKey={s} stroke={sevColor[s]} strokeWidth={2} />)}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent pull requests</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {pullRequests.slice(0, 4).map((pr) => (
              <div key={pr.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">#{pr.id} {pr.title}</p>
                  <p className="text-xs text-muted-foreground">{pr.repo}</p>
                </div>
                <StatusBadge status={pr.status} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent findings</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {findings.slice(0, 4).map((f) => (
              <Link key={f.id} to="/review" className="flex items-center justify-between gap-2 py-2.5 text-sm hover:text-primary">
                <div className="min-w-0">
                  <p className="truncate font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{f.file}:{f.line}</p>
                </div>
                <SeverityBadge severity={f.severity} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

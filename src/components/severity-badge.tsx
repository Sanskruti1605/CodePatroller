import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/mock-data";

const styles: Record<Severity, string> = {
  critical: "bg-sev-critical/10 text-sev-critical border-sev-critical/30",
  high: "bg-sev-high/10 text-sev-high border-sev-high/30",
  medium: "bg-sev-medium/15 text-sev-medium border-sev-medium/40",
  low: "bg-sev-low/10 text-sev-low border-sev-low/30",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize", styles[severity], className)}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-primary/10 text-primary border-primary/30",
    scanned: "bg-success/10 text-success border-success/30",
    resolved: "bg-success/10 text-success border-success/30",
    pending: "bg-muted text-muted-foreground border-border",
    scanning: "bg-primary/10 text-primary border-primary/30",
    dismissed: "bg-muted text-muted-foreground border-border",
    failed: "bg-sev-critical/10 text-sev-critical border-sev-critical/30",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", map[status] ?? map["pending"])}>
      {status}
    </span>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

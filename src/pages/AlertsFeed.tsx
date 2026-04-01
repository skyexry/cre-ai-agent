import { useState } from "react";
import { AlertTriangle, AlertCircle, Info, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { alerts, type AlertSeverity } from "@/data/mockData";

const severityConfig: Record<AlertSeverity, { icon: typeof AlertTriangle; color: string; bg: string; border: string; label: string }> = {
  critical: { icon: AlertTriangle, color: "text-health-critical", bg: "bg-health-critical/10", border: "border-health-critical/30", label: "Critical" },
  high: { icon: AlertCircle, color: "text-health-watch", bg: "bg-health-watch/10", border: "border-health-watch/30", label: "High" },
  medium: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", label: "Medium" },
  low: { icon: Info, color: "text-muted-foreground", bg: "bg-secondary", border: "border-border", label: "Low" },
};

type SeverityFilter = "all" | AlertSeverity;

export default function AlertsFeed() {
  const [filter, setFilter] = useState<SeverityFilter>("all");

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.severity === filter);
  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Alerts Feed</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{unreadCount} unread alerts across portfolio</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-1.5">
        {(["all", "critical", "high", "medium", "low"] as SeverityFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              filter === f ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : severityConfig[f].label}
            {f !== "all" && (
              <span className="ml-1 text-[10px] text-muted-foreground">
                ({alerts.filter(a => a.severity === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(alert => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`rounded-lg border ${alert.isRead ? "border-border bg-card" : `${config.border} ${config.bg}`} p-4 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{alert.title}</span>
                    {!alert.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <Link
                    to={`/tenant/${alert.tenantId}`}
                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {alert.tenantName} · {alert.property}
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                  <p className="mt-1.5 text-xs text-foreground/70">{alert.description}</p>
                  <div className="mt-2 flex items-start gap-1.5 rounded-md bg-secondary/50 p-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    <p className="text-[11px] text-muted-foreground">{alert.recommendedAction}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground capitalize">{alert.category}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

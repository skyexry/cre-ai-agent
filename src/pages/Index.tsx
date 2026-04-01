import { useMemo, useState } from "react";
import { tenants } from "@/data/mockData";
import TenantCard from "@/components/TenantCard";
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, AlertTriangle, TrendingDown, Building2 } from "lucide-react";

type Filter = "all" | "excellent" | "good" | "watch" | "critical";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All Tenants" },
  { value: "critical", label: "Critical" },
  { value: "watch", label: "Watch" },
  { value: "good", label: "Good" },
  { value: "excellent", label: "Excellent" },
];

export default function Portfolio() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return tenants;
    return tenants.filter(t => t.healthTier === filter);
  }, [filter]);

  const stats = useMemo(() => {
    const avg = Math.round(tenants.reduce((s, t) => s + t.healthScore, 0) / tenants.length);
    const alertCount = tenants.filter(t => t.hasAlert).length;
    const declining = tenants.filter(t => t.trend === "down").length;
    return { total: tenants.length, avg, alertCount, declining };
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground">Portfolio Overview</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Tenant credit health across all properties</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Tenants", value: stats.total, icon: Building2, color: "text-foreground" },
          { label: "Avg Health Score", value: stats.avg, icon: Shield, color: "text-primary" },
          { label: "Active Alerts", value: stats.alertCount, icon: AlertTriangle, color: "text-health-critical" },
          { label: "Declining", value: stats.declining, icon: TrendingDown, color: "text-health-watch" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </div>
            <p className={`mt-1 font-mono text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-1.5">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              filter === f.value
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(tenant => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </div>
    </DashboardLayout>
  );
}

import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tenant } from "@/data/mockData";

function getHealthColor(tier: string) {
  switch (tier) {
    case "excellent": return "text-health-excellent";
    case "good": return "text-health-good";
    case "watch": return "text-health-watch";
    case "critical": return "text-health-critical";
    default: return "text-muted-foreground";
  }
}

function getHealthBg(tier: string) {
  switch (tier) {
    case "excellent": return "bg-health-excellent/10";
    case "good": return "bg-health-good/10";
    case "watch": return "bg-health-watch/10";
    case "critical": return "bg-health-critical/10";
    default: return "bg-muted";
  }
}

function getHealthRing(tier: string) {
  switch (tier) {
    case "excellent": return "border-health-excellent/30";
    case "good": return "border-health-good/30";
    case "watch": return "border-health-watch/30";
    case "critical": return "border-health-critical/30";
    default: return "border-border";
  }
}

export default function TenantCard({ tenant }: { tenant: Tenant }) {
  const TrendIcon = tenant.trend === "up" ? TrendingUp : tenant.trend === "down" ? TrendingDown : Minus;
  const trendColor = tenant.trend === "up" ? "text-health-excellent" : tenant.trend === "down" ? "text-health-critical" : "text-muted-foreground";

  return (
    <Link to={`/tenant/${tenant.id}`} className="group block">
      <div className={`relative rounded-lg border ${getHealthRing(tenant.healthTier)} bg-card p-4 transition-all hover:bg-accent/50 hover:border-border`}>
        {tenant.hasAlert && (
          <div className="absolute right-3 top-3">
            <div className="flex items-center gap-1 rounded-full bg-health-critical/10 px-2 py-0.5">
              <AlertTriangle className="h-3 w-3 text-health-critical animate-pulse-glow" />
              <span className="text-[10px] font-medium text-health-critical">{tenant.alertCount}</span>
            </div>
          </div>
        )}

        <div className="mb-3">
          <h3 className="text-sm font-medium text-foreground truncate pr-12">{tenant.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{tenant.property}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className={`inline-flex items-center gap-1 rounded-md ${getHealthBg(tenant.healthTier)} px-2 py-1`}>
              <span className={`font-mono text-xl font-semibold ${getHealthColor(tenant.healthTier)}`}>
                {tenant.healthScore}
              </span>
            </div>
            <div className={`mt-1.5 flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              <span className="font-mono text-[11px] font-medium">
                {tenant.trendDelta > 0 ? "+" : ""}{tenant.trendDelta}
              </span>
              <span className="text-[10px] text-muted-foreground">90d</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
              {tenant.sector}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Sparkles, Calendar, FileText, Radio, Briefcase } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { tenants, getHealthHistory, getSignalBreakdown, getTimeline, getRiskSummary, type SignalCategory, type TimelineEvent } from "@/data/mockData";

const categoryIcons: Record<SignalCategory, typeof Briefcase> = {
  financial: Briefcase,
  news: Radio,
  legal: FileText,
  operational: Calendar,
};

const categoryColors: Record<SignalCategory, string> = {
  financial: "text-primary",
  news: "text-blue-400",
  legal: "text-amber-400",
  operational: "text-purple-400",
};

const impactColors: Record<string, string> = {
  positive: "border-health-excellent/40 bg-health-excellent/5",
  negative: "border-health-critical/40 bg-health-critical/5",
  neutral: "border-border bg-card",
};

function ScoreBar({ score, label, category }: { score: number; label: string; category: SignalCategory }) {
  const color = score >= 80 ? "bg-health-excellent" : score >= 60 ? "bg-health-good" : score >= 45 ? "bg-health-watch" : "bg-health-critical";
  const Icon = categoryIcons[category];
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={`h-3 w-3 ${categoryColors[category]}`} />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span className="font-mono text-xs font-medium text-foreground">{score}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function EventCard({ event }: { event: TimelineEvent }) {
  const Icon = categoryIcons[event.category];
  return (
    <div className={`rounded-lg border p-3 ${impactColors[event.impact]}`}>
      <div className="flex items-start gap-2">
        <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${categoryColors[event.category]}`} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">{event.title}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{event.description}</p>
          <span className="mt-1 inline-block font-mono text-[10px] text-muted-foreground">{event.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const tenant = tenants.find(t => t.id === id);

  if (!tenant) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">Tenant not found</div>
      </DashboardLayout>
    );
  }

  const history = getHealthHistory(tenant.id);
  const signals = getSignalBreakdown(tenant.id);
  const timeline = getTimeline(tenant.id);
  const riskSummary = getRiskSummary(tenant.id);

  const TrendIcon = tenant.trend === "up" ? TrendingUp : tenant.trend === "down" ? TrendingDown : Minus;
  const trendColor = tenant.trend === "up" ? "text-health-excellent" : tenant.trend === "down" ? "text-health-critical" : "text-muted-foreground";
  const scoreColor = tenant.healthTier === "excellent" ? "text-health-excellent" : tenant.healthTier === "good" ? "text-health-good" : tenant.healthTier === "watch" ? "text-health-watch" : "text-health-critical";

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Portfolio
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{tenant.name}</h1>
            <p className="text-xs text-muted-foreground">{tenant.property} · {tenant.sector} · {tenant.sqft.toLocaleString()} sqft</p>
          </div>
          <div className="text-right">
            <div className={`font-mono text-3xl font-bold ${scoreColor}`}>{tenant.healthScore}</div>
            <div className={`flex items-center justify-end gap-1 ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              <span className="font-mono text-xs">{tenant.trendDelta > 0 ? "+" : ""}{tenant.trendDelta} 90d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-4 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 text-xs font-medium text-muted-foreground">18-Month Health Score Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} tickLine={false} axisLine={false} interval={2} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} tickLine={false} axisLine={false} width={30} />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 6, fontSize: 11 }}
              labelStyle={{ color: "hsl(215, 12%, 50%)" }}
              itemStyle={{ color: "hsl(160, 60%, 45%)" }}
            />
            <Area type="monotone" dataKey="score" stroke="hsl(160, 60%, 45%)" fill="url(#scoreGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Signal Breakdown */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 text-xs font-medium text-muted-foreground">Signal Breakdown</h2>
          <div className="space-y-4">
            {signals.map(s => (
              <div key={s.category}>
                <ScoreBar score={s.score} label={s.label} category={s.category} />
                <div className="mt-1.5 ml-5 space-y-0.5">
                  {s.signals.map((sig, i) => (
                    <p key={i} className="text-[10px] text-muted-foreground">• {sig}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Risk Summary */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-xs font-medium text-primary">AI Risk Assessment</h2>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80">{riskSummary}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              Lease Expiry: {tenant.leaseExpiry}
            </span>
            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              Rent: ${(tenant.annualRent / 1000000).toFixed(1)}M/yr
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 text-xs font-medium text-muted-foreground">Key Events Timeline</h2>
        <div className="space-y-2">
          {timeline.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

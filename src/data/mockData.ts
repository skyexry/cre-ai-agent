export type HealthTier = "excellent" | "good" | "watch" | "critical";
export type Trend = "up" | "down" | "stable";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type SignalCategory = "financial" | "news" | "legal" | "operational";

export interface Tenant {
  id: string;
  name: string;
  property: string;
  sector: string;
  leaseExpiry: string;
  annualRent: number;
  sqft: number;
  healthScore: number;
  healthTier: HealthTier;
  trend: Trend;
  trendDelta: number;
  hasAlert: boolean;
  alertCount: number;
}

export interface HealthDataPoint {
  month: string;
  score: number;
}

export interface SignalBreakdown {
  category: SignalCategory;
  score: number;
  label: string;
  signals: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  category: SignalCategory;
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
}

export interface Alert {
  id: string;
  tenantId: string;
  tenantName: string;
  property: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  recommendedAction: string;
  timestamp: string;
  category: SignalCategory;
  isRead: boolean;
}

export const tenants: Tenant[] = [
  { id: "t1", name: "Meridian Capital Group", property: "One Liberty Plaza", sector: "Financial Services", leaseExpiry: "2027-06", annualRent: 4200000, sqft: 45000, healthScore: 87, healthTier: "excellent", trend: "up", trendDelta: 3, hasAlert: false, alertCount: 0 },
  { id: "t2", name: "Apex Logistics Inc.", property: "Harbor Distribution Center", sector: "Logistics", leaseExpiry: "2026-03", annualRent: 1800000, sqft: 120000, healthScore: 72, healthTier: "good", trend: "down", trendDelta: -5, hasAlert: true, alertCount: 2 },
  { id: "t3", name: "Solaris Health Systems", property: "Medical Arts Tower", sector: "Healthcare", leaseExpiry: "2029-11", annualRent: 3100000, sqft: 38000, healthScore: 91, healthTier: "excellent", trend: "up", trendDelta: 2, hasAlert: false, alertCount: 0 },
  { id: "t4", name: "RetailCo Holdings", property: "Galleria Mall - Unit 4A", sector: "Retail", leaseExpiry: "2025-08", annualRent: 950000, sqft: 22000, healthScore: 41, healthTier: "critical", trend: "down", trendDelta: -12, hasAlert: true, alertCount: 4 },
  { id: "t5", name: "TechForge Solutions", property: "Innovation Campus B2", sector: "Technology", leaseExpiry: "2028-02", annualRent: 2600000, sqft: 55000, healthScore: 78, healthTier: "good", trend: "stable", trendDelta: 0, hasAlert: false, alertCount: 0 },
  { id: "t6", name: "Greenfield Bio", property: "Research Park West", sector: "Life Sciences", leaseExpiry: "2030-05", annualRent: 3800000, sqft: 42000, healthScore: 84, healthTier: "excellent", trend: "up", trendDelta: 6, hasAlert: false, alertCount: 0 },
  { id: "t7", name: "Pacific Dining Group", property: "Market Street Commons", sector: "Food & Beverage", leaseExpiry: "2025-12", annualRent: 680000, sqft: 8500, healthScore: 53, healthTier: "watch", trend: "down", trendDelta: -8, hasAlert: true, alertCount: 3 },
  { id: "t8", name: "Atlas Law Partners", property: "Courthouse Square", sector: "Legal", leaseExpiry: "2027-09", annualRent: 2100000, sqft: 28000, healthScore: 66, healthTier: "watch", trend: "stable", trendDelta: -1, hasAlert: true, alertCount: 1 },
  { id: "t9", name: "Cornerstone Insurance", property: "Financial Center Tower", sector: "Insurance", leaseExpiry: "2028-07", annualRent: 3400000, sqft: 48000, healthScore: 82, healthTier: "excellent", trend: "up", trendDelta: 4, hasAlert: false, alertCount: 0 },
  { id: "t10", name: "NovaStar Media", property: "Creative Lofts", sector: "Media", leaseExpiry: "2026-01", annualRent: 1200000, sqft: 18000, healthScore: 58, healthTier: "watch", trend: "down", trendDelta: -6, hasAlert: true, alertCount: 2 },
  { id: "t11", name: "Summit Engineering", property: "Industrial Park North", sector: "Engineering", leaseExpiry: "2029-03", annualRent: 1500000, sqft: 65000, healthScore: 76, healthTier: "good", trend: "up", trendDelta: 2, hasAlert: false, alertCount: 0 },
  { id: "t12", name: "Crescent Pharma", property: "BioScience Center", sector: "Pharmaceutical", leaseExpiry: "2031-01", annualRent: 4500000, sqft: 52000, healthScore: 89, healthTier: "excellent", trend: "stable", trendDelta: 1, hasAlert: false, alertCount: 0 },
];

export function getHealthHistory(tenantId: string): HealthDataPoint[] {
  const tenant = tenants.find(t => t.id === tenantId);
  if (!tenant) return [];
  const base = tenant.healthScore;
  const months = ["Oct '23","Nov '23","Dec '23","Jan '24","Feb '24","Mar '24","Apr '24","May '24","Jun '24","Jul '24","Aug '24","Sep '24","Oct '24","Nov '24","Dec '24","Jan '25","Feb '25","Mar '25"];
  const noise = [0,-2,1,-3,2,-1,3,-4,1,2,-2,0,3,-1,2,1,-1,0];
  const trendAdj = tenant.trend === "up" ? 0.5 : tenant.trend === "down" ? -0.6 : 0;
  return months.map((month, i) => ({
    month,
    score: Math.max(10, Math.min(100, Math.round(base + noise[i] + (i - 9) * trendAdj)))
  }));
}

export function getSignalBreakdown(tenantId: string): SignalBreakdown[] {
  const tenant = tenants.find(t => t.id === tenantId);
  if (!tenant) return [];
  const s = tenant.healthScore;
  return [
    { category: "financial", score: Math.min(100, s + 3), label: "Financial Health", signals: ["Revenue growth +4.2% YoY", "Debt-to-equity ratio stable at 0.8x", "Current ratio 1.9x"] },
    { category: "news", score: Math.min(100, s - 5), label: "News Sentiment", signals: ["Positive coverage in industry press", "New partnership announcement", "CEO featured in conference panel"] },
    { category: "legal", score: Math.min(100, s + 1), label: "Legal Filings", signals: ["No pending litigation", "Regulatory compliance confirmed", "Lease amendment filed Q3"] },
    { category: "operational", score: Math.min(100, s - 2), label: "Operational", signals: ["Employee headcount stable", "Office utilization at 78%", "No reported facility issues"] },
  ];
}

export function getTimeline(tenantId: string): TimelineEvent[] {
  return [
    { id: "e1", date: "2025-03-15", category: "financial", title: "Q4 Earnings Released", description: "Revenue exceeded expectations by 8%. EBITDA margin improved to 22%.", impact: "positive" },
    { id: "e2", date: "2025-02-28", category: "news", title: "Strategic Partnership Announced", description: "Multi-year agreement with Fortune 500 company to expand service offerings.", impact: "positive" },
    { id: "e3", date: "2025-02-10", category: "legal", title: "Lease Amendment Filed", description: "Tenant requested expansion into adjacent 5,000 sqft space.", impact: "positive" },
    { id: "e4", date: "2025-01-20", category: "operational", title: "Workforce Reduction", description: "10% headcount reduction announced as part of restructuring initiative.", impact: "negative" },
    { id: "e5", date: "2024-12-05", category: "financial", title: "Credit Rating Affirmed", description: "S&P maintained BBB+ rating with stable outlook.", impact: "neutral" },
    { id: "e6", date: "2024-11-18", category: "news", title: "Industry Downturn Coverage", description: "Sector-wide coverage noting competitive pressures and margin compression.", impact: "negative" },
    { id: "e7", date: "2024-10-30", category: "legal", title: "Regulatory Compliance Review", description: "Passed annual regulatory audit with no material findings.", impact: "positive" },
    { id: "e8", date: "2024-09-15", category: "operational", title: "Office Utilization Report", description: "Badge-in data shows 78% average daily utilization across all floors.", impact: "neutral" },
  ];
}

export const alerts: Alert[] = [
  { id: "a1", tenantId: "t4", tenantName: "RetailCo Holdings", property: "Galleria Mall - Unit 4A", severity: "critical", title: "Credit Score Below Threshold", description: "Health score dropped below 45, indicating significant default risk. Score has declined 12 points in 90 days.", recommendedAction: "Initiate lease restructuring discussion. Review guarantor strength and security deposit adequacy.", timestamp: "2025-03-28T14:30:00Z", category: "financial", isRead: false },
  { id: "a2", tenantId: "t4", tenantName: "RetailCo Holdings", property: "Galleria Mall - Unit 4A", severity: "high", title: "Negative News Surge", description: "12 negative media mentions detected in past 7 days regarding store closures and executive departures.", recommendedAction: "Schedule tenant meeting to discuss operational outlook. Prepare contingency leasing plan.", timestamp: "2025-03-27T09:15:00Z", category: "news", isRead: false },
  { id: "a3", tenantId: "t7", tenantName: "Pacific Dining Group", property: "Market Street Commons", severity: "high", title: "Missed Rent Payment", description: "March rent payment not received by grace period deadline. Second late payment in 6 months.", recommendedAction: "Issue formal notice of default. Review lease termination provisions and replacement tenant pipeline.", timestamp: "2025-03-26T11:00:00Z", category: "financial", isRead: false },
  { id: "a4", tenantId: "t2", tenantName: "Apex Logistics Inc.", property: "Harbor Distribution Center", severity: "medium", title: "Key Customer Contract Loss", description: "Tenant lost logistics contract with major retailer representing ~15% of revenue.", recommendedAction: "Monitor upcoming quarterly financials. Request updated financial statements.", timestamp: "2025-03-25T16:45:00Z", category: "operational", isRead: true },
  { id: "a5", tenantId: "t10", tenantName: "NovaStar Media", property: "Creative Lofts", severity: "medium", title: "Sublease Listing Detected", description: "Tenant listing 40% of leased space for sublease on commercial real estate platforms.", recommendedAction: "Confirm sublease complies with lease terms. Assess long-term space needs with tenant.", timestamp: "2025-03-24T08:30:00Z", category: "operational", isRead: true },
  { id: "a6", tenantId: "t7", tenantName: "Pacific Dining Group", property: "Market Street Commons", severity: "high", title: "Health Department Violation", description: "Two health code violations reported at primary restaurant location.", recommendedAction: "Request remediation plan. Review insurance coverage and liability provisions.", timestamp: "2025-03-23T13:20:00Z", category: "legal", isRead: true },
  { id: "a7", tenantId: "t4", tenantName: "RetailCo Holdings", property: "Galleria Mall - Unit 4A", severity: "critical", title: "Bankruptcy Filing Rumor", description: "Industry sources report potential Chapter 11 filing within 60 days.", recommendedAction: "Engage legal counsel immediately. Begin replacement tenant search. Review priority of claims.", timestamp: "2025-03-22T10:00:00Z", category: "legal", isRead: true },
  { id: "a8", tenantId: "t8", tenantName: "Atlas Law Partners", property: "Courthouse Square", severity: "low", title: "Partner Departure", description: "Senior managing partner announced departure. Potential impact on firm revenue.", recommendedAction: "Monitor for further personnel changes. No immediate action required.", timestamp: "2025-03-20T15:00:00Z", category: "news", isRead: true },
  { id: "a9", tenantId: "t10", tenantName: "NovaStar Media", property: "Creative Lofts", severity: "medium", title: "Advertising Revenue Decline", description: "Industry reports indicate 20% YoY decline in digital advertising spend affecting tenant's sector.", recommendedAction: "Request updated financial projections. Consider early lease renewal at adjusted terms.", timestamp: "2025-03-18T09:00:00Z", category: "financial", isRead: true },
  { id: "a10", tenantId: "t2", tenantName: "Apex Logistics Inc.", property: "Harbor Distribution Center", severity: "low", title: "Fleet Maintenance Concerns", description: "DOT records show increased vehicle maintenance issues in tenant's fleet.", recommendedAction: "Note for next tenant review. No action required unless pattern continues.", timestamp: "2025-03-15T14:00:00Z", category: "operational", isRead: true },
  { id: "a11", tenantId: "t7", tenantName: "Pacific Dining Group", property: "Market Street Commons", severity: "high", title: "Co-founder Lawsuit Filed", description: "Lawsuit filed by co-founder alleging mismanagement and seeking dissolution.", recommendedAction: "Review lease provisions regarding change of control. Consult legal on implications.", timestamp: "2025-03-12T11:30:00Z", category: "legal", isRead: true },
  { id: "a12", tenantId: "t4", tenantName: "RetailCo Holdings", property: "Galleria Mall - Unit 4A", severity: "critical", title: "Foot Traffic Collapse", description: "In-store foot traffic down 45% YoY based on mobile location data analysis.", recommendedAction: "Evaluate co-tenancy clause implications. Prepare for potential vacancy.", timestamp: "2025-03-10T08:00:00Z", category: "operational", isRead: true },
];

export function getRiskSummary(tenantId: string): string {
  const summaries: Record<string, string> = {
    t1: "Meridian Capital Group maintains a strong credit profile with consistent revenue growth and a diversified client base. The firm's low leverage and stable cash flows support continued lease performance. No material risks identified. Recommend maintaining standard monitoring cadence.",
    t2: "Apex Logistics presents a moderately elevated risk profile following the loss of a key customer contract. While the company maintains adequate liquidity and a diversified revenue base, the 15% revenue exposure warrants closer monitoring. Lease expiry in March 2026 creates additional refinancing risk. Recommend quarterly financial review.",
    t3: "Solaris Health Systems demonstrates exceptional financial health driven by long-term government contracts and growing demand for outpatient services. Strong balance sheet with minimal debt. Extended lease through 2029 provides significant runway. Minimal risk exposure across all signal categories.",
    t4: "RetailCo Holdings represents the highest-risk tenant in the portfolio. Multiple converging risk factors: accelerating revenue decline, store closure program, negative media coverage, and rumored Chapter 11 filing. Health score trajectory suggests potential default within 6-12 months. Immediate action recommended: engage legal counsel, initiate replacement tenant search, and review guarantor obligations.",
    t5: "TechForge Solutions maintains a stable risk profile with predictable SaaS recurring revenue and strong retention metrics. Recent growth in enterprise clients supports medium-term outlook. No significant legal or operational concerns. Standard monitoring appropriate.",
    t7: "Pacific Dining Group faces elevated operational and financial risks. Missed rent payments, health code violations, and co-founder litigation create a challenging outlook. While the restaurant sector shows broad recovery trends, this tenant's specific issues warrant enhanced monitoring and early engagement on lease terms.",
    t8: "Atlas Law Partners faces moderate disruption risk from senior partner departure. While the firm has historically maintained stable revenues, key-person risk in professional services warrants monitoring. Remaining partnership structure appears adequate. Recommend semi-annual review.",
    t10: "NovaStar Media operates in a structurally challenged sector with declining advertising revenues. The sublease listing of 40% of space signals potential contraction. Short remaining lease term (Jan 2026) provides natural exit point. Consider proactive re-leasing strategy.",
  };
  return summaries[tenantId] || "Tenant maintains an adequate risk profile based on available signals. Financial performance is in line with sector averages. No material legal or operational concerns identified. Recommend standard quarterly monitoring with next review scheduled for Q2 2025.";
}

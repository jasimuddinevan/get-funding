import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye, Heart, TrendingUp, DollarSign, Users, Zap,
  BarChart3, ArrowUpRight, ArrowDownRight, Minus, Loader2,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Business {
  id: string;
  name: string;
  funding_goal: number | null;
  funded_amount: number | null;
  created_at: string;
}

interface BizAnalytics {
  businessId: string;
  businessName: string;
  investorCount: number;
  watchlistCount: number;
  totalInvested: number;
  fundingGoal: number;
  fundingPercent: number;
  avgInvestment: number;
  recentInvestments: { date: string; amount: number }[];
  velocityTrend: "up" | "down" | "flat";
  daysActive: number;
  dailyVelocity: number;
}

interface Props {
  businesses: Business[];
  userId: string;
}

const BusinessAnalyticsSection = ({ businesses, userId }: Props) => {
  const [analytics, setAnalytics] = useState<BizAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const approvedBiz = businesses.filter(
    (b) => (b as any).status === "approved"
  );

  useEffect(() => {
    if (approvedBiz.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      const bizIds = approvedBiz.map((b) => b.id);

      const [investRes, watchRes] = await Promise.all([
        supabase
          .from("investments")
          .select("id, business_id, amount, invested_at, investor_id, status")
          .in("business_id", bizIds)
          .in("status", ["confirmed", "pending"]),
        supabase
          .from("watchlists")
          .select("id, business_id")
          .in("business_id", bizIds),
      ]);

      const investments = investRes.data ?? [];
      const watchlists = watchRes.data ?? [];

      const now = new Date();

      const result: BizAnalytics[] = approvedBiz.map((biz) => {
        const bizInvestments = investments.filter((inv) => inv.business_id === biz.id);
        const bizWatchlists = watchlists.filter((w) => w.business_id === biz.id);
        const uniqueInvestors = new Set(bizInvestments.map((inv) => inv.investor_id)).size;
        const totalInvested = bizInvestments.reduce((s, inv) => s + inv.amount, 0);
        const avgInvestment = bizInvestments.length > 0 ? totalInvested / bizInvestments.length : 0;
        const fundingGoal = biz.funding_goal ?? 0;
        const fundingPercent = fundingGoal > 0 ? Math.min(100, Math.round((totalInvested / fundingGoal) * 100)) : 0;

        const createdAt = new Date(biz.created_at);
        const daysActive = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
        const dailyVelocity = totalInvested / daysActive;

        // Build chart data: aggregate investments by week
        const weekMap = new Map<string, number>();
        bizInvestments.forEach((inv) => {
          const d = new Date(inv.invested_at);
          const weekStart = new Date(d);
          weekStart.setDate(d.getDate() - d.getDay());
          const key = weekStart.toISOString().slice(0, 10);
          weekMap.set(key, (weekMap.get(key) ?? 0) + inv.amount);
        });

        const recentInvestments = Array.from(weekMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-8)
          .map(([date, amount]) => ({ date, amount }));

        // Determine trend from last two data points
        let velocityTrend: "up" | "down" | "flat" = "flat";
        if (recentInvestments.length >= 2) {
          const last = recentInvestments[recentInvestments.length - 1].amount;
          const prev = recentInvestments[recentInvestments.length - 2].amount;
          velocityTrend = last > prev ? "up" : last < prev ? "down" : "flat";
        }

        return {
          businessId: biz.id,
          businessName: biz.name,
          investorCount: uniqueInvestors,
          watchlistCount: bizWatchlists.length,
          totalInvested,
          fundingGoal,
          fundingPercent,
          avgInvestment,
          recentInvestments,
          velocityTrend,
          daysActive,
          dailyVelocity,
        };
      });

      setAnalytics(result);
      setLoading(false);
    };

    fetchAnalytics();
  }, [approvedBiz.length]);

  if (approvedBiz.length === 0) return null;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
    if (trend === "up") return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === "down") return <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8"
    >
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" /> Business Analytics
      </h3>

      <div className="space-y-4">
        {analytics.map((a) => (
          <Card key={a.businessId} className="border-border/40 overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="px-5 pt-4 pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-base font-semibold text-foreground">{a.businessName}</h4>
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Zap className="w-3 h-3" /> {a.daysActive} days active
                  </Badge>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/30">
                <MetricCell
                  icon={<Users className="w-4 h-4 text-primary" />}
                  label="Investors"
                  value={a.investorCount.toString()}
                />
                <MetricCell
                  icon={<Heart className="w-4 h-4 text-red-400" />}
                  label="Watchlisted"
                  value={a.watchlistCount.toString()}
                />
                <MetricCell
                  icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                  label="Avg. Investment"
                  value={a.avgInvestment > 0 ? `৳${(a.avgInvestment / 1000).toFixed(0)}K` : "—"}
                />
                <MetricCell
                  icon={<TrendingUp className="w-4 h-4 text-primary" />}
                  label="Daily Velocity"
                  value={a.dailyVelocity > 0 ? `৳${(a.dailyVelocity / 1000).toFixed(1)}K` : "—"}
                  suffix={<TrendIcon trend={a.velocityTrend} />}
                />
              </div>

              {/* Funding velocity chart */}
              {a.recentInvestments.length > 1 && (
                <div className="px-5 py-4 border-t border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Funding Velocity (Weekly)</span>
                    <span className="text-xs text-muted-foreground">
                      {a.fundingPercent}% funded — ৳{(a.totalInvested / 1000000).toFixed(2)}M / ৳{(a.fundingGoal / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={a.recentInvestments}>
                        <defs>
                          <linearGradient id={`grad-${a.businessId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`}
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={false}
                          tickLine={false}
                          width={50}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                          formatter={(value: number) => [`৳${value.toLocaleString()}`, "Invested"]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill={`url(#grad-${a.businessId})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Empty state for no investments yet */}
              {a.recentInvestments.length <= 1 && (
                <div className="px-5 py-6 border-t border-border/30 text-center">
                  <Eye className="w-5 h-5 mx-auto text-muted-foreground mb-1.5" />
                  <p className="text-xs text-muted-foreground">
                    {a.investorCount === 0
                      ? "No investments yet — your listing is live and visible to investors."
                      : "Not enough data for a chart yet. More investments will unlock velocity tracking."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

const MetricCell = ({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: React.ReactNode;
}) => (
  <div className="px-4 py-3">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="font-display text-lg font-bold text-foreground">{value}</span>
      {suffix}
    </div>
  </div>
);

export default BusinessAnalyticsSection;

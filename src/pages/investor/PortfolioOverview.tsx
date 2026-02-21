import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Building2, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Investment {
  id: string;
  amount: number;
  revenue_share_pct: number;
  status: string;
  invested_at: string;
  business_id: string;
  businesses?: {
    name: string;
    industry: string | null;
    location: string | null;
    funding_goal: number | null;
    funded_amount: number | null;
  } | null;
}

const PortfolioOverview = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("investments")
        .select("*, businesses(name, industry, location, funding_goal, funded_amount)")
        .eq("investor_id", user.id);
      setInvestments((data as Investment[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const activeInvestments = investments.filter((i) => i.status === "active");
  const avgRevShare = activeInvestments.length
    ? activeInvestments.reduce((s, i) => s + i.revenue_share_pct, 0) / activeInvestments.length
    : 0;

  // Mock earnings data since we don't have a payouts table yet
  const estimatedMonthlyEarning = totalInvested * (avgRevShare / 100) / 12;

  const stats = [
    {
      label: "Total Invested",
      value: `৳${totalInvested.toLocaleString()}`,
      icon: DollarSign,
      change: "+12%",
      up: true,
    },
    {
      label: "Active Investments",
      value: activeInvestments.length.toString(),
      icon: Building2,
      change: `${investments.length} total`,
      up: true,
    },
    {
      label: "Avg. Revenue Share",
      value: `${avgRevShare.toFixed(1)}%`,
      icon: TrendingUp,
      change: "weighted avg",
      up: true,
    },
    {
      label: "Est. Monthly Return",
      value: `৳${Math.round(estimatedMonthlyEarning).toLocaleString()}`,
      icon: BarChart3,
      change: "projected",
      up: true,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Portfolio Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your investments and returns.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-border/40">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-500" : "text-red-500"}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Investments */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg">Active Investments</CardTitle>
        </CardHeader>
        <CardContent>
          {activeInvestments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No active investments yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Browse businesses to start investing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeInvestments.map((inv) => {
                const biz = inv.businesses;
                const fundedPct = biz?.funding_goal
                  ? Math.min(((biz.funded_amount ?? 0) / biz.funding_goal) * 100, 100)
                  : 0;
                return (
                  <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm truncate">{biz?.name ?? "Unknown"}</h4>
                        <Badge variant="secondary" className="text-[10px] shrink-0">{biz?.industry}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{biz?.location}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">৳{inv.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Invested</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-primary">{inv.revenue_share_pct}%</div>
                        <div className="text-xs text-muted-foreground">Rev. Share</div>
                      </div>
                      <div className="w-24">
                        <div className="text-xs text-muted-foreground mb-1">{Math.round(fundedPct)}% Funded</div>
                        <Progress value={fundedPct} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;

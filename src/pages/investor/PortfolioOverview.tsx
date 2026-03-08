import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp, DollarSign, Building2, BarChart3, ArrowUpRight,
  ArrowDownRight, Compass, Clock, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    const fetchData = async () => {
      const { data } = await supabase
        .from("investments")
        .select("*, businesses(name, industry, location, funding_goal, funded_amount)")
        .eq("investor_id", user.id);
      setInvestments((data as Investment[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const activeInvestments = investments.filter((i) => i.status === "active");
  const avgRevShare = activeInvestments.length
    ? activeInvestments.reduce((s, i) => s + i.revenue_share_pct, 0) / activeInvestments.length
    : 0;
  const estimatedMonthlyEarning = totalInvested * (avgRevShare / 100) / 12;

  const stats = [
    {
      label: "Total Invested",
      value: `৳${totalInvested.toLocaleString()}`,
      icon: DollarSign,
      change: "+12%",
      up: true,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Active Investments",
      value: activeInvestments.length.toString(),
      icon: Building2,
      change: `${investments.length} total`,
      up: true,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Avg. Revenue Share",
      value: `${avgRevShare.toFixed(1)}%`,
      icon: TrendingUp,
      change: "weighted avg",
      up: true,
      gradient: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Est. Monthly Return",
      value: `৳${Math.round(estimatedMonthlyEarning).toLocaleString()}`,
      icon: BarChart3,
      change: "projected",
      up: true,
      gradient: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
        <div className="h-5 w-48 bg-muted/60 animate-pulse rounded" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.h1
            className="font-display text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {greeting()}, Investor 👋
          </motion.h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's how your portfolio is performing today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link to="/explore">
              <Compass className="w-4 h-4" /> Explore Deals
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link to="/investor/investments">
              <Clock className="w-4 h-4" /> History
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className="border-border/40 overflow-hidden relative group hover:border-border/60 transition-colors">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
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
      <Card className="border-border/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Active Investments
          </CardTitle>
          {activeInvestments.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeInvestments.length} active
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {activeInvestments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No active investments yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                Start building your portfolio by exploring vetted businesses ready for investment.
              </p>
              <Button size="sm" asChild>
                <Link to="/explore">Browse Businesses</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeInvestments.map((inv, i) => {
                const biz = inv.businesses;
                const fundedPct = biz?.funding_goal
                  ? Math.min(((biz.funded_amount ?? 0) / biz.funding_goal) * 100, 100)
                  : 0;
                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={`/business/${inv.business_id}`}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/30 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                            {biz?.name ?? "Unknown"}
                          </h4>
                          {biz?.industry && (
                            <Badge variant="secondary" className="text-[10px] shrink-0">{biz.industry}</Badge>
                          )}
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
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PortfolioOverview;

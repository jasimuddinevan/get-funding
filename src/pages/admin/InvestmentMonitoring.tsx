import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, DollarSign, Building2, Calendar, TrendingUp, Users } from "lucide-react";

interface InvestmentRecord {
  id: string;
  amount: number;
  revenue_share_pct: number;
  status: string;
  invested_at: string;
  investor_id: string;
  businesses?: { name: string; industry: string | null } | null;
  investor_profile?: { full_name: string | null } | null;
}

const statusColor: Record<string, string> = {
  active: "bg-green-500/15 text-green-600 border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  completed: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  cancelled: "bg-red-500/15 text-red-600 border-red-500/30",
};

const InvestmentMonitoring = () => {
  const [investments, setInvestments] = useState<InvestmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: investData } = await supabase
        .from("investments")
        .select("*, businesses(name, industry)")
        .order("invested_at", { ascending: false });

      const invs = (investData ?? []) as InvestmentRecord[];

      // Fetch investor names
      const investorIds = [...new Set(invs.map((i) => i.investor_id))];
      if (investorIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", investorIds);
        const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p.full_name]));
        invs.forEach((inv) => {
          inv.investor_profile = { full_name: profileMap.get(inv.investor_id) ?? null };
        });
      }

      setInvestments(invs);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalAmount = investments.reduce((s, i) => s + i.amount, 0);
  const activeCount = investments.filter((i) => i.status === "active").length;
  const uniqueInvestors = new Set(investments.map((i) => i.investor_id)).size;
  const uniqueBusinesses = new Set(investments.map((i) => i.businesses?.name)).size;

  const summaryCards = [
    { label: "Total Volume", value: `৳${totalAmount.toLocaleString()}`, icon: DollarSign },
    { label: "Active Investments", value: activeCount, icon: TrendingUp },
    { label: "Unique Investors", value: uniqueInvestors, icon: Users },
    { label: "Businesses Funded", value: uniqueBusinesses, icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Investment Monitoring</h1>
        <p className="text-muted-foreground text-sm mt-1">Track all investments across the platform.</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass-card border-border/40">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-foreground">{card.value}</div>
                  <div className="text-xs text-muted-foreground">{card.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Investments Table */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            All Investments
            <Badge variant="secondary" className="text-xs">{investments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No investments recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Investor</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Business</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Rev. Share</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv, i) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-3 text-foreground">{inv.investor_profile?.full_name ?? inv.investor_id.slice(0, 8) + "…"}</td>
                      <td className="py-3">
                        <span className="text-foreground">{inv.businesses?.name ?? "—"}</span>
                        {inv.businesses?.industry && (
                          <span className="text-xs text-muted-foreground ml-1.5">({inv.businesses.industry})</span>
                        )}
                      </td>
                      <td className="py-3 font-medium text-foreground">৳{inv.amount.toLocaleString()}</td>
                      <td className="py-3 text-primary font-medium">{inv.revenue_share_pct}%</td>
                      <td className="py-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(inv.invested_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge className={`text-[10px] capitalize border ${statusColor[inv.status] ?? ""}`}>
                          {inv.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentMonitoring;

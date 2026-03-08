import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { History, Calendar, DollarSign, Filter } from "lucide-react";

interface Investment {
  id: string;
  amount: number;
  revenue_share_pct: number;
  status: string;
  invested_at: string;
  businesses?: {
    name: string;
    industry: string | null;
  } | null;
}

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  completed: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
};

const InvestmentHistory = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("investments")
        .select("*, businesses(name, industry)")
        .eq("investor_id", user.id)
        .order("invested_at", { ascending: false });
      setInvestments((data as Investment[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const filtered = filter === "all"
    ? investments
    : investments.filter((i) => i.status === filter);

  const statuses = ["all", ...Array.from(new Set(investments.map((i) => i.status)))];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Investment History</h1>
          <p className="text-muted-foreground text-sm mt-1">
            A complete record of all your investments.
          </p>
        </div>
        {investments.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {statuses.map((s) => (
              <Button
                key={s}
                variant={filter === s ? "default" : "outline"}
                size="sm"
                className="capitalize text-xs h-8"
                onClick={() => setFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> All Investments
            {filtered.length > 0 && (
              <Badge variant="secondary" className="text-xs ml-auto">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {filter !== "all" ? "No matching investments" : "No investments yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {filter !== "all"
                  ? "Try changing the filter above."
                  : "Your investment history will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">
                      {inv.businesses?.name ?? "Unknown Business"}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      {inv.businesses?.industry && (
                        <Badge variant="secondary" className="text-[10px]">
                          {inv.businesses.industry}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(inv.invested_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-foreground text-sm">
                        ৳{inv.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-primary">{inv.revenue_share_pct}% share</div>
                    </div>
                    <Badge className={`text-[10px] capitalize ${statusColor[inv.status] ?? ""}`}>
                      {inv.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvestmentHistory;

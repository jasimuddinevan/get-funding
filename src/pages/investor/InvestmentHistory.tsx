import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { History, Calendar, DollarSign } from "lucide-react";

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
  active: "bg-green-500/15 text-green-600 border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  completed: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  cancelled: "bg-red-500/15 text-red-600 border-red-500/30",
};

const InvestmentHistory = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("investments")
        .select("*, businesses(name, industry)")
        .eq("investor_id", user.id)
        .order("invested_at", { ascending: false });
      setInvestments((data as Investment[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Investment History</h1>
        <p className="text-muted-foreground text-sm mt-1">A complete record of all your investments.</p>
      </div>

      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> All Investments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No investments yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Your investment history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {investments.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-secondary/20"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">{inv.businesses?.name ?? "Unknown Business"}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      {inv.businesses?.industry && (
                        <Badge variant="secondary" className="text-[10px]">{inv.businesses.industry}</Badge>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(inv.invested_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-foreground text-sm">৳{inv.amount.toLocaleString()}</div>
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
    </div>
  );
};

export default InvestmentHistory;

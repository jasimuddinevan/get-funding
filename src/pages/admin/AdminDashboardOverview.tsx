import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Users, DollarSign, Clock, CheckCircle2, XCircle, FileSearch,
  ArrowRight, TrendingUp, AlertCircle,
} from "lucide-react";

interface DashboardStats {
  totalBusinesses: number;
  pendingReviews: number;
  approvedBusinesses: number;
  rejectedBusinesses: number;
  totalInvestors: number;
  totalInvested: number;
  totalBusinessOwners: number;
  recentBusinesses: Array<{
    id: string;
    name: string;
    status: string;
    industry: string | null;
    created_at: string;
  }>;
}

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [businessesRes, rolesRes, investmentsRes, recentRes] = await Promise.all([
          supabase.from("businesses").select("status"),
          supabase.from("user_roles").select("role"),
          supabase.from("investments").select("amount"),
          supabase
            .from("businesses")
            .select("id, name, status, industry, created_at")
            .order("created_at", { ascending: false })
            .limit(8),
        ]);

        if (businessesRes.error) throw businessesRes.error;
        if (rolesRes.error) throw rolesRes.error;

        const businesses = businessesRes.data ?? [];
        const roles = rolesRes.data ?? [];
        const investments = investmentsRes.data ?? [];

        setStats({
          totalBusinesses: businesses.length,
          pendingReviews: businesses.filter((b) => b.status === "pending" || b.status === "under_review").length,
          approvedBusinesses: businesses.filter((b) => b.status === "approved").length,
          rejectedBusinesses: businesses.filter((b) => b.status === "rejected").length,
          totalInvestors: roles.filter((r) => r.role === "investor").length,
          totalBusinessOwners: roles.filter((r) => r.role === "business_owner").length,
          totalInvested: investments.reduce((s, i) => s + (i.amount ?? 0), 0),
          recentBusinesses: (recentRes.data ?? []) as DashboardStats["recentBusinesses"],
        });
      } catch (err: any) {
        setError(err.message ?? "Failed to load dashboard data");
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
        <div className="h-5 w-48 bg-muted/60 animate-pulse rounded" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "Pending Reviews", value: stats.pendingReviews, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "from-amber-500/20 to-amber-500/5", urgent: stats.pendingReviews > 0 },
    { label: "Approved", value: stats.approvedBusinesses, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "from-emerald-500/20 to-emerald-500/5" },
    { label: "Total Investors", value: stats.totalInvestors, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "from-blue-500/20 to-blue-500/5" },
    { label: "Total Invested", value: `৳${stats.totalInvested.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "from-primary/20 to-primary/5" },
    { label: "Business Owners", value: stats.totalBusinessOwners, icon: Building2, color: "text-violet-600 dark:text-violet-400", bg: "from-violet-500/20 to-violet-500/5" },
    { label: "Rejected", value: stats.rejectedBusinesses, icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "from-red-500/20 to-red-500/5" },
  ];

  const statusIcon: Record<string, { icon: typeof Clock; color: string }> = {
    pending: { icon: Clock, color: "text-amber-500" },
    under_review: { icon: FileSearch, color: "text-blue-500" },
    approved: { icon: CheckCircle2, color: "text-emerald-500" },
    rejected: { icon: XCircle, color: "text-red-500" },
    draft: { icon: Clock, color: "text-muted-foreground" },
    suspended: { icon: XCircle, color: "text-orange-500" },
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform overview &amp; management.
          </p>
        </div>
        {stats.pendingReviews > 0 && (
          <Button size="sm" className="gap-2 self-start sm:self-auto" asChild>
            <Link to="/admin/reviews">
              <Clock className="w-4 h-4" />
              {stats.pendingReviews} pending review{stats.pendingReviews > 1 ? "s" : ""}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className={`border-border/40 overflow-hidden relative group hover:border-border/60 transition-colors ${card.urgent ? "ring-1 ring-amber-500/30" : ""}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-5 flex items-center gap-4 relative">
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-6 h-6" />
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

      {/* Recent Submissions */}
      <Card className="border-border/40">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Recent Submissions
            </h3>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
              <Link to="/admin/reviews">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>
          {stats.recentBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No businesses submitted yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Applications will appear here when business owners submit them.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentBusinesses.map((biz, i) => {
                const si = statusIcon[biz.status] ?? statusIcon.draft;
                return (
                  <motion.div
                    key={biz.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <si.icon className={`w-4 h-4 shrink-0 ${si.color}`} />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-foreground truncate block">{biz.name}</span>
                        {biz.industry && (
                          <span className="text-xs text-muted-foreground">{biz.industry}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        className={`text-[10px] capitalize border ${
                          biz.status === "pending" ? "bg-amber-500/15 text-amber-600 border-amber-500/30" :
                          biz.status === "approved" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" :
                          biz.status === "rejected" ? "bg-red-500/15 text-red-600 border-red-500/30" :
                          "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {biz.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {new Date(biz.created_at).toLocaleDateString()}
                      </span>
                    </div>
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

export default AdminDashboardOverview;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Users, DollarSign, Clock, CheckCircle2, XCircle, FileSearch,
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

  useEffect(() => {
    const fetchStats = async () => {
      const [businessesRes, rolesRes, investmentsRes, recentRes] = await Promise.all([
        supabase.from("businesses").select("status"),
        supabase.from("user_roles").select("role"),
        supabase.from("investments").select("amount"),
        supabase
          .from("businesses")
          .select("id, name, status, industry, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

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
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Pending Reviews", value: stats.pendingReviews, icon: Clock, color: "text-yellow-500" },
    { label: "Approved Businesses", value: stats.approvedBusinesses, icon: CheckCircle2, color: "text-green-500" },
    { label: "Total Investors", value: stats.totalInvestors, icon: Users, color: "text-blue-500" },
    { label: "Total Invested", value: `৳${stats.totalInvested.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Business Owners", value: stats.totalBusinessOwners, icon: Building2, color: "text-purple-500" },
    { label: "Rejected", value: stats.rejectedBusinesses, icon: XCircle, color: "text-red-500" },
  ];

  const statusIcon: Record<string, { icon: typeof Clock; color: string }> = {
    pending: { icon: Clock, color: "text-yellow-500" },
    under_review: { icon: FileSearch, color: "text-blue-500" },
    approved: { icon: CheckCircle2, color: "text-green-500" },
    rejected: { icon: XCircle, color: "text-red-500" },
    draft: { icon: Clock, color: "text-muted-foreground" },
    suspended: { icon: XCircle, color: "text-orange-500" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of platform activity.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass-card border-border/40">
              <CardContent className="p-5 flex items-center gap-4">
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
      <Card className="glass-card border-border/40">
        <CardContent className="p-5">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Recent Submissions</h3>
          {stats.recentBusinesses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No businesses submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentBusinesses.map((biz) => {
                const si = statusIcon[biz.status] ?? statusIcon.draft;
                return (
                  <div key={biz.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                    <div className="flex items-center gap-3">
                      <si.icon className={`w-4 h-4 ${si.color}`} />
                      <div>
                        <span className="text-sm font-medium text-foreground">{biz.name}</span>
                        {biz.industry && (
                          <span className="text-xs text-muted-foreground ml-2">{biz.industry}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium capitalize ${si.color}`}>{biz.status.replace("_", " ")}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(biz.created_at).toLocaleDateString()}
                      </span>
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

export default AdminDashboardOverview;

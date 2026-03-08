import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Users, DollarSign, Clock, CheckCircle2, XCircle, FileSearch,
  ArrowRight, TrendingUp, AlertCircle, BarChart3, CreditCard, Eye,
  Activity, ArrowUpRight, Loader2, ShieldCheck, Ban,
} from "lucide-react";

interface DashboardStats {
  totalBusinesses: number;
  pendingReviews: number;
  underReview: number;
  approvedBusinesses: number;
  rejectedBusinesses: number;
  suspendedBusinesses: number;
  totalInvestors: number;
  totalInvested: number;
  activeInvestments: number;
  pendingPayments: number;
  totalBusinessOwners: number;
  totalUsers: number;
  recentBusinesses: Array<{
    id: string;
    name: string;
    status: string;
    industry: string | null;
    created_at: string;
  }>;
  recentInvestments: Array<{
    id: string;
    amount: number;
    status: string;
    created_at: string;
    business_name: string;
  }>;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-amber-500", bg: "bg-amber-500/15 border-amber-500/30", icon: Clock },
  under_review: { label: "Under Review", color: "text-blue-500", bg: "bg-blue-500/15 border-blue-500/30", icon: FileSearch },
  approved: { label: "Approved", color: "text-emerald-500", bg: "bg-emerald-500/15 border-emerald-500/30", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-500", bg: "bg-red-500/15 border-red-500/30", icon: XCircle },
  suspended: { label: "Suspended", color: "text-orange-500", bg: "bg-orange-500/15 border-orange-500/30", icon: Ban },
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted border-border", icon: Clock },
};

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [businessesRes, rolesRes, investmentsRes, recentBizRes, recentInvRes, paymentsRes] = await Promise.all([
          supabase.from("businesses").select("status"),
          supabase.from("user_roles").select("role"),
          supabase.from("investments").select("amount, status"),
          supabase.from("businesses").select("id, name, status, industry, created_at").order("created_at", { ascending: false }).limit(6),
          supabase.from("investments").select("id, amount, status, created_at, business_id").order("created_at", { ascending: false }).limit(5),
          supabase.from("investments").select("id", { count: "exact", head: true }).eq("status", "pending_payment"),
        ]);

        if (businessesRes.error) throw businessesRes.error;
        if (rolesRes.error) throw rolesRes.error;

        const businesses = businessesRes.data ?? [];
        const roles = rolesRes.data ?? [];
        const investments = investmentsRes.data ?? [];
        const recentInvestments = recentInvRes.data ?? [];

        // Fetch business names for recent investments
        const bizIds = [...new Set(recentInvestments.map((inv: any) => inv.business_id))];
        let bizNameMap = new Map<string, string>();
        if (bizIds.length > 0) {
          const { data: bizNames } = await supabase.from("businesses").select("id, name").in("id", bizIds);
          bizNameMap = new Map((bizNames ?? []).map((b: any) => [b.id, b.name]));
        }

        setStats({
          totalBusinesses: businesses.length,
          pendingReviews: businesses.filter((b) => b.status === "pending").length,
          underReview: businesses.filter((b) => b.status === "under_review").length,
          approvedBusinesses: businesses.filter((b) => b.status === "approved").length,
          rejectedBusinesses: businesses.filter((b) => b.status === "rejected").length,
          suspendedBusinesses: businesses.filter((b) => b.status === "suspended").length,
          totalInvestors: roles.filter((r) => r.role === "investor").length,
          totalBusinessOwners: roles.filter((r) => r.role === "business_owner").length,
          totalUsers: roles.length,
          totalInvested: investments.reduce((s, i) => s + (i.amount ?? 0), 0),
          activeInvestments: investments.filter((i) => i.status === "active").length,
          pendingPayments: paymentsRes.count ?? 0,
          recentBusinesses: (recentBizRes.data ?? []) as DashboardStats["recentBusinesses"],
          recentInvestments: recentInvestments.map((inv: any) => ({
            id: inv.id,
            amount: inv.amount,
            status: inv.status,
            created_at: inv.created_at,
            business_name: bizNameMap.get(inv.business_id) ?? "Unknown",
          })),
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-80 bg-muted animate-pulse rounded-xl" />
          <div className="h-80 bg-muted animate-pulse rounded-xl" />
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

  const topCards = [
    {
      label: "Pending Applications",
      value: stats.pendingReviews + stats.underReview,
      icon: Clock,
      color: "text-amber-500",
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      link: "/admin/reviews",
      urgent: stats.pendingReviews + stats.underReview > 0,
    },
    {
      label: "Active Businesses",
      value: stats.approvedBusinesses,
      icon: CheckCircle2,
      color: "text-emerald-500",
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      link: "/admin/businesses",
    },
    {
      label: "Total Invested",
      value: `৳${(stats.totalInvested / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-primary",
      gradient: "from-primary/10 via-primary/5 to-transparent",
      link: "/admin/investments",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      link: "/admin/users",
    },
  ];

  const secondaryStats = [
    { label: "Investors", value: stats.totalInvestors, icon: TrendingUp, color: "text-primary" },
    { label: "Business Owners", value: stats.totalBusinessOwners, icon: Building2, color: "text-violet-500" },
    { label: "Active Investments", value: stats.activeInvestments, icon: Activity, color: "text-emerald-500" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: CreditCard, color: "text-amber-500", link: "/admin/payments" },
  ];

  const quickActions = [
    { label: "Review Applications", desc: `${stats.pendingReviews + stats.underReview} waiting`, icon: FileSearch, link: "/admin/reviews", variant: stats.pendingReviews > 0 ? "default" as const : "outline" as const },
    { label: "Manage Users", desc: `${stats.totalUsers} total`, icon: Users, link: "/admin/users", variant: "outline" as const },
    { label: "View Investments", desc: `${stats.activeInvestments} active`, icon: BarChart3, link: "/admin/investments", variant: "outline" as const },
    { label: "Payment Approvals", desc: `${stats.pendingPayments} pending`, icon: CreditCard, link: "/admin/payments", variant: stats.pendingPayments > 0 ? "default" as const : "outline" as const },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Platform overview & management</p>
            </div>
          </div>
        </div>
        {(stats.pendingReviews + stats.underReview > 0) && (
          <Button size="sm" className="gap-2 self-start sm:self-auto" asChild>
            <Link to="/admin/reviews">
              <Clock className="w-4 h-4" />
              {stats.pendingReviews + stats.underReview} pending review{(stats.pendingReviews + stats.underReview) > 1 ? "s" : ""}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {/* Primary Stats - 4-column */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link to={card.link}>
              <Card className={`border-border/40 overflow-hidden relative group hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer ${card.urgent ? "ring-1 ring-amber-500/30" : ""}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-5 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground">{card.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.04 }}
          >
            {stat.link ? (
              <Link to={stat.link}>
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-card hover:border-primary/20 transition-all group cursor-pointer">
                  <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} />
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold text-foreground leading-tight">{stat.value}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{stat.label}</div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-card">
                <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} />
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold text-foreground leading-tight">{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{stat.label}</div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto py-3 px-4 justify-start gap-3 text-left"
              asChild
            >
              <Link to={action.link}>
                <action.icon className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-[11px] opacity-70 font-normal">{action.desc}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Two-column: Recent Submissions + Recent Investments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/40 h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Recent Applications
                </h3>
                <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" asChild>
                  <Link to="/admin/reviews">View all <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </div>
              {stats.recentBusinesses.length === 0 ? (
                <div className="text-center py-10">
                  <Building2 className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No applications yet.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {stats.recentBusinesses.map((biz, i) => {
                    const sc = statusConfig[biz.status] ?? statusConfig.draft;
                    return (
                      <motion.div
                        key={biz.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.04 }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/30 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <sc.icon className={`w-3.5 h-3.5 shrink-0 ${sc.color}`} />
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-foreground truncate block">{biz.name}</span>
                            <span className="text-[11px] text-muted-foreground">{biz.industry ?? "—"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <Badge className={`text-[10px] capitalize border ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground hidden sm:block">
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

        {/* Recent Investments */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <Card className="border-border/40 h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Recent Investments
                </h3>
                <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" asChild>
                  <Link to="/admin/investments">View all <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </div>
              {stats.recentInvestments.length === 0 ? (
                <div className="text-center py-10">
                  <BarChart3 className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No investments yet.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {stats.recentInvestments.map((inv, i) => (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.04 }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <DollarSign className="w-3.5 h-3.5 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-foreground truncate block">৳{inv.amount.toLocaleString()}</span>
                          <span className="text-[11px] text-muted-foreground truncate block">{inv.business_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <Badge
                          className={`text-[10px] capitalize border ${
                            inv.status === "active" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" :
                            inv.status === "pending_payment" ? "bg-amber-500/15 text-amber-500 border-amber-500/30" :
                            "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {inv.status.replace("_", " ")}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground hidden sm:block">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Business Status Breakdown */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Business Status Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { status: "pending", count: stats.pendingReviews },
                { status: "under_review", count: stats.underReview },
                { status: "approved", count: stats.approvedBusinesses },
                { status: "rejected", count: stats.rejectedBusinesses },
                { status: "suspended", count: stats.suspendedBusinesses },
                { status: "draft", count: stats.totalBusinesses - stats.pendingReviews - stats.underReview - stats.approvedBusinesses - stats.rejectedBusinesses - stats.suspendedBusinesses },
              ].map((item) => {
                const sc = statusConfig[item.status] ?? statusConfig.draft;
                return (
                  <div key={item.status} className="text-center p-3 rounded-xl border border-border/40 bg-secondary/10">
                    <sc.icon className={`w-5 h-5 mx-auto mb-1.5 ${sc.color}`} />
                    <div className="font-display text-xl font-bold text-foreground">{item.count}</div>
                    <div className="text-[11px] text-muted-foreground capitalize">{sc.label}</div>
                  </div>
                );
              })}
            </div>
            {/* Visual bar */}
            {stats.totalBusinesses > 0 && (
              <div className="mt-4 h-2 rounded-full overflow-hidden flex bg-secondary/30">
                {[
                  { count: stats.approvedBusinesses, color: "bg-emerald-500" },
                  { count: stats.pendingReviews, color: "bg-amber-500" },
                  { count: stats.underReview, color: "bg-blue-500" },
                  { count: stats.rejectedBusinesses, color: "bg-red-500" },
                  { count: stats.suspendedBusinesses, color: "bg-orange-500" },
                ].filter(s => s.count > 0).map((seg, i) => (
                  <div
                    key={i}
                    className={`${seg.color} transition-all`}
                    style={{ width: `${(seg.count / stats.totalBusinesses) * 100}%` }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboardOverview;

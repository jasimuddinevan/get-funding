import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Building2, Plus, Clock, CheckCircle2, XCircle, FileSearch, Eye,
  TrendingUp, DollarSign, MapPin, Calendar, Loader2, ArrowRight,
  Ban, AlertCircle, Bell, ExternalLink,
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  region: string | null;
  description: string | null;
  status: string;
  admin_feedback: string | null;
  funding_goal: number | null;
  funded_amount: number | null;
  revenue_share_pct: number | null;
  current_revenue: number | null;
  created_at: string;
  updated_at: string;
  featured: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string | null;
  read: boolean | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock; desc: string }> = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted border-border", icon: Clock, desc: "Not yet submitted" },
  pending: { label: "Pending Review", color: "text-amber-500", bg: "bg-amber-500/15 border-amber-500/30", icon: Clock, desc: "Waiting for admin review" },
  under_review: { label: "Under Review", color: "text-blue-500", bg: "bg-blue-500/15 border-blue-500/30", icon: FileSearch, desc: "Being reviewed by our team" },
  approved: { label: "Approved", color: "text-emerald-500", bg: "bg-emerald-500/15 border-emerald-500/30", icon: CheckCircle2, desc: "Live and accepting investments" },
  rejected: { label: "Rejected", color: "text-red-500", bg: "bg-red-500/15 border-red-500/30", icon: XCircle, desc: "Not approved — see feedback below" },
  suspended: { label: "Suspended", color: "text-orange-500", bg: "bg-orange-500/15 border-orange-500/30", icon: Ban, desc: "Temporarily suspended" },
};

const BusinessOwnerDashboard = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [bizRes, notifRes] = await Promise.all([
        supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      setBusinesses((bizRes.data as Business[]) ?? []);
      setNotifications((notifRes.data as Notification[]) ?? []);
      setLoading(false);
    };
    fetchData();

    // Realtime updates for businesses
    const channel = supabase
      .channel("owner-biz-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "businesses", filter: `owner_id=eq.${user.id}` }, () => {
        fetchData();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const pendingCount = businesses.filter((b) => b.status === "pending" || b.status === "under_review").length;
  const approvedCount = businesses.filter((b) => b.status === "approved").length;
  const totalFunded = businesses.reduce((s, b) => s + (b.funded_amount ?? 0), 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">My Businesses</h1>
                  <p className="text-muted-foreground text-sm">Manage your business applications and track their status.</p>
                </div>
              </div>
            </div>
            <Button className="gap-2 self-start sm:self-auto" asChild>
              <Link to="/onboarding/business">
                <Plus className="w-4 h-4" /> Submit New Business
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-xl border border-border/40 bg-card">
              <div className="font-display text-2xl font-bold text-foreground">{businesses.length}</div>
              <div className="text-xs text-muted-foreground">Total Applications</div>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-card">
              <div className="font-display text-2xl font-bold text-amber-500">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pending Review</div>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-card">
              <div className="font-display text-2xl font-bold text-emerald-500">{approvedCount}</div>
              <div className="text-xs text-muted-foreground">Approved & Live</div>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-card">
              <div className="font-display text-2xl font-bold text-primary">৳{(totalFunded / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">Total Funded</div>
            </div>
          </motion.div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" /> Recent Notifications
                {unreadNotifs > 0 && <Badge className="text-[10px] h-5">{unreadNotifs} new</Badge>}
              </h3>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      n.read ? "border-border/40 bg-card" : "border-primary/30 bg-primary/5"
                    }`}
                    onClick={() => !n.read && markRead(n.id)}
                  >
                    <Bell className={`w-4 h-4 mt-0.5 shrink-0 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{n.title}</div>
                      {n.message && <div className="text-xs text-muted-foreground mt-0.5">{n.message}</div>}
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Business List */}
          {businesses.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/40">
                <CardContent className="py-16 text-center">
                  <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">No businesses yet</h2>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Submit your first business application and start raising funds from investors on the platform.
                  </p>
                  <Button className="gap-2" asChild>
                    <Link to="/onboarding/business">
                      <Plus className="w-4 h-4" /> Submit Your Business
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {businesses.map((biz, i) => {
                const sc = statusConfig[biz.status] ?? statusConfig.draft;
                const fundingPercent = biz.funding_goal && biz.funded_amount
                  ? Math.min(100, Math.round((biz.funded_amount / biz.funding_goal) * 100))
                  : 0;

                return (
                  <motion.div
                    key={biz.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <Card className="border-border/40 hover:border-border/60 transition-all group">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Status icon */}
                          <div className={`w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0 ${sc.color}`}>
                            <sc.icon className="w-6 h-6" />
                          </div>

                          {/* Main content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-display text-lg font-semibold text-foreground">{biz.name}</h3>
                              <Badge className={`text-[10px] capitalize border ${sc.bg} ${sc.color}`}>{sc.label}</Badge>
                              {biz.featured && (
                                <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30">Featured</Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground mb-3">{sc.desc}</p>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                              {biz.industry && (
                                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {biz.industry}</span>
                              )}
                              {biz.location && (
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {biz.location}</span>
                              )}
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(biz.created_at).toLocaleDateString()}</span>
                              {biz.revenue_share_pct && (
                                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {biz.revenue_share_pct}% share</span>
                              )}
                            </div>

                            {/* Funding progress for approved businesses */}
                            {biz.status === "approved" && biz.funding_goal && (
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Funding Progress</span>
                                  <span className="font-medium text-foreground">{fundingPercent}% — ৳{((biz.funded_amount ?? 0) / 1000000).toFixed(1)}M / ৳{(biz.funding_goal / 1000000).toFixed(1)}M</span>
                                </div>
                                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${fundingPercent}%` }} />
                                </div>
                              </div>
                            )}

                            {/* Admin feedback */}
                            {biz.admin_feedback && (
                              <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-border/40">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                                  <AlertCircle className="w-3 h-3" /> Admin Feedback
                                </div>
                                <p className="text-sm text-foreground">{biz.admin_feedback}</p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex sm:flex-col gap-2 shrink-0">
                            {(biz.status === "draft" || biz.status === "rejected") && (
                              <Button variant="outline" size="sm" className="gap-1.5 text-xs" asChild>
                                <Link to={`/onboarding/business/${biz.id}`}>
                                  <FileSearch className="w-3.5 h-3.5" /> Edit & Resubmit
                                </Link>
                              </Button>
                            )}
                            {biz.status === "approved" && (
                              <Button variant="outline" size="sm" className="gap-1.5 text-xs" asChild>
                                <Link to={`/business/${biz.id}`}>
                                  <ExternalLink className="w-3.5 h-3.5" /> View Listing
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessOwnerDashboard;

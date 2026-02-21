import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  FileSearch, CheckCircle2, XCircle, Eye, Clock, MapPin, TrendingUp,
  Building2, Globe, Calendar, DollarSign, Loader2,
} from "lucide-react";

type BusinessStatus = "draft" | "pending" | "under_review" | "approved" | "rejected" | "suspended";

interface Business {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  region: string | null;
  description: string | null;
  pitch: string | null;
  problem_solved: string | null;
  target_market: string | null;
  competitive_advantage: string | null;
  current_revenue: number | null;
  funding_goal: number | null;
  revenue_share_pct: number | null;
  payout_frequency: string | null;
  founded_year: number | null;
  website: string | null;
  growth_rate: number | null;
  profit_margin: number | null;
  financial_projection: string | null;
  min_investment: number | null;
  max_investment: number | null;
  status: BusinessStatus;
  created_at: string;
  owner_id: string;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  pending: { color: "text-yellow-600", bg: "bg-yellow-500/15 border-yellow-500/30" },
  under_review: { color: "text-blue-600", bg: "bg-blue-500/15 border-blue-500/30" },
  approved: { color: "text-green-600", bg: "bg-green-500/15 border-green-500/30" },
  rejected: { color: "text-red-600", bg: "bg-red-500/15 border-red-500/30" },
  draft: { color: "text-muted-foreground", bg: "bg-muted/50 border-border" },
  suspended: { color: "text-orange-600", bg: "bg-orange-500/15 border-orange-500/30" },
};

const BusinessReviews = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "under_review" | "approved" | "rejected">("pending");
  const [selected, setSelected] = useState<Business | null>(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBusinesses = async () => {
    let query = supabase.from("businesses").select("*").order("created_at", { ascending: false });
    if (filter !== "all") {
      query = query.eq("status", filter);
    }
    const { data } = await query;
    setBusinesses((data as Business[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchBusinesses();
  }, [filter]);

  const handleAction = async (action: "approved" | "rejected") => {
    if (!selected || !user) return;
    setActionLoading(true);

    const { error: updateError } = await supabase
      .from("businesses")
      .update({
        status: action,
        admin_feedback: feedback.trim() || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", selected.id);

    if (!updateError) {
      await supabase.from("admin_reviews").insert({
        business_id: selected.id,
        reviewer_id: user.id,
        action,
        comments: feedback.trim() || null,
      });

      // Notify the business owner
      await supabase.from("notifications").insert({
        user_id: selected.owner_id,
        title: action === "approved" ? "Business Approved! 🎉" : "Business Review Update",
        message: action === "approved"
          ? `Your business "${selected.name}" has been approved and is now live on FundBridge.`
          : `Your business "${selected.name}" was not approved. ${feedback ? `Feedback: ${feedback}` : "Please contact support for more info."}`,
      });

      toast.success(`Business ${action}!`);
      setSelected(null);
      setFeedback("");
      fetchBusinesses();
    } else {
      toast.error(updateError.message);
    }
    setActionLoading(false);
  };

  const filters: Array<{ value: typeof filter; label: string; count?: number }> = [
    { value: "pending", label: "Pending" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Business Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve business applications.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Business List */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" />
            {filter === "all" ? "All" : filter.replace("_", " ")} Applications
            <Badge variant="secondary" className="text-xs">{businesses.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <FileSearch className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No {filter !== "all" ? filter.replace("_", " ") : ""} applications.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {businesses.map((biz, i) => {
                const sc = statusConfig[biz.status] ?? statusConfig.draft;
                return (
                  <motion.div
                    key={biz.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-secondary/20"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm truncate">{biz.name}</h4>
                        <Badge className={`text-[10px] capitalize border ${sc.bg} ${sc.color}`}>
                          {biz.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {biz.industry && <span>{biz.industry}</span>}
                        {biz.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{biz.location}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(biz.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {biz.revenue_share_pct && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary">
                          <TrendingUp className="w-3 h-3" />{biz.revenue_share_pct}%
                        </span>
                      )}
                      {biz.funding_goal && (
                        <span className="text-xs text-muted-foreground">
                          ৳{biz.funding_goal.toLocaleString()}
                        </span>
                      )}
                      <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => { setSelected(biz); setFeedback(""); }}>
                        <Eye className="w-3.5 h-3.5" /> Review
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {selected.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Info Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <InfoItem icon={Building2} label="Industry" value={selected.industry} />
                  <InfoItem icon={MapPin} label="Location" value={selected.location} />
                  <InfoItem icon={Globe} label="Region" value={selected.region === "bd" ? "Bangladesh" : "Global"} />
                  <InfoItem icon={Calendar} label="Founded" value={selected.founded_year?.toString()} />
                  <InfoItem icon={DollarSign} label="Monthly Revenue" value={selected.current_revenue ? `৳${selected.current_revenue.toLocaleString()}` : null} />
                  <InfoItem icon={DollarSign} label="Funding Goal" value={selected.funding_goal ? `৳${selected.funding_goal.toLocaleString()}` : null} />
                  <InfoItem icon={TrendingUp} label="Revenue Share" value={selected.revenue_share_pct ? `${selected.revenue_share_pct}%` : null} />
                  <InfoItem icon={TrendingUp} label="Growth Rate" value={selected.growth_rate ? `${selected.growth_rate}%` : null} />
                </div>

                {selected.description && (
                  <TextBlock label="Description" value={selected.description} />
                )}
                {selected.pitch && (
                  <TextBlock label="Elevator Pitch" value={selected.pitch} />
                )}
                {selected.problem_solved && (
                  <TextBlock label="Problem Solved" value={selected.problem_solved} />
                )}
                {selected.target_market && (
                  <TextBlock label="Target Market" value={selected.target_market} />
                )}
                {selected.competitive_advantage && (
                  <TextBlock label="Competitive Advantage" value={selected.competitive_advantage} />
                )}
                {selected.financial_projection && (
                  <TextBlock label="Financial Projection" value={selected.financial_projection} />
                )}

                {/* Feedback */}
                {(selected.status === "pending" || selected.status === "under_review") && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Admin Feedback</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Optional feedback for the business owner..."
                      className="bg-secondary/50 border-border min-h-[80px]"
                      maxLength={1000}
                    />
                  </div>
                )}
              </div>

              {(selected.status === "pending" || selected.status === "under_review") && (
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAction("rejected")}
                    disabled={actionLoading}
                    className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/10"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAction("approved")}
                    disabled={actionLoading}
                    className="gap-2 glow-gold"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string | null | undefined }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div>
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
};

const TextBlock = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</h4>
    <p className="text-sm text-foreground leading-relaxed">{value}</p>
  </div>
);

export default BusinessReviews;

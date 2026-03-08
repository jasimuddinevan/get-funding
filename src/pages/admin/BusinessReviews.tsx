import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  FileSearch, CheckCircle2, XCircle, Eye, Clock, MapPin, TrendingUp,
  Building2, Globe, Calendar, DollarSign, Loader2, Star, Pencil,
  Trash2, Ban, RotateCcw, MoreHorizontal, User, History, Mail, Phone,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
  featured: boolean;
  created_at: string;
  owner_id: string;
  admin_feedback: string | null;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "text-yellow-600", bg: "bg-yellow-500/15 border-yellow-500/30", label: "Pending" },
  under_review: { color: "text-blue-600", bg: "bg-blue-500/15 border-blue-500/30", label: "Under Review" },
  approved: { color: "text-green-600", bg: "bg-green-500/15 border-green-500/30", label: "Approved" },
  rejected: { color: "text-red-600", bg: "bg-red-500/15 border-red-500/30", label: "Rejected" },
  draft: { color: "text-muted-foreground", bg: "bg-muted/50 border-border", label: "Draft" },
  suspended: { color: "text-orange-600", bg: "bg-orange-500/15 border-orange-500/30", label: "Suspended" },
};

const INDUSTRIES = [
  "Technology", "FinTech", "Healthcare", "Agriculture", "Clean Energy",
  "E-Commerce", "Education", "Manufacturing", "Real Estate", "Food & Beverage",
  "Logistics", "Fashion", "Media", "Other",
];

const BusinessReviews = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | BusinessStatus>("pending");
  const [selected, setSelected] = useState<Business | null>(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editBiz, setEditBiz] = useState<Business | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Detail state
  const [ownerProfile, setOwnerProfile] = useState<{ full_name: string | null; phone: string | null; avatar_url: string | null; user_id: string } | null>(null);
  const [reviewHistory, setReviewHistory] = useState<Array<{ id: string; action: string; comments: string | null; created_at: string; reviewer_name: string | null }>>([]);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; role: string | null }>>([]);
  const [documents, setDocuments] = useState<Array<{ id: string; document_type: string; file_name: string | null; file_url: string }>>([]);
  const [investmentCount, setInvestmentCount] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchBusinesses = async () => {
    let query = supabase.from("businesses").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setBusinesses((data as Business[]) ?? []);
    setLoading(false);
  };

  const fetchDetails = async (biz: Business) => {
    setDetailLoading(true);
    const [profileRes, reviewsRes, teamRes, docsRes, investRes] = await Promise.all([
      supabase.from("profiles").select("full_name, phone, avatar_url, user_id").eq("user_id", biz.owner_id).maybeSingle(),
      supabase.from("admin_reviews").select("*").eq("business_id", biz.id).order("created_at", { ascending: false }),
      supabase.from("business_team_members").select("id, name, role").eq("business_id", biz.id),
      supabase.from("business_documents").select("id, document_type, file_name, file_url").eq("business_id", biz.id),
      supabase.from("investments").select("id", { count: "exact", head: true }).eq("business_id", biz.id).eq("status", "active"),
    ]);
    setOwnerProfile(profileRes.data);
    setInvestmentCount(investRes.count ?? 0);
    setTeamMembers((teamRes.data ?? []) as typeof teamMembers);
    setDocuments((docsRes.data ?? []) as typeof documents);

    // Enrich reviews with reviewer names
    const reviews = (reviewsRes.data ?? []) as Array<{ id: string; action: string; comments: string | null; created_at: string; reviewer_id: string }>;
    const reviewerIds = [...new Set(reviews.map(r => r.reviewer_id))];
    let reviewerMap = new Map<string, string | null>();
    if (reviewerIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", reviewerIds);
      reviewerMap = new Map((profiles ?? []).map(p => [p.user_id, p.full_name]));
    }
    setReviewHistory(reviews.map(r => ({ ...r, reviewer_name: reviewerMap.get(r.reviewer_id) ?? null })));
    setDetailLoading(false);
  };

  const openReview = (biz: Business) => {
    setSelected(biz);
    setFeedback("");
    fetchDetails(biz);
  };

  useEffect(() => {
    setLoading(true);
    fetchBusinesses();
  }, [filter]);

  const handleAction = async (action: BusinessStatus) => {
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

      const titles: Record<string, string> = {
        approved: "Business Approved! 🎉",
        rejected: "Business Not Approved",
        suspended: "Business Suspended ⚠️",
        pending: "Business Status Updated",
        under_review: "Business Under Review",
      };
      const messages: Record<string, string> = {
        approved: `Your business "${selected.name}" has been approved and is now live on FundBridge.`,
        rejected: `Your business "${selected.name}" was not approved. ${feedback || "Please contact support."}`,
        suspended: `Your business "${selected.name}" has been suspended. ${feedback || "Please contact support for details."}`,
        pending: `Your business "${selected.name}" status has been updated to pending.`,
        under_review: `Your business "${selected.name}" is now under review.`,
      };

      await supabase.from("notifications").insert({
        user_id: selected.owner_id,
        title: titles[action] ?? "Business Update",
        message: messages[action] ?? `Your business "${selected.name}" status changed to ${action}.`,
      });

      toast.success(`Business ${action.replace("_", " ")}!`);
      setSelected(null);
      setFeedback("");
      fetchBusinesses();
    } else {
      toast.error(updateError.message);
    }
    setActionLoading(false);
  };

  const openEdit = (biz: Business) => {
    setEditBiz(biz);
    setEditForm({
      name: biz.name,
      industry: biz.industry ?? "",
      location: biz.location ?? "",
      description: biz.description ?? "",
      pitch: biz.pitch ?? "",
      problem_solved: biz.problem_solved ?? "",
      target_market: biz.target_market ?? "",
      competitive_advantage: biz.competitive_advantage ?? "",
      current_revenue: biz.current_revenue?.toString() ?? "",
      funding_goal: biz.funding_goal?.toString() ?? "",
      revenue_share_pct: biz.revenue_share_pct?.toString() ?? "",
      min_investment: biz.min_investment?.toString() ?? "",
      max_investment: biz.max_investment?.toString() ?? "",
      growth_rate: biz.growth_rate?.toString() ?? "",
      profit_margin: biz.profit_margin?.toString() ?? "",
      payout_frequency: biz.payout_frequency ?? "Monthly",
      website: biz.website ?? "",
      financial_projection: biz.financial_projection ?? "",
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editBiz) return;
    setEditSaving(true);
    const { error } = await supabase.from("businesses").update({
      name: editForm.name.trim(),
      industry: editForm.industry || null,
      location: editForm.location.trim() || null,
      description: editForm.description.trim() || null,
      pitch: editForm.pitch.trim() || null,
      problem_solved: editForm.problem_solved.trim() || null,
      target_market: editForm.target_market.trim() || null,
      competitive_advantage: editForm.competitive_advantage.trim() || null,
      current_revenue: editForm.current_revenue ? parseFloat(editForm.current_revenue) : null,
      funding_goal: editForm.funding_goal ? parseFloat(editForm.funding_goal) : null,
      revenue_share_pct: editForm.revenue_share_pct ? parseFloat(editForm.revenue_share_pct) : null,
      min_investment: editForm.min_investment ? parseFloat(editForm.min_investment) : null,
      max_investment: editForm.max_investment ? parseFloat(editForm.max_investment) : null,
      growth_rate: editForm.growth_rate ? parseFloat(editForm.growth_rate) : null,
      profit_margin: editForm.profit_margin ? parseFloat(editForm.profit_margin) : null,
      payout_frequency: editForm.payout_frequency || null,
      website: editForm.website.trim() || null,
      financial_projection: editForm.financial_projection.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", editBiz.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`"${editForm.name}" updated!`);
      setEditOpen(false);
      fetchBusinesses();
    }
    setEditSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    // Delete related records first
    await supabase.from("investments").delete().eq("business_id", deleteTarget.id);
    await supabase.from("watchlists").delete().eq("business_id", deleteTarget.id);
    await supabase.from("investment_tiers").delete().eq("business_id", deleteTarget.id);
    await supabase.from("business_documents").delete().eq("business_id", deleteTarget.id);
    await supabase.from("business_team_members").delete().eq("business_id", deleteTarget.id);
    await supabase.from("admin_reviews").delete().eq("business_id", deleteTarget.id);

    const { error } = await supabase.from("businesses").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error(error.message);
    } else {
      // Notify owner
      await supabase.from("notifications").insert({
        user_id: deleteTarget.owner_id,
        title: "Business Removed",
        message: `Your business "${deleteTarget.name}" has been removed from FundBridge.`,
      });
      toast.success(`"${deleteTarget.name}" deleted.`);
      fetchBusinesses();
    }
    setDeleteTarget(null);
    setDeleteLoading(false);
  };

  const quickStatusChange = async (biz: Business, newStatus: BusinessStatus) => {
    if (!user) return;
    await supabase.from("businesses").update({
      status: newStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", biz.id);

    await supabase.from("notifications").insert({
      user_id: biz.owner_id,
      title: `Business ${newStatus.replace("_", " ")}`,
      message: `Your business "${biz.name}" status changed to ${newStatus.replace("_", " ")}.`,
    });

    toast.success(`Status changed to ${newStatus.replace("_", " ")}`);
    fetchBusinesses();
  };

  const filters: Array<{ value: typeof filter; label: string }> = [
    { value: "pending", label: "Pending" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "suspended", label: "Suspended" },
    { value: "all", label: "All" },
  ];

  const inputClass = "mt-1.5 bg-secondary/50 border-border";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Business Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Review, edit, and manage all business applications.</p>
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
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" />
            {filter === "all" ? "All" : statusConfig[filter]?.label ?? filter} Applications
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
              <p className="text-muted-foreground text-sm">No {filter !== "all" ? statusConfig[filter]?.label.toLowerCase() ?? "" : ""} applications.</p>
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm truncate">{biz.name}</h4>
                        <Badge className={`text-[10px] capitalize border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </Badge>
                        {biz.featured && (
                          <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30 gap-1">
                            <Star className="w-2.5 h-2.5 fill-primary" /> Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {biz.industry && <span>{biz.industry}</span>}
                        {biz.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{biz.location}</span>
                        )}
                        {biz.funding_goal && (
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />৳{biz.funding_goal.toLocaleString()}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(biz.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => openReview(biz)}>
                        <Eye className="w-3.5 h-3.5" /> Review
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem onClick={() => openEdit(biz)} className="gap-2">
                            <Pencil className="w-3.5 h-3.5" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const newVal = !biz.featured;
                              supabase.from("businesses").update({ featured: newVal }).eq("id", biz.id).then(() => {
                                setBusinesses((prev) => prev.map((b) => b.id === biz.id ? { ...b, featured: newVal } : b));
                                toast.success(newVal ? `Featured!` : `Unfeatured`);
                              });
                            }}
                            className="gap-2"
                          >
                            <Star className={`w-3.5 h-3.5 ${biz.featured ? "fill-primary text-primary" : ""}`} />
                            {biz.featured ? "Remove Featured" : "Mark Featured"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {biz.status !== "approved" && (
                            <DropdownMenuItem onClick={() => quickStatusChange(biz, "approved")} className="gap-2 text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </DropdownMenuItem>
                          )}
                          {biz.status !== "rejected" && (
                            <DropdownMenuItem onClick={() => openReview(biz)} className="gap-2 text-red-600">
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </DropdownMenuItem>
                          )}
                          {biz.status !== "suspended" && biz.status === "approved" && (
                            <DropdownMenuItem onClick={() => quickStatusChange(biz, "suspended")} className="gap-2 text-orange-600">
                              <Ban className="w-3.5 h-3.5" /> Suspend
                            </DropdownMenuItem>
                          )}
                          {(biz.status === "rejected" || biz.status === "suspended") && (
                            <DropdownMenuItem onClick={() => quickStatusChange(biz, "pending")} className="gap-2">
                              <RotateCcw className="w-3.5 h-3.5" /> Reset to Pending
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDeleteTarget(biz)} className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                  <Badge className={`text-[10px] capitalize border ${statusConfig[selected.status]?.bg} ${statusConfig[selected.status]?.color}`}>
                    {statusConfig[selected.status]?.label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <InfoItem icon={Building2} label="Industry" value={selected.industry} />
                  <InfoItem icon={MapPin} label="Location" value={selected.location} />
                  <InfoItem icon={Globe} label="Region" value={selected.region === "bd" ? "Bangladesh" : "Global"} />
                  <InfoItem icon={Calendar} label="Founded" value={selected.founded_year?.toString()} />
                  <InfoItem icon={DollarSign} label="Monthly Revenue" value={selected.current_revenue ? `৳${selected.current_revenue.toLocaleString()}` : null} />
                  <InfoItem icon={DollarSign} label="Funding Goal" value={selected.funding_goal ? `৳${selected.funding_goal.toLocaleString()}` : null} />
                  <InfoItem icon={TrendingUp} label="Revenue Share" value={selected.revenue_share_pct ? `${selected.revenue_share_pct}%` : null} />
                  <InfoItem icon={TrendingUp} label="Growth Rate" value={selected.growth_rate ? `${selected.growth_rate}%` : null} />
                  <InfoItem icon={DollarSign} label="Min Investment" value={selected.min_investment ? `৳${selected.min_investment.toLocaleString()}` : null} />
                  <InfoItem icon={DollarSign} label="Max Investment" value={selected.max_investment ? `৳${selected.max_investment.toLocaleString()}` : null} />
                </div>

                {selected.description && <TextBlock label="Description" value={selected.description} />}
                {selected.pitch && <TextBlock label="Elevator Pitch" value={selected.pitch} />}
                {selected.problem_solved && <TextBlock label="Problem Solved" value={selected.problem_solved} />}
                {selected.target_market && <TextBlock label="Target Market" value={selected.target_market} />}
                {selected.competitive_advantage && <TextBlock label="Competitive Advantage" value={selected.competitive_advantage} />}
                {selected.financial_projection && <TextBlock label="Financial Projection" value={selected.financial_projection} />}

                {selected.admin_feedback && (
                  <div className="rounded-xl border border-border bg-secondary/20 p-3">
                    <span className="text-xs text-muted-foreground block mb-1">Previous Admin Feedback</span>
                    <p className="text-sm text-foreground">{selected.admin_feedback}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Admin Feedback</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Feedback for the business owner..."
                    className="bg-secondary/50 border-border min-h-[80px]"
                    maxLength={1000}
                  />
                </div>
              </div>

              <DialogFooter className="flex-wrap gap-2">
                {selected.status !== "rejected" && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction("rejected")}
                    disabled={actionLoading}
                    className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/10"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Reject
                  </Button>
                )}
                {selected.status === "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction("suspended")}
                    disabled={actionLoading}
                    className="gap-2 border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
                  >
                    <Ban className="w-4 h-4" /> Suspend
                  </Button>
                )}
                {(selected.status === "rejected" || selected.status === "suspended") && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction("pending")}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset to Pending
                  </Button>
                )}
                {selected.status !== "approved" && (
                  <Button
                    onClick={() => handleAction("approved")}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Approve
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" />
              Edit Business
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Business Name *</Label>
                <Input value={editForm.name ?? ""} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} className={inputClass} maxLength={100} />
              </div>
              <div>
                <Label>Industry</Label>
                <Select value={editForm.industry ?? ""} onValueChange={(v) => setEditForm(f => ({ ...f, industry: v }))}>
                  <SelectTrigger className="mt-1.5 bg-secondary/50 border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input value={editForm.location ?? ""} onChange={(e) => setEditForm(f => ({ ...f, location: e.target.value }))} className={inputClass} maxLength={100} />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={editForm.website ?? ""} onChange={(e) => setEditForm(f => ({ ...f, website: e.target.value }))} className={inputClass} maxLength={255} />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={editForm.description ?? ""} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} className="mt-1.5 bg-secondary/50 border-border min-h-[80px]" maxLength={1000} />
            </div>

            <div>
              <Label>Elevator Pitch</Label>
              <Textarea value={editForm.pitch ?? ""} onChange={(e) => setEditForm(f => ({ ...f, pitch: e.target.value }))} className="mt-1.5 bg-secondary/50 border-border min-h-[80px]" maxLength={500} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Monthly Revenue (৳)</Label>
                <Input type="number" value={editForm.current_revenue ?? ""} onChange={(e) => setEditForm(f => ({ ...f, current_revenue: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <Label>Funding Goal (৳)</Label>
                <Input type="number" value={editForm.funding_goal ?? ""} onChange={(e) => setEditForm(f => ({ ...f, funding_goal: e.target.value }))} className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Revenue Share (%)</Label>
                <Input type="number" value={editForm.revenue_share_pct ?? ""} onChange={(e) => setEditForm(f => ({ ...f, revenue_share_pct: e.target.value }))} className={inputClass} min={0} max={100} step={0.5} />
              </div>
              <div>
                <Label>Growth Rate (%)</Label>
                <Input type="number" value={editForm.growth_rate ?? ""} onChange={(e) => setEditForm(f => ({ ...f, growth_rate: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <Label>Profit Margin (%)</Label>
                <Input type="number" value={editForm.profit_margin ?? ""} onChange={(e) => setEditForm(f => ({ ...f, profit_margin: e.target.value }))} className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Min Investment (৳)</Label>
                <Input type="number" value={editForm.min_investment ?? ""} onChange={(e) => setEditForm(f => ({ ...f, min_investment: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <Label>Max Investment (৳)</Label>
                <Input type="number" value={editForm.max_investment ?? ""} onChange={(e) => setEditForm(f => ({ ...f, max_investment: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <Label>Payout Frequency</Label>
                <Select value={editForm.payout_frequency ?? "Monthly"} onValueChange={(v) => setEditForm(f => ({ ...f, payout_frequency: v }))}>
                  <SelectTrigger className="mt-1.5 bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {["Monthly", "Quarterly", "Semi-Annually", "Annually"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Problem Solved</Label>
              <Textarea value={editForm.problem_solved ?? ""} onChange={(e) => setEditForm(f => ({ ...f, problem_solved: e.target.value }))} className="mt-1.5 bg-secondary/50 border-border min-h-[60px]" maxLength={500} />
            </div>
            <div>
              <Label>Target Market</Label>
              <Textarea value={editForm.target_market ?? ""} onChange={(e) => setEditForm(f => ({ ...f, target_market: e.target.value }))} className="mt-1.5 bg-secondary/50 border-border min-h-[60px]" maxLength={500} />
            </div>
            <div>
              <Label>Financial Projection</Label>
              <Textarea value={editForm.financial_projection ?? ""} onChange={(e) => setEditForm(f => ({ ...f, financial_projection: e.target.value }))} className="mt-1.5 bg-secondary/50 border-border min-h-[60px]" maxLength={1000} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="gap-2" onClick={handleEditSave} disabled={editSaving || !editForm.name?.trim()}>
              {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {editSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" /> Delete Business
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>"{deleteTarget?.name}"</strong> and all associated investments, watchlists, documents, and reviews. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

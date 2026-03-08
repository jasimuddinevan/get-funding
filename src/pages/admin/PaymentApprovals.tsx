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
  CreditCard, CheckCircle2, XCircle, Eye, Clock, DollarSign,
  Loader2, Image as ImageIcon, Calendar, Building2, User,
} from "lucide-react";

interface PaymentInvestment {
  id: string;
  amount: number;
  revenue_share_pct: number;
  status: string;
  payment_method: string | null;
  payment_proof_url: string | null;
  admin_payment_note: string | null;
  invested_at: string;
  investor_id: string;
  businesses?: { name: string; industry: string | null } | null;
  investor_name?: string | null;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending_payment: { color: "bg-muted text-muted-foreground border-border", label: "Awaiting Payment" },
  pending_approval: { color: "bg-amber-500/15 text-amber-600 border-amber-500/30", label: "Pending Approval" },
  active: { color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", label: "Active" },
  rejected: { color: "bg-red-500/15 text-red-600 border-red-500/30", label: "Rejected" },
  completed: { color: "bg-blue-500/15 text-blue-600 border-blue-500/30", label: "Completed" },
  cancelled: { color: "bg-muted text-muted-foreground border-border", label: "Cancelled" },
};

const PaymentApprovals = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<PaymentInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending_approval");
  const [selected, setSelected] = useState<PaymentInvestment | null>(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInvestments = async () => {
    let query = supabase
      .from("investments")
      .select("*, businesses(name, industry)")
      .order("invested_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    const invs = (data ?? []) as PaymentInvestment[];

    // Fetch investor names
    const investorIds = [...new Set(invs.map((i) => i.investor_id))];
    if (investorIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", investorIds);
      const map = new Map((profiles ?? []).map((p) => [p.user_id, p.full_name]));
      invs.forEach((inv) => {
        inv.investor_name = map.get(inv.investor_id) ?? null;
      });
    }

    setInvestments(invs);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchInvestments();
  }, [filter]);

  const handleAction = async (action: "active" | "rejected") => {
    if (!selected || !user) return;
    setActionLoading(true);

    const { error } = await supabase
      .from("investments")
      .update({
        status: action,
        admin_payment_note: feedback.trim() || null,
        payment_reviewed_at: new Date().toISOString(),
        payment_reviewed_by: user.id,
      })
      .eq("id", selected.id);

    if (!error) {
      // Notify investor
      await supabase.from("notifications").insert({
        user_id: selected.investor_id,
        title: action === "active" ? "Payment Approved! 🎉" : "Payment Not Approved",
        message: action === "active"
          ? `Your investment of ৳${selected.amount.toLocaleString()} in "${selected.businesses?.name}" has been approved and is now active.`
          : `Your payment for ৳${selected.amount.toLocaleString()} in "${selected.businesses?.name}" was not approved. ${feedback || "Please contact support."}`,
      });

      toast.success(`Payment ${action === "active" ? "approved" : "rejected"}!`);
      setSelected(null);
      setFeedback("");
      fetchInvestments();
    } else {
      toast.error(error.message);
    }
    setActionLoading(false);
  };

  const filters = [
    { value: "pending_approval", label: "Pending" },
    { value: "active", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "all", label: "All" },
  ];

  const pendingCount = investments.length;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Payment Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve investor payment proofs.</p>
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

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {filter === "all" ? "All" : filters.find(f => f.value === filter)?.label} Payments
            <Badge variant="secondary" className="text-xs">{investments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No {filter !== "all" ? filter.replace("_", " ") : ""} payments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {investments.map((inv, i) => {
                const sc = statusConfig[inv.status] ?? statusConfig.pending_payment;
                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm truncate">
                          {inv.investor_name ?? inv.investor_id.slice(0, 8) + "…"}
                        </h4>
                        <Badge className={`text-[10px] capitalize border ${sc.color}`}>
                          {sc.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {inv.businesses?.name ?? "Unknown"}
                        </span>
                        {inv.payment_method && (
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            {inv.payment_method}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(inv.invested_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-foreground text-sm">৳{inv.amount.toLocaleString()}</div>
                        <div className="text-xs text-primary">{inv.revenue_share_pct}% share</div>
                      </div>
                      {inv.payment_proof_url && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center" title="Has proof">
                          <ImageIcon className="w-4 h-4 text-emerald-500" />
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => { setSelected(inv); setFeedback(""); }}>
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Review
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <span className="text-xs text-muted-foreground block">Investor</span>
                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {selected.investor_name ?? "Unknown"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <span className="text-xs text-muted-foreground block">Business</span>
                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {selected.businesses?.name ?? "Unknown"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <span className="text-xs text-muted-foreground block">Amount</span>
                    <span className="text-sm font-bold text-foreground">৳{selected.amount.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <span className="text-xs text-muted-foreground block">Payment Method</span>
                    <span className="text-sm font-medium text-foreground capitalize">{selected.payment_method ?? "N/A"}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <span className="text-xs text-muted-foreground block">Rev. Share</span>
                    <span className="text-sm font-bold text-primary">{selected.revenue_share_pct}%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <span className="text-xs text-muted-foreground block">Date</span>
                    <span className="text-sm font-medium text-foreground">{new Date(selected.invested_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Proof Image */}
                {selected.payment_proof_url ? (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" /> Payment Proof
                    </h4>
                    <img
                      src={selected.payment_proof_url}
                      alt="Payment proof"
                      className="w-full max-h-80 object-contain rounded-xl border border-border bg-secondary/20"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-secondary/10 p-6 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No payment proof uploaded</p>
                  </div>
                )}

                {/* Admin Feedback */}
                {(selected.status === "pending_approval" || selected.status === "pending_payment") && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Admin Note</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Optional note for the investor..."
                      className="bg-secondary/50 border-border min-h-[70px]"
                      maxLength={500}
                    />
                  </div>
                )}

                {selected.admin_payment_note && selected.status !== "pending_approval" && (
                  <div className="rounded-xl border border-border bg-secondary/10 p-3">
                    <span className="text-xs text-muted-foreground block mb-1">Admin Note</span>
                    <p className="text-sm text-foreground">{selected.admin_payment_note}</p>
                  </div>
                )}
              </div>

              {(selected.status === "pending_approval" || selected.status === "pending_payment") && (
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
                    onClick={() => handleAction("active")}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Approve Payment
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PaymentApprovals;

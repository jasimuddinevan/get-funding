import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Building2, Search, MapPin, TrendingUp, DollarSign, Loader2, Star, Globe,
  ExternalLink, SlidersHorizontal, X, Ban, XCircle, AlertTriangle, StarOff,
  RotateCcw, ShieldAlert,
} from "lucide-react";
import { INDUSTRIES } from "@/data/businesses";

interface Business {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  region: string | null;
  description: string | null;
  current_revenue: number | null;
  funding_goal: number | null;
  funded_amount: number | null;
  revenue_share_pct: number | null;
  founded_year: number | null;
  featured: boolean;
  created_at: string;
  status: string;
  owner_id: string;
}

const LOCATIONS = ["All Locations", "Bangladesh", "Global"] as const;

const ActiveBusinesses = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [suspendedBusinesses, setSuspendedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [location, setLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  // Disapproval dialog state
  const [disapproveTarget, setDisapproveTarget] = useState<Business | null>(null);
  const [disapproveAction, setDisapproveAction] = useState<"rejected" | "suspended">("suspended");
  const [disapproveFeedback, setDisapproveFeedback] = useState("");
  const [disapproveLoading, setDisapproveLoading] = useState(false);

  // Reinstate state
  const [reinstateTarget, setReinstateTarget] = useState<Business | null>(null);
  const [reinstateLoading, setReinstateLoading] = useState(false);

  const fetchBusinesses = async () => {
    const [{ data: approved }, { data: suspended }] = await Promise.all([
      supabase.from("businesses").select("*").eq("status", "approved").order("created_at", { ascending: false }),
      supabase.from("businesses").select("*").eq("status", "suspended").order("created_at", { ascending: false }),
    ]);
    setBusinesses((approved as Business[]) ?? []);
    setSuspendedBusinesses((suspended as Business[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDisapprove = async () => {
    if (!disapproveTarget || !user) return;
    setDisapproveLoading(true);

    const { error } = await supabase
      .from("businesses")
      .update({
        status: disapproveAction,
        admin_feedback: disapproveFeedback.trim() || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", disapproveTarget.id);

    if (error) {
      toast.error(error.message);
    } else {
      // Log review action
      await supabase.from("admin_reviews").insert({
        business_id: disapproveTarget.id,
        reviewer_id: user.id,
        action: disapproveAction,
        comments: disapproveFeedback.trim() || null,
      });

      // Notify the business owner
      const titles: Record<string, string> = {
        rejected: "Business Approval Revoked",
        suspended: "Business Suspended ⚠️",
      };
      const messages: Record<string, string> = {
        rejected: `Your business "${disapproveTarget.name}" approval has been revoked. ${disapproveFeedback || "Please contact support for details."}`,
        suspended: `Your business "${disapproveTarget.name}" has been suspended. ${disapproveFeedback || "Please contact support for details."}`,
      };

      await supabase.from("notifications").insert({
        user_id: disapproveTarget.owner_id,
        title: titles[disapproveAction] ?? "Business Update",
        message: messages[disapproveAction] ?? "",
      });

      toast.success(`Business ${disapproveAction === "suspended" ? "suspended" : "disapproved"} successfully.`);
      setDisapproveTarget(null);
      setDisapproveFeedback("");
      fetchBusinesses();
    }
    setDisapproveLoading(false);
  };
  const handleReinstate = async () => {
    if (!reinstateTarget || !user) return;
    setReinstateLoading(true);
    const { error } = await supabase
      .from("businesses")
      .update({
        status: "approved" as any,
        admin_feedback: null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", reinstateTarget.id);

    if (error) {
      toast.error(error.message);
    } else {
      await supabase.from("admin_reviews").insert({
        business_id: reinstateTarget.id,
        reviewer_id: user.id,
        action: "reinstated",
        comments: "Business reinstated to approved status.",
      });
      await supabase.from("notifications").insert({
        user_id: reinstateTarget.owner_id,
        title: "Business Reinstated! 🎉",
        message: `Your business "${reinstateTarget.name}" has been reinstated and is now live on the platform again.`,
      });
      toast.success(`${reinstateTarget.name} has been reinstated.`);
      setReinstateTarget(null);
      fetchBusinesses();
    }
    setReinstateLoading(false);
  };

  const toggleFeatured = async (biz: Business) => {
    const newVal = !biz.featured;
    const { error } = await supabase
      .from("businesses")
      .update({ featured: newVal })
      .eq("id", biz.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${biz.name} ${newVal ? "marked as featured" : "removed from featured"}`);
      setBusinesses((prev) => prev.map((b) => (b.id === biz.id ? { ...b, featured: newVal } : b)));
    }
  };

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !(b.description ?? "").toLowerCase().includes(q)) return false;
      }
      if (industry !== "All Industries" && b.industry !== industry) return false;
      if (location === "Bangladesh" && b.region !== "bd") return false;
      if (location === "Global" && b.region !== "global") return false;
      return true;
    });
  }, [businesses, search, industry, location]);

  const activeFilterCount = [industry !== "All Industries", location !== "All Locations"].filter(Boolean).length;

  const clearFilters = () => {
    setIndustry("All Industries");
    setLocation("All Locations");
    setSearch("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Businesses</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage all businesses on the platform.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            Active <Badge variant="secondary" className="text-[10px] ml-1">{businesses.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="suspended" className="gap-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Suspended <Badge variant="secondary" className="text-[10px] ml-1">{suspendedBusinesses.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Active Businesses Tab */}
        <TabsContent value="active" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary/50 border-border h-10"
              />
            </div>
            <Button variant="outline" size="sm" className="h-10 gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">{activeFilterCount}</Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 gap-1">
                    <X className="w-3 h-3" /> Clear All
                  </Button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {INDUSTRIES.map((ind) => (<SelectItem key={ind} value={ind}>{ind}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {LOCATIONS.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length !== 1 ? "businesses" : "business"} found
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="py-12 text-center">
                <Building2 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No businesses found.</p>
                {(search || activeFilterCount > 0) && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="mt-3">Clear Filters</Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filtered.map((biz, i) => (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <Card className="rounded-xl border-border/50 hover:border-primary/30 transition-all hover:shadow-lg group">
                    <CardContent className="p-6">
                      {/* Header: Avatar + Industry badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{biz.name.charAt(0)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {biz.industry && (
                            <Badge variant="secondary" className="text-xs font-normal px-2.5 py-0.5 rounded-full">{biz.industry}</Badge>
                          )}
                          <button
                            onClick={() => toggleFeatured(biz)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              biz.featured
                                ? "text-primary hover:bg-primary/10"
                                : "text-muted-foreground hover:bg-secondary hover:text-primary"
                            }`}
                            title={biz.featured ? "Remove from featured" : "Mark as featured"}
                          >
                            {biz.featured ? <Star className="w-4 h-4 fill-primary" /> : <StarOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="font-display text-lg font-semibold text-foreground leading-tight mb-1 truncate">{biz.name}</h3>

                      {/* Location */}
                      {biz.location && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3.5 h-3.5" /> {biz.location}
                        </p>
                      )}

                      {/* Description */}
                      {biz.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{biz.description}</p>
                      )}

                      {/* Revenue share */}
                      {biz.revenue_share_pct != null && (
                        <div className="flex items-center gap-1.5 mb-4">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="font-mono text-sm font-semibold text-primary">{biz.revenue_share_pct}%</span>
                          <span className="text-sm text-muted-foreground">revenue share</span>
                        </div>
                      )}

                      {/* Funded progress */}
                      {biz.funded_amount != null && biz.funding_goal ? (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-muted-foreground">Funded</span>
                            <span className="font-mono font-medium text-foreground">{Math.round((biz.funded_amount / biz.funding_goal) * 100)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${Math.min(100, (biz.funded_amount / biz.funding_goal) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {/* Actions */}
                      <div className="pt-4 border-t border-border/40 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 text-xs rounded-lg text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                          onClick={() => {
                            setDisapproveTarget(biz);
                            setDisapproveAction("suspended");
                            setDisapproveFeedback("");
                          }}
                        >
                          <Ban className="w-3.5 h-3.5" /> Suspend
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 text-xs rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => {
                            setDisapproveTarget(biz);
                            setDisapproveAction("rejected");
                            setDisapproveFeedback("");
                          }}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Revoke
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Suspended Businesses Tab */}
        <TabsContent value="suspended" className="space-y-4 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : suspendedBusinesses.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="py-12 text-center">
                <ShieldAlert className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No suspended businesses.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {suspendedBusinesses.map((biz, i) => (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <Card className="rounded-xl border-orange-500/20 hover:border-orange-500/40 transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500/15 flex items-center justify-center">
                          <span className="text-sm font-semibold text-orange-500">{biz.name.charAt(0)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs font-normal px-2.5 py-0.5 rounded-full border-orange-500/30 text-orange-500">Suspended</Badge>
                      </div>

                      <h3 className="font-display text-lg font-semibold text-foreground leading-tight mb-1 truncate">{biz.name}</h3>

                      {biz.location && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3.5 h-3.5" /> {biz.location}
                        </p>
                      )}

                      {biz.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{biz.description}</p>
                      )}

                      <div className="pt-4 border-t border-border/40">
                        <Button
                          size="sm"
                          className="w-full gap-1.5 text-sm rounded-lg"
                          onClick={() => setReinstateTarget(biz)}
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reinstate to Active
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Disapproval Dialog */}
      <Dialog open={!!disapproveTarget} onOpenChange={(open) => !open && setDisapproveTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${disapproveAction === "suspended" ? "text-orange-500" : "text-destructive"}`} />
              {disapproveAction === "suspended" ? "Suspend Business" : "Revoke Approval"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {disapproveAction === "suspended"
                ? `This will suspend "${disapproveTarget?.name}" and temporarily remove it from the platform. The owner will be notified.`
                : `This will revoke the approval of "${disapproveTarget?.name}" and remove it from the platform. The owner will be notified.`}
            </p>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Reason / Feedback (sent to business owner)
              </label>
              <Textarea
                value={disapproveFeedback}
                onChange={(e) => setDisapproveFeedback(e.target.value)}
                placeholder="Explain the reason for this action..."
                className="bg-secondary/50 border-border min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDisapproveTarget(null)} disabled={disapproveLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisapprove}
              disabled={disapproveLoading}
              className="gap-2"
            >
              {disapproveLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : disapproveAction === "suspended" ? (
                <><Ban className="w-4 h-4" /> Suspend Business</>
              ) : (
                <><XCircle className="w-4 h-4" /> Revoke Approval</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reinstate Dialog */}
      <Dialog open={!!reinstateTarget} onOpenChange={(open) => !open && setReinstateTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              Reinstate Business
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              This will reinstate <span className="font-medium text-foreground">"{reinstateTarget?.name}"</span> back to approved status. It will be visible on the platform again and the owner will be notified.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReinstateTarget(null)} disabled={reinstateLoading}>
              Cancel
            </Button>
            <Button onClick={handleReinstate} disabled={reinstateLoading} className="gap-2">
              {reinstateLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><RotateCcw className="w-4 h-4" /> Reinstate</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveBusinesses;

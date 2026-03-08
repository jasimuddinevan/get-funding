import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, TrendingUp, ShieldCheck, Calendar, Globe, Users,
  DollarSign, BarChart3, FileText, Building2, Target, Percent, Clock,
  ArrowRight, Heart, Share2, MessageSquare, Loader2, CheckCircle2,
  Briefcase, Zap, Linkedin, Upload, Image as ImageIcon, CreditCard, Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Business = Tables<"businesses">;
type TeamMember = Tables<"business_team_members">;
type InvestmentTier = Tables<"investment_tiers">;

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `৳${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `৳${(val / 100000).toFixed(1)} Lakh`;
  return `৳${val.toLocaleString()}`;
};

const formatCurrencyFull = (val: number) => `৳${val.toLocaleString()}`;

interface BankAccount {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch_name: string | null;
  routing_number: string | null;
  instructions: string | null;
}

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tiers, setTiers] = useState<InvestmentTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [investorCount, setInvestorCount] = useState(0);
  const [isVerifiedInvestor, setIsVerifiedInvestor] = useState(false);

  const [investOpen, setInvestOpen] = useState(false);
  const [selectedTierIdx, setSelectedTierIdx] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "upload" | "success">("select");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [investmentId, setInvestmentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      const [bizRes, teamRes, tiersRes, investRes, bankRes] = await Promise.all([
        supabase.from("businesses").select("*").eq("id", id).maybeSingle(),
        supabase.from("business_team_members").select("*").eq("business_id", id),
        supabase.from("investment_tiers").select("*").eq("business_id", id).order("min_amount", { ascending: true }),
        supabase.from("investments").select("id", { count: "exact" }).eq("business_id", id).eq("status", "active"),
        supabase.from("payment_methods").select("id, bank_name, account_name, account_number, branch_name, routing_number, instructions").eq("is_active", true),
      ]);
      setBusiness(bizRes.data);
      setTeam(teamRes.data ?? []);
      setTiers(tiersRes.data ?? []);
      setInvestorCount(investRes.count ?? 0);
      const banks = (bankRes.data ?? []) as BankAccount[];
      setBankAccounts(banks);
      if (banks.length > 0) setSelectedBankId(banks[0].id);

      // Check if current user is a verified investor
      if (user) {
        const { count } = await supabase
          .from("investments")
          .select("id", { count: "exact", head: true })
          .eq("business_id", id)
          .eq("investor_id", user.id)
          .eq("status", "active");
        setIsVerifiedInvestor((count ?? 0) > 0);
      }

      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-12 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Business Not Found</h1>
          <p className="text-muted-foreground mb-6">The business you're looking for doesn't exist.</p>
          <Button asChild><Link to="/explore">Browse Businesses</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const fundedPct = business.funding_goal
    ? Math.round(((business.funded_amount ?? 0) / business.funding_goal) * 100)
    : 0;

  const openInvestDialog = (tierIdx?: number) => {
    if (!user) {
      toast.error("Please sign in to invest");
      navigate("/login");
      return;
    }
    if (userRole !== "investor" && userRole !== "business_owner") {
      toast.error("Only investors and business owners can make investments");
      return;
    }
    setSelectedTierIdx(tierIdx ?? null);
    setAmount(tierIdx != null && tiers[tierIdx] ? tiers[tierIdx].min_amount.toString() : (business.min_investment?.toString() ?? "50000"));
    setStep("select");
    setPaymentMethod("bkash");
    setProofFile(null);
    setProofPreview(null);
    setInvestmentId(null);
    setInvestOpen(true);
  };

  const selectedTier = selectedTierIdx != null ? tiers[selectedTierIdx] : null;
  const parsedAmount = parseInt(amount.replace(/,/g, ""), 10) || 0;
  const revenueShareForAmount = selectedTier?.revenue_share_pct ?? business.revenue_share_pct ?? 0;
  const minInvest = selectedTier?.min_amount ?? business.min_investment ?? 1000;
  const canConfirm = parsedAmount >= minInvest && parsedAmount <= (business.max_investment ?? 100000000);

  const handleConfirmInvest = async () => {
    if (!user || !canConfirm) return;
    setSubmitting(true);
    const { data, error } = await supabase.from("investments").insert({
      investor_id: user.id,
      business_id: business.id,
      amount: parsedAmount,
      revenue_share_pct: revenueShareForAmount,
      tier_id: selectedTier?.id ?? null,
      status: "pending_payment",
      payment_method: paymentMethod,
    }).select("id").single();

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }
    setInvestmentId(data.id);
    setStep("upload");
    setSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadProof = async () => {
    if (!proofPreview || !investmentId) return;
    setSubmitting(true);

    // Store proof as data URL in the column (no storage extension)
    const { error } = await supabase
      .from("investments")
      .update({
        payment_proof_url: proofPreview,
        status: "pending_approval",
      })
      .eq("id", investmentId);

    if (error) {
      toast.error("Failed to upload proof: " + error.message);
      setSubmitting(false);
      return;
    }

    // Notify admins (insert notification for all admins would be complex, so notify the investment owner for now)
    toast.success("Payment proof uploaded! Awaiting admin approval.");
    setStep("success");
    setSubmitting(false);
  };

  const currentRevenue = business.current_revenue ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back */}
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          {/* Hero Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-8 mb-10">
            {/* Left: Business Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center text-primary font-bold text-2xl shrink-0 shadow-md">
                  {business.logo_url ? (
                    <img src={business.logo_url} alt={business.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    business.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">{business.name}</h1>
                    {business.status === "approved" && (
                      <Badge className="gap-1 bg-primary/15 text-primary border-primary/30">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </Badge>
                    )}
                    {isVerifiedInvestor && (
                      <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Investor
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {business.industry && <Badge variant="secondary">{business.industry}</Badge>}
                    {business.location && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />{business.location}
                      </span>
                    )}
                    {business.founded_year && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />Founded {business.founded_year}
                      </span>
                    )}
                    {business.website && (
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Globe className="w-3.5 h-3.5" />Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">{business.description}</p>

              {business.pitch && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 mb-4">
                  <p className="text-sm font-medium text-foreground italic">"{business.pitch}"</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Heart className="w-4 h-4" /> Watchlist
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>

            {/* Right: Funding Card */}
            <Card className="border-border/40 w-full lg:w-[380px] shrink-0 self-start">
              <CardContent className="p-6">
                <div className="text-center mb-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total Funded</div>
                  <div className="font-display text-3xl font-bold text-foreground">{formatCurrency(business.funded_amount ?? 0)}</div>
                  <div className="text-sm text-muted-foreground">of {formatCurrency(business.funding_goal ?? 0)} goal</div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{fundedPct}%</span>
                  </div>
                  <Progress value={Math.min(fundedPct, 100)} className="h-2.5" />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{business.revenue_share_pct ?? 0}%</div>
                    <div className="text-[10px] text-muted-foreground">Rev. Share</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{investorCount}</div>
                    <div className="text-[10px] text-muted-foreground">Investors</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <BarChart3 className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{business.growth_rate ?? 0}%</div>
                    <div className="text-[10px] text-muted-foreground">Growth</div>
                  </div>
                </div>

                <Button className="w-full h-12 text-base gap-2" onClick={() => openInvestDialog()}>
                  Invest Now <ArrowRight className="w-5 h-5" />
                </Button>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  Min. investment starts at {formatCurrency(business.min_investment ?? 1000)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Key Metrics Strip */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: DollarSign, label: "Annual Revenue", value: formatCurrency(currentRevenue), color: "text-primary" },
              { icon: TrendingUp, label: "Growth Rate", value: `${business.growth_rate ?? 0}% YoY`, color: "text-emerald-500" },
              { icon: Percent, label: "Profit Margin", value: `${business.profit_margin ?? 0}%`, color: "text-blue-500" },
              { icon: Clock, label: "Payout Frequency", value: business.payout_frequency ? business.payout_frequency.charAt(0).toUpperCase() + business.payout_frequency.slice(1) : "N/A", color: "text-amber-500" },
            ].map((item) => (
              <Card key={item.label} className="border-border/40">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-secondary/70 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-border h-11">
              <TabsTrigger value="overview" className="gap-1.5"><Target className="w-3.5 h-3.5" /> Overview</TabsTrigger>
              <TabsTrigger value="tiers" className="gap-1.5"><Zap className="w-3.5 h-3.5" /> Investment Tiers</TabsTrigger>
              <TabsTrigger value="team" className="gap-1.5"><Users className="w-3.5 h-3.5" /> Team</TabsTrigger>
              <TabsTrigger value="qna" className="gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Q&A</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                {business.problem_solved && (
                  <Card className="border-border/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Problem Solved</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{business.problem_solved}</p></CardContent>
                  </Card>
                )}
                {business.target_market && (
                  <Card className="border-border/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Target Market</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{business.target_market}</p></CardContent>
                  </Card>
                )}
                {business.competitive_advantage && (
                  <Card className="border-border/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Competitive Advantage</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{business.competitive_advantage}</p></CardContent>
                  </Card>
                )}
                {business.financial_projection && (
                  <Card className="border-border/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Financial Projection</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{business.financial_projection}</p></CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Investment Tiers */}
            <TabsContent value="tiers">
              {tiers.length > 0 ? (
                <div className="grid sm:grid-cols-3 gap-5">
                  {tiers.map((tier, i) => {
                    const isPopular = i === Math.floor(tiers.length / 2);
                    return (
                      <Card key={tier.id} className={`relative overflow-hidden transition-all hover:shadow-lg ${isPopular ? "border-primary/50 ring-1 ring-primary/20" : "border-border/40"}`}>
                        {isPopular && (
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                            POPULAR
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h4 className="font-display text-xl font-bold text-foreground mb-1">{tier.name}</h4>
                          <div className="text-3xl font-bold text-primary mb-4">{tier.revenue_share_pct}%</div>
                          <Separator className="mb-4" />
                          <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Min. Investment</span>
                              <span className="font-semibold text-foreground">{formatCurrencyFull(tier.min_amount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Revenue Share</span>
                              <span className="font-bold text-primary">{tier.revenue_share_pct}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payout</span>
                              <span className="font-medium text-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tier.payout_frequency ? tier.payout_frequency.charAt(0).toUpperCase() + tier.payout_frequency.slice(1) : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Est. Monthly</span>
                              <span className="font-medium text-foreground">
                                ~{formatCurrency(Math.round((tier.min_amount * tier.revenue_share_pct) / 100 / 12))}
                              </span>
                            </div>
                          </div>
                          <Button
                            className={`w-full ${isPopular ? "" : ""}`}
                            variant={isPopular ? "default" : "outline"}
                            onClick={() => openInvestDialog(i)}
                          >
                            Select {tier.name}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="border-border/40">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No investment tiers available yet. You can still invest directly.</p>
                    <Button className="mt-4" onClick={() => openInvestDialog()}>Invest Now</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Team */}
            <TabsContent value="team">
              {team.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {team.map((member) => (
                    <Card key={member.id} className="border-border/40 hover:border-primary/30 transition-all group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xl shrink-0 group-hover:bg-primary/25 transition-colors">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-display text-lg font-semibold text-foreground">{member.name}</h4>
                            <div className="text-sm text-primary font-medium">{member.role}</div>
                          </div>
                        </div>
                        {member.bio && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                        )}
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3">
                            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border/40">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Team information will be available soon.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Q&A */}
            <TabsContent value="qna">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Common Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    { q: "How are revenue shares calculated?", a: "Revenue shares are calculated on gross revenue before expenses. Payouts are automated through FundBridge based on verified financial reports." },
                    { q: "What happens if the business underperforms?", a: "Revenue sharing is proportional — if revenue drops, payouts adjust accordingly. Your investment is tied to real performance, not fixed promises." },
                    { q: "Can I exit my investment early?", a: "After a 12-month lock-in period, you can list your share on FundBridge's secondary marketplace (coming soon)." },
                    { q: "How does payment verification work?", a: "After selecting an amount, you complete payment via bKash, Nagad, or bank transfer, then upload a screenshot/receipt. Our admin team verifies and activates your investment within 24 hours." },
                  ].map((item) => (
                    <div key={item.q} className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-semibold text-foreground text-sm mb-1.5">{item.q}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Investment Dialog */}
      <Dialog open={investOpen} onOpenChange={(open) => { if (!open) { setInvestOpen(false); setStep("select"); } }}>
        <DialogContent className="max-w-md bg-card border-border">
          {step === "select" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Invest in {business.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-4">
                {tiers.length > 0 && (
                  <div>
                    <Label className="mb-2 block text-sm">Select a Tier</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {tiers.map((tier, i) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setSelectedTierIdx(i);
                            if (parsedAmount < tier.min_amount) setAmount(tier.min_amount.toString());
                          }}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            selectedTierIdx === i
                              ? "border-primary bg-primary/10"
                              : "border-border bg-secondary/30 hover:border-primary/40"
                          }`}
                        >
                          <div className="text-xs font-semibold text-foreground">{tier.name}</div>
                          <div className="text-primary font-bold text-sm mt-1">{tier.revenue_share_pct}%</div>
                          <div className="text-[10px] text-muted-foreground">≥ {formatCurrencyFull(tier.min_amount)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="investAmount" className="mb-1.5 block text-sm">Investment Amount (৳)</Label>
                  <Input
                    id="investAmount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      const val = parseInt(e.target.value, 10) || 0;
                      if (tiers.length > 0) {
                        const matchedIdx = [...tiers].reverse().findIndex((t) => val >= t.min_amount);
                        setSelectedTierIdx(matchedIdx >= 0 ? tiers.length - 1 - matchedIdx : null);
                      }
                    }}
                    placeholder="Enter amount"
                    className="bg-secondary/50 border-border"
                    min={minInvest}
                  />
                  {parsedAmount > 0 && parsedAmount < minInvest && (
                    <p className="text-xs text-destructive mt-1">Minimum investment is {formatCurrencyFull(minInvest)}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {[50000, 100000, 250000, 500000, 1000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val.toString());
                        if (tiers.length > 0) {
                          const matchedIdx = [...tiers].reverse().findIndex((t) => val >= t.min_amount);
                          setSelectedTierIdx(matchedIdx >= 0 ? tiers.length - 1 - matchedIdx : null);
                        }
                      }}
                      className="px-3 py-1 rounded-full text-xs border border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all"
                    >
                      {formatCurrency(val)}
                    </button>
                  ))}
                </div>

                {bankAccounts.length > 0 && (
                  <div>
                    <Label className="mb-1.5 block text-sm">Select Bank Account</Label>
                    <div className="space-y-2">
                      {bankAccounts.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBankId(bank.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            selectedBankId === bank.id
                              ? "border-primary bg-primary/10"
                              : "border-border bg-secondary/30 hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Landmark className="w-5 h-5 text-primary shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-foreground">{bank.bank_name}</div>
                              <div className="text-xs text-muted-foreground">{bank.account_name} — {bank.account_number}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {canConfirm && (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold text-foreground">{formatCurrencyFull(parsedAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue Share</span>
                      <span className="font-semibold text-primary">{revenueShareForAmount}%</span>
                    </div>
                    {selectedTier && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tier</span>
                        <span className="font-medium text-foreground">{selectedTier.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment To</span>
                      <span className="font-medium text-foreground">{bankAccounts.find(b => b.id === selectedBankId)?.bank_name ?? "Bank Transfer"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Monthly Return</span>
                      <span className="font-semibold text-foreground">
                        ~{formatCurrencyFull(Math.round((parsedAmount * revenueShareForAmount) / 100 / 12))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setInvestOpen(false)}>Cancel</Button>
                <Button className="gap-2" disabled={!canConfirm} onClick={() => setStep("confirm")}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Confirm & Pay</DialogTitle>
              </DialogHeader>
              <div className="py-6 space-y-4">
                <div className="rounded-xl border border-border bg-secondary/20 p-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Business</span>
                    <span className="text-sm font-semibold text-foreground">{business.name}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-bold text-foreground">{formatCurrencyFull(parsedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue Share</span>
                    <span className="text-sm font-bold text-primary">{revenueShareForAmount}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      Bank Transfer
                    </span>
                  </div>
                  {selectedTier && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tier / Payout</span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedTier.name} — {selectedTier.payout_frequency ? selectedTier.payout_frequency.charAt(0).toUpperCase() + selectedTier.payout_frequency.slice(1) : "N/A"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bank Account Details */}
                {(() => {
                  const selectedBank = bankAccounts.find(b => b.id === selectedBankId);
                  return selectedBank ? (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-primary" /> Send Payment To
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank</span>
                          <span className="font-semibold text-foreground">{selectedBank.bank_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Name</span>
                          <span className="font-medium text-foreground">{selectedBank.account_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Number</span>
                          <span className="font-mono font-bold text-foreground">{selectedBank.account_number}</span>
                        </div>
                        {selectedBank.branch_name && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Branch</span>
                            <span className="font-medium text-foreground">{selectedBank.branch_name}</span>
                          </div>
                        )}
                        {selectedBank.routing_number && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Routing No.</span>
                            <span className="font-mono text-foreground">{selectedBank.routing_number}</span>
                          </div>
                        )}
                      </div>
                      {selectedBank.instructions && (
                        <p className="text-xs text-muted-foreground mt-3 italic border-t border-border/40 pt-2">
                          ℹ️ {selectedBank.instructions}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-secondary/10 p-4 text-center">
                      <p className="text-sm text-muted-foreground">No bank account details available. Please contact support.</p>
                    </div>
                  );
                })()}

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please send <strong className="text-foreground">{formatCurrencyFull(parsedAmount)}</strong> to the bank account above.
                    After completing the transfer, you'll upload a screenshot/receipt as proof.
                    Your investment will be activated once verified by our team.
                  </p>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  By confirming, you agree to the revenue-sharing terms.
                </p>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setStep("select")} disabled={submitting}>Back</Button>
                <Button className="gap-2" onClick={handleConfirmInvest} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {submitting ? "Processing..." : "I've Paid — Continue"}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "upload" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Payment Proof
                </DialogTitle>
              </DialogHeader>
              <div className="py-6 space-y-5">
                <p className="text-sm text-muted-foreground">
                  Upload a screenshot or photo of your payment receipt for admin verification.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {proofPreview ? (
                  <div className="relative group">
                    <img
                      src={proofPreview}
                      alt="Payment proof"
                      className="w-full max-h-64 object-contain rounded-xl border border-border bg-secondary/20"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                    >
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Change image
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 transition-colors bg-secondary/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Click to upload receipt</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                    </div>
                  </button>
                )}

                {proofFile && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {proofFile.name} ({(proofFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setStep("confirm")} disabled={submitting}>Back</Button>
                <Button
                  className="gap-2"
                  disabled={!proofFile || submitting}
                  onClick={handleUploadProof}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {submitting ? "Uploading..." : "Submit for Approval"}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "success" && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Payment Submitted!</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your investment of <strong className="text-foreground">{formatCurrencyFull(parsedAmount)}</strong> in{" "}
                <strong className="text-foreground">{business.name}</strong> is pending admin approval.
                You'll be notified once it's verified.
              </p>
              <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30">Pending Approval</Badge>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" onClick={() => setInvestOpen(false)}>Close</Button>
                <Button onClick={() => navigate("/investor")}>View Portfolio</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDetail;

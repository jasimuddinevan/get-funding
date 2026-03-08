import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import {
  Building2, FileText, DollarSign, BarChart3, CheckCircle2,
  ArrowRight, ArrowLeft, Loader2, Globe, MapPin
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Basic Info", icon: Building2 },
  { id: 2, label: "Business Details", icon: FileText },
  { id: 3, label: "Financials", icon: BarChart3 },
  { id: 4, label: "Investment Terms", icon: DollarSign },
  { id: 5, label: "Review & Submit", icon: CheckCircle2 },
];

const INDUSTRIES = [
  "Technology", "FinTech", "Healthcare", "Agriculture", "Clean Energy",
  "E-Commerce", "Education", "Manufacturing", "Real Estate", "Food & Beverage",
  "Logistics", "Fashion", "Media", "Other",
];

const PAYOUT_FREQUENCIES = ["Monthly", "Quarterly", "Semi-Annually", "Annually"];

interface FormData {
  name: string;
  industry: string;
  location: string;
  region: string;
  founded_year: string;
  website: string;
  description: string;
  pitch: string;
  problem_solved: string;
  target_market: string;
  competitive_advantage: string;
  current_revenue: string;
  growth_rate: string;
  profit_margin: string;
  financial_projection: string;
  funding_goal: string;
  min_investment: string;
  max_investment: string;
  revenue_share_pct: string;
  payout_frequency: string;
}

const initialFormData: FormData = {
  name: "", industry: "", location: "", region: "bd", founded_year: "",
  website: "", description: "", pitch: "", problem_solved: "",
  target_market: "", competitive_advantage: "", current_revenue: "",
  growth_rate: "", profit_margin: "", financial_projection: "",
  funding_goal: "", min_investment: "", max_investment: "",
  revenue_share_pct: "", payout_frequency: "Monthly",
};

const BusinessOnboarding = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const setSelect = (field: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  const canProceed = () => {
    switch (step) {
      case 1: return form.name.trim() && form.industry && form.location.trim() && form.description.trim();
      case 2: return form.pitch.trim();
      case 3: return form.current_revenue.trim() && form.funding_goal.trim();
      case 4: return form.revenue_share_pct.trim() && form.min_investment.trim();
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit a business.");
      navigate("/login");
      return;
    }
    if (userRole !== "business_owner" && userRole !== "investor") {
      toast.error("Only business owners and investors can submit businesses.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("businesses").insert({
      owner_id: user.id,
      name: form.name.trim(),
      industry: form.industry,
      location: form.location.trim(),
      region: form.region,
      founded_year: form.founded_year ? parseInt(form.founded_year) : null,
      website: form.website.trim() || null,
      description: form.description.trim(),
      pitch: form.pitch.trim(),
      problem_solved: form.problem_solved.trim() || null,
      target_market: form.target_market.trim() || null,
      competitive_advantage: form.competitive_advantage.trim() || null,
      current_revenue: parseFloat(form.current_revenue) || null,
      growth_rate: form.growth_rate ? parseFloat(form.growth_rate) : null,
      profit_margin: form.profit_margin ? parseFloat(form.profit_margin) : null,
      financial_projection: form.financial_projection.trim() || null,
      funding_goal: parseFloat(form.funding_goal) || null,
      min_investment: form.min_investment ? parseFloat(form.min_investment) : null,
      max_investment: form.max_investment ? parseFloat(form.max_investment) : null,
      revenue_share_pct: parseFloat(form.revenue_share_pct) || null,
      payout_frequency: form.payout_frequency || null,
      status: "pending",
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Business submitted for review!");
      navigate("/business-dashboard");
    }
  };

  const inputClass = "mt-1.5 bg-secondary/50 border-border";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">List Your Business</h1>
            <p className="text-muted-foreground">Complete the form below to submit your business for admin review.</p>
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((s) => (
              <div key={s.id} className="relative flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step >= s.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {step > s.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${step >= s.id ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Basic Information</h2>
                    <p className="text-sm text-muted-foreground mb-4">Tell us about your business.</p>

                    <div>
                      <Label htmlFor="name">Business Name *</Label>
                      <Input id="name" value={form.name} onChange={set("name")} placeholder="e.g. GreenTech Solutions" className={inputClass} maxLength={100} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Industry *</Label>
                        <Select value={form.industry} onValueChange={setSelect("industry")}>
                          <SelectTrigger className="mt-1.5 bg-secondary/50 border-border"><SelectValue placeholder="Select industry" /></SelectTrigger>
                          <SelectContent className="bg-card border-border z-50">
                            {INDUSTRIES.map((i) => (<SelectItem key={i} value={i}>{i}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" value={form.location} onChange={set("location")} placeholder="e.g. Dhaka, Bangladesh" className={inputClass} maxLength={100} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Region</Label>
                        <Select value={form.region} onValueChange={setSelect("region")}>
                          <SelectTrigger className="mt-1.5 bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-card border-border z-50">
                            <SelectItem value="bd"><span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />Bangladesh</span></SelectItem>
                            <SelectItem value="global"><span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" />Global</span></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="founded_year">Founded Year</Label>
                        <Input id="founded_year" type="number" value={form.founded_year} onChange={set("founded_year")} placeholder="e.g. 2020" className={inputClass} min={1900} max={2026} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" value={form.website} onChange={set("website")} placeholder="https://yourwebsite.com" className={inputClass} maxLength={255} />
                    </div>

                    <div>
                      <Label htmlFor="description">Business Description *</Label>
                      <Textarea id="description" value={form.description} onChange={set("description")} placeholder="Describe your business in a few sentences..." className="mt-1.5 bg-secondary/50 border-border min-h-[100px]" maxLength={1000} />
                      <p className="text-xs text-muted-foreground mt-1">{form.description.length}/1000</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Business Details</h2>
                    <p className="text-sm text-muted-foreground mb-4">Help investors understand your business better.</p>

                    <div>
                      <Label htmlFor="pitch">Elevator Pitch *</Label>
                      <Textarea id="pitch" value={form.pitch} onChange={set("pitch")} placeholder="A concise pitch for why investors should fund your business..." className="mt-1.5 bg-secondary/50 border-border min-h-[120px]" maxLength={500} />
                      <p className="text-xs text-muted-foreground mt-1">{form.pitch.length}/500</p>
                    </div>

                    <div>
                      <Label htmlFor="problem_solved">Problem You Solve</Label>
                      <Textarea id="problem_solved" value={form.problem_solved} onChange={set("problem_solved")} placeholder="What problem does your business solve?" className="mt-1.5 bg-secondary/50 border-border min-h-[80px]" maxLength={500} />
                    </div>

                    <div>
                      <Label htmlFor="target_market">Target Market</Label>
                      <Textarea id="target_market" value={form.target_market} onChange={set("target_market")} placeholder="Who are your customers?" className="mt-1.5 bg-secondary/50 border-border min-h-[80px]" maxLength={500} />
                    </div>

                    <div>
                      <Label htmlFor="competitive_advantage">Competitive Advantage</Label>
                      <Textarea id="competitive_advantage" value={form.competitive_advantage} onChange={set("competitive_advantage")} placeholder="What makes you different from competitors?" className="mt-1.5 bg-secondary/50 border-border min-h-[80px]" maxLength={500} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Financial Information</h2>
                    <p className="text-sm text-muted-foreground mb-4">Share your financial metrics to build investor confidence.</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="current_revenue">Current Monthly Revenue (৳) *</Label>
                        <Input id="current_revenue" type="number" value={form.current_revenue} onChange={set("current_revenue")} placeholder="e.g. 500000" className={inputClass} min={0} />
                      </div>
                      <div>
                        <Label htmlFor="funding_goal">Funding Goal (৳) *</Label>
                        <Input id="funding_goal" type="number" value={form.funding_goal} onChange={set("funding_goal")} placeholder="e.g. 5000000" className={inputClass} min={0} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="growth_rate">Monthly Growth Rate (%)</Label>
                        <Input id="growth_rate" type="number" value={form.growth_rate} onChange={set("growth_rate")} placeholder="e.g. 15" className={inputClass} min={0} max={1000} step={0.1} />
                      </div>
                      <div>
                        <Label htmlFor="profit_margin">Profit Margin (%)</Label>
                        <Input id="profit_margin" type="number" value={form.profit_margin} onChange={set("profit_margin")} placeholder="e.g. 25" className={inputClass} min={0} max={100} step={0.1} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="financial_projection">Financial Projection</Label>
                      <Textarea id="financial_projection" value={form.financial_projection} onChange={set("financial_projection")} placeholder="Describe your revenue projections for the next 12-24 months..." className="mt-1.5 bg-secondary/50 border-border min-h-[100px]" maxLength={1000} />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Investment Terms</h2>
                    <p className="text-sm text-muted-foreground mb-4">Define how investors can participate.</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="revenue_share_pct">Revenue Share (%) *</Label>
                        <Input id="revenue_share_pct" type="number" value={form.revenue_share_pct} onChange={set("revenue_share_pct")} placeholder="e.g. 12" className={inputClass} min={1} max={50} step={0.5} />
                        <p className="text-xs text-muted-foreground mt-1">Percentage of revenue shared with investors</p>
                      </div>
                      <div>
                        <Label>Payout Frequency</Label>
                        <Select value={form.payout_frequency} onValueChange={setSelect("payout_frequency")}>
                          <SelectTrigger className="mt-1.5 bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-card border-border z-50">
                            {PAYOUT_FREQUENCIES.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min_investment">Minimum Investment (৳) *</Label>
                        <Input id="min_investment" type="number" value={form.min_investment} onChange={set("min_investment")} placeholder="e.g. 10000" className={inputClass} min={0} />
                      </div>
                      <div>
                        <Label htmlFor="max_investment">Maximum Investment (৳)</Label>
                        <Input id="max_investment" type="number" value={form.max_investment} onChange={set("max_investment")} placeholder="e.g. 500000" className={inputClass} min={0} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Review & Submit</h2>
                    <p className="text-sm text-muted-foreground mb-4">Review your information before submitting for admin review.</p>

                    <div className="space-y-4">
                      <ReviewSection title="Basic Information">
                        <ReviewItem label="Business Name" value={form.name} />
                        <ReviewItem label="Industry" value={form.industry} />
                        <ReviewItem label="Location" value={form.location} />
                        <ReviewItem label="Region" value={form.region === "bd" ? "Bangladesh" : "Global"} />
                        {form.founded_year && <ReviewItem label="Founded" value={form.founded_year} />}
                        {form.website && <ReviewItem label="Website" value={form.website} />}
                        <ReviewItem label="Description" value={form.description} />
                      </ReviewSection>

                      <ReviewSection title="Business Details">
                        <ReviewItem label="Pitch" value={form.pitch} />
                        {form.problem_solved && <ReviewItem label="Problem Solved" value={form.problem_solved} />}
                        {form.target_market && <ReviewItem label="Target Market" value={form.target_market} />}
                        {form.competitive_advantage && <ReviewItem label="Competitive Advantage" value={form.competitive_advantage} />}
                      </ReviewSection>

                      <ReviewSection title="Financials">
                        <ReviewItem label="Monthly Revenue" value={`৳${Number(form.current_revenue).toLocaleString()}`} />
                        <ReviewItem label="Funding Goal" value={`৳${Number(form.funding_goal).toLocaleString()}`} />
                        {form.growth_rate && <ReviewItem label="Growth Rate" value={`${form.growth_rate}%`} />}
                        {form.profit_margin && <ReviewItem label="Profit Margin" value={`${form.profit_margin}%`} />}
                        {form.financial_projection && <ReviewItem label="Financial Projection" value={form.financial_projection} />}
                      </ReviewSection>

                      <ReviewSection title="Investment Terms">
                        <ReviewItem label="Revenue Share" value={`${form.revenue_share_pct}%`} />
                        <ReviewItem label="Payout Frequency" value={form.payout_frequency} />
                        <ReviewItem label="Min Investment" value={`৳${Number(form.min_investment).toLocaleString()}`} />
                        {form.max_investment && <ReviewItem label="Max Investment" value={`৳${Number(form.max_investment).toLocaleString()}`} />}
                      </ReviewSection>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-sm text-foreground">
                        <strong>Note:</strong> Your business will be reviewed by our admin team. You'll be notified once the review is complete. This usually takes 2-5 business days.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>

              {step < 5 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="gap-2 glow-gold"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-2 glow-gold"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Submit for Review</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ReviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border p-4">
    <h3 className="font-display text-sm font-semibold text-primary mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
    <span className="text-xs font-medium text-muted-foreground sm:w-36 shrink-0">{label}</span>
    <span className="text-sm text-foreground break-words">{value}</span>
  </div>
);

export default BusinessOnboarding;

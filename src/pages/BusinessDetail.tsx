import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, TrendingUp, ShieldCheck, Calendar, Globe, Users,
  DollarSign, BarChart3, FileText, Building2, Target, Percent, Clock,
  ArrowRight, Heart, Share2, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_BUSINESSES } from "@/data/businesses";

const EXTENDED_DATA: Record<string, {
  pitch: string;
  problem: string;
  market: string;
  advantage: string;
  team: { name: string; role: string; bio: string }[];
  financials: { revenue: string; growth: string; margin: string; projection: string };
  tiers: { name: string; min: string; share: string; payout: string }[];
  qna: { q: string; a: string }[];
}> = {
  default: {
    pitch: "We are building a scalable, high-impact business that leverages technology to disrupt traditional markets. Our revenue sharing model ensures investors benefit directly from our growth.",
    problem: "Traditional investment channels are inaccessible for small investors while quality businesses struggle to find fair funding outside of bank loans.",
    market: "The target market spans over 170 million consumers in Bangladesh and expanding into Southeast Asian markets worth $300B+.",
    advantage: "First-mover advantage in revenue-sharing model, proprietary technology, strong local partnerships, and admin-verified trust layer through FundBridge.",
    team: [
      { name: "Arif Rahman", role: "CEO & Founder", bio: "10+ years in industry, former VP at leading conglomerate. MBA from IBA, University of Dhaka." },
      { name: "Sarah Chen", role: "CTO", bio: "Ex-Google engineer, 8 years building scalable platforms. MS in CS from Stanford." },
      { name: "Kamal Hossain", role: "CFO", bio: "Chartered Accountant with 15 years of financial management experience in South Asia." },
    ],
    financials: { revenue: "৳2.5 Cr/year", growth: "45% YoY", margin: "22%", projection: "৳8 Cr by 2028" },
    tiers: [
      { name: "Starter", min: "৳50,000", share: "8%", payout: "Quarterly" },
      { name: "Growth", min: "৳2,00,000", share: "12%", payout: "Monthly" },
      { name: "Premium", min: "৳10,00,000", share: "16%", payout: "Monthly" },
    ],
    qna: [
      { q: "How are revenue shares calculated?", a: "Revenue shares are calculated on gross revenue before expenses. Payouts are automated through FundBridge based on verified financial reports." },
      { q: "What happens if the business underperforms?", a: "Revenue sharing is proportional — if revenue drops, payouts adjust accordingly. Your investment is tied to real performance, not fixed promises." },
      { q: "Can I exit my investment early?", a: "After a 12-month lock-in period, you can list your share on FundBridge's secondary marketplace (coming soon)." },
    ],
  },
};

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `৳${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `৳${(val / 100000).toFixed(1)} Lakh`;
  return `৳${val.toLocaleString()}`;
};

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const business = MOCK_BUSINESSES.find((b) => b.id === id);
  const ext = EXTENDED_DATA.default;

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center py-20">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Business Not Found</h1>
          <p className="text-muted-foreground mb-6">The business you're looking for doesn't exist.</p>
          <Button asChild><Link to="/explore">Browse Businesses</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const fundedPct = Math.round((business.funded / business.fundingGoal) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back */}
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-8 mb-10">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
                  {business.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">{business.name}</h1>
                    {business.verified && (
                      <Badge className="gap-1 bg-primary/15 text-primary border-primary/30">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <Badge variant="secondary">{business.industry}</Badge>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />{business.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />Founded {business.foundedYear}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{business.description}</p>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Heart className="w-4 h-4" /> Watchlist
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>

            {/* Funding Card */}
            <Card className="glass-card border-border/40 w-full lg:w-96 shrink-0">
              <CardContent className="p-6">
                <div className="text-center mb-5">
                  <div className="text-sm text-muted-foreground mb-1">Total Funded</div>
                  <div className="font-display text-3xl font-bold text-foreground">{formatCurrency(business.funded)}</div>
                  <div className="text-sm text-muted-foreground">of {formatCurrency(business.fundingGoal)} goal</div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{fundedPct}%</span>
                  </div>
                  <Progress value={fundedPct} className="h-2.5" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{business.revenueShare}%</div>
                    <div className="text-xs text-muted-foreground">Revenue Share</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">47</div>
                    <div className="text-xs text-muted-foreground">Investors</div>
                  </div>
                </div>

                <Button className="w-full glow-gold h-12 text-base gap-2">
                  Invest Now <ArrowRight className="w-5 h-5" />
                </Button>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  Min. investment starts at ৳50,000
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="terms">Revenue Terms</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="qna">Q&A</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card border-border/40">
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> The Pitch</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{ext.pitch}</p></CardContent>
                </Card>
                <Card className="glass-card border-border/40">
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Problem Solved</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{ext.problem}</p></CardContent>
                </Card>
                <Card className="glass-card border-border/40">
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Target Market</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{ext.market}</p></CardContent>
                </Card>
                <Card className="glass-card border-border/40">
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Competitive Advantage</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{ext.advantage}</p></CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financials">
              <Card className="glass-card border-border/40">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Financial Highlights</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: DollarSign, label: "Annual Revenue", value: ext.financials.revenue },
                      { icon: TrendingUp, label: "Growth Rate", value: ext.financials.growth },
                      { icon: Percent, label: "Profit Margin", value: ext.financials.margin },
                      { icon: Target, label: "Projected (3yr)", value: ext.financials.projection },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-xl bg-secondary/50 text-center">
                        <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="font-display text-xl font-bold text-foreground">{item.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card className="glass-card border-border/40">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Percent className="w-5 h-5 text-primary" /> Investment Tiers & Revenue Sharing</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {ext.tiers.map((tier, i) => (
                      <div key={tier.name} className={`rounded-xl p-5 border ${i === 1 ? "border-primary/50 bg-primary/5" : "border-border bg-secondary/30"}`}>
                        {i === 1 && <Badge className="mb-2 text-[10px]">Popular</Badge>}
                        <h4 className="font-display text-lg font-semibold text-foreground mb-3">{tier.name}</h4>
                        <Separator className="mb-3" />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Min. Investment</span>
                            <span className="font-medium text-foreground">{tier.min}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Revenue Share</span>
                            <span className="font-semibold text-primary">{tier.share}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payout</span>
                            <span className="font-medium text-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{tier.payout}</span>
                          </div>
                        </div>
                        <Button className={`w-full mt-4 ${i === 1 ? "glow-gold" : ""}`} variant={i === 1 ? "default" : "outline"} size="sm">
                          Select Tier
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <div className="grid sm:grid-cols-3 gap-6">
                {ext.team.map((member) => (
                  <Card key={member.name} className="glass-card border-border/40">
                    <CardContent className="p-5 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-3">
                        {member.name.charAt(0)}
                      </div>
                      <h4 className="font-display text-lg font-semibold text-foreground">{member.name}</h4>
                      <div className="text-sm text-primary mb-2">{member.role}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qna">
              <Card className="glass-card border-border/40">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Common Questions</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  {ext.qna.map((item) => (
                    <div key={item.q}>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{item.q}</h4>
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
    </div>
  );
};

export default BusinessDetail;

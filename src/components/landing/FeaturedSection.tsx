import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedBusiness {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  revenue_share_pct: number | null;
  funding_goal: number | null;
  funded_amount: number | null;
  status: string;
  description: string | null;
}

const truncateDescription = (text: string | null, maxWords = 35) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
};

const FeaturedSection = () => {
  const { t } = useLocale();
  const [businesses, setBusinesses] = useState<FeaturedBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      // Try featured first
      const { data: featured } = await supabase
        .from("businesses")
        .select("id, name, industry, location, revenue_share_pct, funding_goal, funded_amount, status, description")
        .eq("featured", true)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(16);

      if (featured && featured.length > 0) {
        setBusinesses(featured as FeaturedBusiness[]);
      } else {
        // Fallback: show latest approved businesses
        const { data: approved } = await supabase
          .from("businesses")
          .select("id, name, industry, location, revenue_share_pct, funding_goal, funded_amount, status, description")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(16);
        setBusinesses((approved as FeaturedBusiness[]) ?? []);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">{t("featured.label")}</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">{t("featured.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">{t("featured.subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm mb-4">No featured businesses yet. Be the first to list yours!</p>
            <Button asChild>
              <Link to="/signup">List Your Business</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {businesses.map((biz, i) => {
              const fundedPct = biz.funding_goal && biz.funded_amount
                ? Math.round((biz.funded_amount / biz.funding_goal) * 100)
                : 0;
              return (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/business/${biz.id}`}>
                    <Card className="bg-card border-border/50 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-primary/[0.06] hover:border-primary/40 transition-all duration-300 cursor-pointer group h-full overflow-hidden">
                      <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                        {/* Header: Avatar + Verified */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base">
                            {biz.name.charAt(0)}
                          </div>
                          <ShieldCheck className="w-5 h-5 text-primary/70" />
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors truncate leading-tight">
                          {biz.name}
                        </h3>

                        {/* Category & Location */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {biz.industry && (
                            <Badge variant="secondary" className="text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-border/60">
                              {biz.industry}
                            </Badge>
                          )}
                          {biz.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 shrink-0" />{biz.location}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {biz.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {truncateDescription(biz.description)}
                          </p>
                        )}

                        {/* Spacer to push bottom content down */}
                        <div className="mt-auto space-y-3">
                          {/* Revenue Share */}
                          {biz.revenue_share_pct != null && (
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              <span className="text-sm font-bold text-primary">{biz.revenue_share_pct}%</span>
                              <span className="text-xs text-muted-foreground">{t("featured.revenueShare")}</span>
                            </div>
                          )}

                          {/* Funding Progress */}
                          {biz.funding_goal && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{t("featured.funded")}</span>
                                <span className="text-foreground font-semibold">{fundedPct}%</span>
                              </div>
                              <Progress value={fundedPct} className="h-2 rounded-full" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8 sm:mt-10">
          <Button variant="outline" size="lg" className="gap-2 shadow-sm" asChild>
            <Link to="/explore">
              View All Businesses <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;

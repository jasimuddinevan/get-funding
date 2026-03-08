import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
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

const truncateDescription = (text: string | null, maxWords = 25) => {
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
      const { data: featured } = await supabase
        .from("businesses")
        .select("id, name, industry, location, revenue_share_pct, funding_goal, funded_amount, status, description")
        .eq("featured", true)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(8);

      if (featured && featured.length > 0) {
        setBusinesses(featured as FeaturedBusiness[]);
      } else {
        const { data: approved } = await supabase
          .from("businesses")
          .select("id, name, industry, location, revenue_share_pct, funding_goal, funded_amount, status, description")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(8);
        setBusinesses((approved as FeaturedBusiness[]) ?? []);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <p className="eyebrow mb-3">{t("featured.label")}</p>
          <h2 className="section-heading mb-4">{t("featured.title")}</h2>
          <p className="text-muted-foreground max-w-[520px] text-[17px]">{t("featured.subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm mb-4">No featured businesses yet. Be the first to list yours!</p>
            <Button asChild className="rounded-full">
              <Link to="/signup">List Your Business</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {businesses.map((biz, i) => {
              const fundedPct = biz.funding_goal && biz.funded_amount
                ? Math.round((biz.funded_amount / biz.funding_goal) * 100)
                : 0;
              return (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/business/${biz.id}`} className="block group">
                    <div className="surface-card p-6 h-full flex flex-col hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono font-bold text-sm">
                          {biz.name.charAt(0)}
                        </div>
                        {biz.industry && (
                          <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-border bg-secondary text-muted-foreground">
                            {biz.industry}
                          </Badge>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="font-sans text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                        {biz.name}
                      </h3>

                      {biz.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />{biz.location}
                        </span>
                      )}

                      {biz.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                          {truncateDescription(biz.description)}
                        </p>
                      )}

                      <div className="mt-auto space-y-3">
                        {biz.revenue_share_pct != null && (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-primary" />
                            <span className="font-mono text-sm font-semibold text-primary">{biz.revenue_share_pct}%</span>
                            <span className="text-[11px] text-muted-foreground">{t("featured.revenueShare")}</span>
                          </div>
                        )}

                        {biz.funding_goal && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">{t("featured.funded")}</span>
                              <span className="font-mono text-foreground">{fundedPct}%</span>
                            </div>
                            <Progress value={fundedPct} className="h-1.5 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="gap-2 rounded-full border-border hover:border-primary/50" asChild>
            <Link to="/explore">
              View All Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;

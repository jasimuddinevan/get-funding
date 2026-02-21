import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";

const businesses = [
  { id: "1", name: "GreenTech Solutions", industry: "Clean Energy", location: "Dhaka, BD", revenueShare: 12, fundingGoal: 5000000, funded: 3750000, verified: true },
  { id: "2", name: "AgroFresh Ltd", industry: "Agriculture", location: "Chittagong, BD", revenueShare: 15, fundingGoal: 2000000, funded: 1400000, verified: true },
  { id: "3", name: "FinEdge Global", industry: "FinTech", location: "Singapore", revenueShare: 10, fundingGoal: 10000000, funded: 6500000, verified: true },
  { id: "4", name: "MediCare Plus", industry: "Healthcare", location: "Dhaka, BD", revenueShare: 14, fundingGoal: 3000000, funded: 2100000, verified: true },
];

const FeaturedSection = () => {
  const { t } = useLocale();

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">{t("featured.label")}</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">{t("featured.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("featured.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {businesses.map((biz, i) => (
            <motion.div
              key={biz.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/business/${biz.id}`}>
                <Card className="bg-card border-border/60 shadow-md shadow-foreground/[0.03] hover:shadow-xl hover:shadow-primary/[0.08] hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
                        {biz.name.charAt(0)}
                      </div>
                      {biz.verified && <ShieldCheck className="w-5 h-5 text-primary" />}
                    </div>

                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {biz.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs shadow-sm">{biz.industry}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{biz.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">{biz.revenueShare}%</span>
                      <span className="text-xs text-muted-foreground">{t("featured.revenueShare")}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t("featured.funded")}</span>
                        <span className="text-foreground font-medium">
                          {Math.round((biz.funded / biz.fundingGoal) * 100)}%
                        </span>
                      </div>
                      <Progress value={(biz.funded / biz.fundingGoal) * 100} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
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

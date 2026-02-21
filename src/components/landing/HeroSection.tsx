import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Building2, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

const HeroSection = () => {
  const { t } = useLocale();

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.12)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.12)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6 sm:mb-8 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-[11px] sm:text-xs font-medium text-primary">{t("hero.badge")}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 px-2">
              <span className="text-gradient-gold">{t("hero.getInvestment")}</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button size="lg" className="glow-gold text-sm sm:text-base px-6 sm:px-8 h-12 shadow-lg shadow-primary/20 w-full sm:w-auto" asChild>
                <Link to="/signup">
                  {t("hero.startInvesting")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-sm sm:text-base px-6 sm:px-8 h-12 border-border hover:border-primary/50 shadow-sm w-full sm:w-auto" asChild>
                <Link to="/onboarding/business">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                  {t("hero.listBusiness")}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 sm:mt-16 px-2"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-card/60 dark:bg-card/30 border border-border/60 shadow-md backdrop-blur-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span>{t("hero.adminVerified")}</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span>{t("hero.revenueBased")}</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span>3,200+ Investors</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <span>🇧🇩</span>
                <span>{t("hero.bdGlobal")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

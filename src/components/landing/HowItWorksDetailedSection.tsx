import { motion } from "framer-motion";
import {
  FileText, ShieldCheck, Search, 
  Eye, HandCoins, BarChart3,
  CheckCircle2, Building2
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const steps = [
  { icon: FileText, number: "01", titleKey: "hiwd.step1", color: "text-primary" },
  { icon: ShieldCheck, number: "02", titleKey: "hiwd.step2", color: "text-emerald-500" },
  { icon: Eye, number: "03", titleKey: "hiwd.step3", color: "text-blue-500" },
  { icon: Search, number: "04", titleKey: "hiwd.step4", color: "text-amber-500" },
  { icon: HandCoins, number: "05", titleKey: "hiwd.step5", color: "text-violet-500" },
  { icon: BarChart3, number: "06", titleKey: "hiwd.step6", color: "text-rose-500" },
];

const StickyCard = ({ step, index, totalCards }: { step: typeof steps[0]; index: number; totalCards: number }) => {
  const { t } = useLocale();
  const Icon = step.icon;

  return (
    <div
      className="sticky top-24 mb-8 last:mb-0"
      style={{ zIndex: index + 1 }}
    >
      <div
        className="rounded-xl border border-border bg-card p-6 sm:p-8 min-h-[220px] sm:min-h-[240px] flex items-start transition-all duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 w-full">
          {/* Left side */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-muted-foreground/20 font-display">
                {step.number}
              </span>
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${step.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
              {t(`${step.titleKey}.subtitle`)}
            </span>

            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">
              {t(`${step.titleKey}.title`)}
            </h3>
          </div>

          {/* Right side */}
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t(`${step.titleKey}.desc`)}
            </p>

            <ul className="space-y-1.5">
              {["h1", "h2", "h3"].map((h) => (
                <li key={h} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{t(`${step.titleKey}.${h}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorksDetailedSection = () => {
  const { t } = useLocale();

  return (
    <section className="py-16 sm:py-24 bg-background relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">{t("hiwd.badge")}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("hiwd.title1")} <span className="text-gradient-gold">{t("hiwd.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            {t("hiwd.subtitle")}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <StickyCard
              key={step.number}
              step={step}
              index={index}
              totalCards={steps.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksDetailedSection;

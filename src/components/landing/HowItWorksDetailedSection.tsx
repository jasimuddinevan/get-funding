import { motion } from "framer-motion";
import {
  FileText, ShieldCheck, Search,
  Eye, HandCoins, BarChart3,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const steps = [
  { icon: FileText, number: "01", titleKey: "hiwd.step1" },
  { icon: ShieldCheck, number: "02", titleKey: "hiwd.step2" },
  { icon: Eye, number: "03", titleKey: "hiwd.step3" },
  { icon: Search, number: "04", titleKey: "hiwd.step4" },
  { icon: HandCoins, number: "05", titleKey: "hiwd.step5" },
  { icon: BarChart3, number: "06", titleKey: "hiwd.step6" },
];

const HowItWorksDetailedSection = () => {
  const { t } = useLocale();

  return (
    <section className="py-20 sm:py-28 bg-background relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <p className="eyebrow mb-3">{t("hiwd.badge")}</p>
          <h2 className="section-heading mb-4">
            {t("hiwd.title1")} <span className="italic text-primary">{t("hiwd.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-[520px] text-[17px]">{t("hiwd.subtitle")}</p>
        </motion.div>

        {/* Timeline grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="surface-card p-6 sm:p-8 group hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  {/* Left accent bar */}
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-mono text-[11px] text-primary font-medium">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="eyebrow text-muted-foreground block mb-1">
                      {t(`${step.titleKey}.subtitle`)}
                    </span>
                    <h3 className="font-sans text-lg font-semibold text-foreground mb-2">
                      {t(`${step.titleKey}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`${step.titleKey}.desc`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksDetailedSection;

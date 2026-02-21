import { motion } from "framer-motion";
import { Search, FileCheck, TrendingUp } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const HowItWorksSection = () => {
  const { t } = useLocale();

  const steps = [
    { icon: Search, step: "01", title: t("hiw.step1.title"), description: t("hiw.step1.desc") },
    { icon: FileCheck, step: "02", title: t("hiw.step2.title"), description: t("hiw.step2.desc") },
    { icon: TrendingUp, step: "03", title: t("hiw.step3.title"), description: t("hiw.step3.desc") },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">{t("hiw.label")}</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">{t("hiw.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("hiw.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="glass-card rounded-2xl p-8 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

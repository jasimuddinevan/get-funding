import { motion } from "framer-motion";
import { Building2, Users, DollarSign, BarChart3 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const StatsSection = () => {
  const { t } = useLocale();

  const stats = [
    { icon: Building2, value: "120+", label: t("stats.businessesFunded"), delay: 0 },
    { icon: DollarSign, value: "৳25Cr+", label: t("stats.totalInvested"), delay: 0.1 },
    { icon: Users, value: "3,200+", label: t("stats.activeInvestors"), delay: 0.2 },
    { icon: BarChart3, value: "18%", label: t("stats.avgReturns"), delay: 0.3 },
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              viewport={{ once: true }}
              className="rounded-2xl p-6 text-center bg-card border border-border/60 shadow-md shadow-foreground/[0.03] hover:shadow-lg hover:shadow-primary/[0.06] transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

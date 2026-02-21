import { motion } from "framer-motion";
import { Building2, Users, DollarSign, BarChart3 } from "lucide-react";

const stats = [
  { icon: Building2, value: "120+", label: "Businesses Funded", delay: 0 },
  { icon: DollarSign, value: "৳25Cr+", label: "Total Invested", delay: 0.1 },
  { icon: Users, value: "3,200+", label: "Active Investors", delay: 0.2 },
  { icon: BarChart3, value: "18%", label: "Avg. Returns", delay: 0.3 },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
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

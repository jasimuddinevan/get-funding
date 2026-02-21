import { motion } from "framer-motion";
import { Search, FileCheck, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Explore Businesses",
    description: "Browse admin-verified businesses with transparent financials, growth metrics, and revenue sharing terms.",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Invest with Confidence",
    description: "Choose your investment tier, review revenue sharing terms, and invest securely through our platform.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Earn Revenue Share",
    description: "Receive regular revenue-based returns as the business grows. Track your earnings in real-time.",
  },
];

const HowItWorksSection = () => {
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
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">How It Works</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Three Simple Steps
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From discovery to returns — our streamlined process makes investing simple and transparent.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
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

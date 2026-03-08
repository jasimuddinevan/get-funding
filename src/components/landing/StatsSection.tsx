import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-mono text-3xl sm:text-[40px] font-normal text-foreground">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const { t } = useLocale();

  const stats = [
    { value: 180, suffix: "M+", prefix: "$", label: "Raised to Date" },
    { value: 500, suffix: "+", prefix: "", label: t("stats.businessesFunded") },
    { value: 1200, suffix: "+", prefix: "", label: t("stats.activeInvestors") },
    { value: 94, suffix: "%", prefix: "", label: "Founder Satisfaction" },
  ];

  return (
    <section className="py-10 border-y border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x-0 lg:divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center py-6 lg:py-8"
            >
              <div className="mb-2">
                <span className="font-mono text-3xl sm:text-[40px] font-normal text-foreground">
                  {stat.prefix}
                </span>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="eyebrow text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

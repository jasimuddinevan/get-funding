import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { useState, useEffect, useCallback } from "react";

const TestimonialsSection = () => {
  const { t } = useLocale();

  const testimonials = [
    {
      name: "Rafiq Hassan",
      role: "Investor — Raised $420K across 3 deals",
      quote: "I've been investing through FundBridge for over a year now and the experience has been exceptional. The platform makes it incredibly easy to discover quality businesses and start earning through revenue sharing.",
    },
    {
      name: "Fatima Akter",
      role: "Founder @ GreenTech BD — raised $1.2M",
      quote: "As a business owner, getting funded used to be a nightmare. FundBridge changed everything for us. Within three weeks of approval, we had multiple investors lined up.",
    },
    {
      name: "David Chen",
      role: "Global Investor — 4 active investments",
      quote: "What sets FundBridge apart is the rigorous verification process. Every single business has been thoroughly vetted, which gives me tremendous confidence in where my money goes.",
    },
    {
      name: "Sarah Kim",
      role: "Founder @ NovaPay — raised $3.2M",
      quote: "We raised our seed round through FundBridge in record time. The quality of investors is exceptional — they genuinely care about the businesses they back.",
    },
  ];

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const tm = testimonials[current];

  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="eyebrow mb-3">{t("testimonials.label")}</p>
          <h2 className="section-heading">{t("testimonials.title")}</h2>
        </motion.div>

        {/* Large editorial quote */}
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Big quote mark */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-display text-[120px] leading-none text-primary/[0.08] select-none pointer-events-none">
            "
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[200px] flex flex-col items-center justify-center"
            >
              <blockquote className="font-display italic text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed max-w-[760px] mb-8">
                "{tm.quote}"
              </blockquote>
              <p className="text-sm text-muted-foreground">
                — {tm.name}, {tm.role}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

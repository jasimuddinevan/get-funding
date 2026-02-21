import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const TestimonialsSection = () => {
  const { t } = useLocale();

  const testimonials = [
    {
      name: "রফিক হাসান",
      nameEn: "Rafiq Hassan",
      role: "Investor",
      roleBn: "বিনিয়োগকারী",
      quote: "FundBridge made it incredibly easy to find quality businesses and earn consistent returns through revenue sharing.",
      quoteBn: "FundBridge মানসম্মত ব্যবসা খুঁজে পেতে এবং রাজস্ব শেয়ারিংয়ের মাধ্যমে ধারাবাহিক রিটার্ন অর্জন করতে অবিশ্বাস্যভাবে সহজ করে দিয়েছে।",
      rating: 5,
    },
    {
      name: "ফাতিমা আক্তার",
      nameEn: "Fatima Akter",
      role: "Founder, GreenTech BD",
      roleBn: "প্রতিষ্ঠাতা, গ্রিনটেক বিডি",
      quote: "The onboarding process was thorough but fair. Within weeks of approval, we had investors lining up.",
      quoteBn: "অনবোর্ডিং প্রক্রিয়াটি পুঙ্খানুপুঙ্খ কিন্তু ন্যায্য ছিল। অনুমোদনের কয়েক সপ্তাহের মধ্যেই বিনিয়োগকারীরা লাইনে দাঁড়িয়ে গেছে।",
      rating: 5,
    },
    {
      name: "David Chen",
      nameEn: "David Chen",
      role: "Global Investor",
      roleBn: "আন্তর্জাতিক বিনিয়োগকারী",
      quote: "The admin verification gives me confidence. Every business I see on FundBridge has been thoroughly vetted.",
      quoteBn: "প্রশাসনিক যাচাইকরণ আমাকে আত্মবিশ্বাস দেয়। FundBridge-এ আমি যে প্রতিটি ব্যবসা দেখি তা পুঙ্খানুপুঙ্খভাবে যাচাই করা হয়েছে।",
      rating: 5,
    },
  ];

  const isBn = t("testimonials.label") !== "Testimonials";

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">{t("testimonials.label")}</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{t("testimonials.title")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((tm, i) => (
            <motion.div
              key={tm.nameEn}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative rounded-xl sm:rounded-2xl p-5 sm:p-6 bg-card border border-border/60 shadow-md shadow-foreground/[0.03] hover:shadow-lg transition-shadow"
            >
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/15 absolute top-4 sm:top-5 right-4 sm:right-5" />
              <div className="flex gap-1 mb-3 sm:mb-4">
                {Array.from({ length: tm.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-5 sm:mb-6 leading-relaxed text-sm">
                "{isBn ? tm.quoteBn : tm.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs sm:text-sm shadow-inner shrink-0">
                  {(isBn ? tm.name : tm.nameEn).charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{isBn ? tm.name : tm.nameEn}</div>
                  <div className="text-xs text-muted-foreground">{isBn ? tm.roleBn : tm.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

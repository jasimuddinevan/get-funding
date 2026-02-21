import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useState, useEffect, useCallback } from "react";

const TestimonialsSection = () => {
  const { t } = useLocale();

  const testimonials = [
    {
      name: "রফিক হাসান",
      nameEn: "Rafiq Hassan",
      role: "Investor",
      roleBn: "বিনিয়োগকারী",
      quote: "I've been investing through FundBridge for over a year now and the experience has been exceptional. The platform makes it incredibly easy to discover quality businesses, review their financials, and start earning through revenue sharing. The transparency in reporting gives me full confidence in where my money is going.",
      quoteBn: "আমি এক বছরেরও বেশি সময় ধরে FundBridge-এর মাধ্যমে বিনিয়োগ করছি এবং অভিজ্ঞতাটি অসাধারণ। প্ল্যাটফর্মটি মানসম্মত ব্যবসা খুঁজে পেতে, তাদের আর্থিক বিবরণ পর্যালোচনা করতে এবং রাজস্ব ভাগাভাগির মাধ্যমে উপার্জন শুরু করতে অবিশ্বাস্যভাবে সহজ করে তোলে।",
      rating: 5,
    },
    {
      name: "ফাতিমা আক্তার",
      nameEn: "Fatima Akter",
      role: "Founder, GreenTech BD",
      roleBn: "প্রতিষ্ঠাতা, গ্রিনটেক বিডি",
      quote: "As a business owner, getting funded used to be a nightmare. FundBridge changed everything for us. The onboarding process was thorough but fair, and within just three weeks of approval, we had multiple investors lined up. Our growth has accelerated significantly since joining the platform.",
      quoteBn: "একজন ব্যবসার মালিক হিসেবে, তহবিল পাওয়া আগে দুঃস্বপ্নের মতো ছিল। FundBridge আমাদের জন্য সবকিছু বদলে দিয়েছে। অনবোর্ডিং প্রক্রিয়াটি পুঙ্খানুপুঙ্খ কিন্তু ন্যায্য ছিল এবং অনুমোদনের মাত্র তিন সপ্তাহের মধ্যে একাধিক বিনিয়োগকারী লাইনে দাঁড়িয়ে গেছে।",
      rating: 5,
    },
    {
      name: "David Chen",
      nameEn: "David Chen",
      role: "Global Investor",
      roleBn: "আন্তর্জাতিক বিনিয়োগকারী",
      quote: "What sets FundBridge apart is the rigorous admin verification process. Every single business I've seen on the platform has been thoroughly vetted, which gives me tremendous confidence. I've invested in four businesses so far and each one has delivered consistent monthly returns without any issues.",
      quoteBn: "FundBridge-কে যা আলাদা করে তা হল কঠোর প্রশাসনিক যাচাইকরণ প্রক্রিয়া। প্ল্যাটফর্মে আমি যে প্রতিটি ব্যবসা দেখেছি তা পুঙ্খানুপুঙ্খভাবে যাচাই করা হয়েছে, যা আমাকে অসাধারণ আত্মবিশ্বাস দেয়।",
      rating: 5,
    },
    {
      name: "নাসরিন জাহান",
      nameEn: "Nasrin Jahan",
      role: "Small Business Owner",
      roleBn: "ক্ষুদ্র ব্যবসার মালিক",
      quote: "FundBridge gave my small tailoring business the boost it needed. I was struggling to expand, but after listing on the platform, I received funding within a month. The revenue sharing model is fair and the support team guided me through every step of the process. Truly a game-changer for small entrepreneurs.",
      quoteBn: "FundBridge আমার ছোট দর্জি ব্যবসাকে প্রয়োজনীয় গতি দিয়েছে। আমি সম্প্রসারণে সংগ্রাম করছিলাম, কিন্তু প্ল্যাটফর্মে তালিকাভুক্ত হওয়ার পর এক মাসের মধ্যেই তহবিল পেয়েছি। রাজস্ব ভাগাভাগি মডেলটি ন্যায্য।",
      rating: 5,
    },
    {
      name: "Arjun Mehta",
      nameEn: "Arjun Mehta",
      role: "Angel Investor",
      roleBn: "এঞ্জেল বিনিয়োগকারী",
      quote: "I've used several crowdfunding platforms before, but none compare to FundBridge in terms of due diligence and investor protection. The detailed business profiles, financial projections, and admin reviews make it possible to make truly informed decisions. My portfolio here has outperformed my other investments consistently.",
      quoteBn: "আমি আগে বেশ কয়েকটি ক্রাউডফান্ডিং প্ল্যাটফর্ম ব্যবহার করেছি, কিন্তু যথাযথ পরিশ্রম এবং বিনিয়োগকারী সুরক্ষার ক্ষেত্রে কোনোটিই FundBridge-এর সাথে তুলনীয় নয়।",
      rating: 4,
    },
    {
      name: "সাবিনা ইয়াসমিন",
      nameEn: "Sabina Yasmin",
      role: "Restaurant Owner",
      roleBn: "রেস্তোরাঁর মালিক",
      quote: "When banks turned me down for a loan, FundBridge became my lifeline. I listed my restaurant on the platform and within weeks, I had enough funding to renovate and expand. The monthly revenue sharing feels manageable and fair. My restaurant revenue has grown by 40% since the expansion. Highly recommend this platform!",
      quoteBn: "যখন ব্যাংকগুলো আমাকে ঋণ দিতে অস্বীকার করেছিল, FundBridge আমার জীবনরেখা হয়ে উঠেছিল। আমি প্ল্যাটফর্মে আমার রেস্তোরাঁ তালিকাভুক্ত করেছি এবং কয়েক সপ্তাহের মধ্যেই সংস্কার ও সম্প্রসারণের জন্য পর্যাপ্ত তহবিল পেয়েছি।",
      rating: 5,
    },
    {
      name: "James O'Brien",
      nameEn: "James O'Brien",
      role: "Diaspora Investor",
      roleBn: "প্রবাসী বিনিয়োগকারী",
      quote: "As someone living abroad, I always wanted to invest back in Bangladesh but never trusted the traditional channels. FundBridge changed that completely. The platform's transparency, regular updates, and verified businesses make it possible for diaspora investors like me to contribute to the local economy while earning solid returns.",
      quoteBn: "বিদেশে বসবাসকারী হিসেবে, আমি সবসময় বাংলাদেশে বিনিয়োগ করতে চেয়েছিলাম কিন্তু প্রচলিত মাধ্যমগুলোতে কখনো বিশ্বাস করিনি। FundBridge সম্পূর্ণভাবে তা বদলে দিয়েছে।",
      rating: 5,
    },
    {
      name: "তানভীর আহমেদ",
      nameEn: "Tanvir Ahmed",
      role: "Tech Startup Founder",
      roleBn: "টেক স্টার্টআপ প্রতিষ্ঠাতা",
      quote: "We raised our seed round through FundBridge in record time. What impressed me most was the quality of investors — they're not just putting in money, they genuinely care about the businesses they back. The platform's dashboard gives us clear visibility into our obligations and the support team is always responsive.",
      quoteBn: "আমরা রেকর্ড সময়ে FundBridge-এর মাধ্যমে আমাদের সিড রাউন্ড সংগ্রহ করেছি। আমাকে সবচেয়ে বেশি মুগ্ধ করেছে বিনিয়োগকারীদের মান — তারা শুধু টাকা দিচ্ছে না, তারা সত্যিই ব্যবসাগুলোর প্রতি যত্নশীল।",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      nameEn: "Priya Sharma",
      role: "Portfolio Manager",
      roleBn: "পোর্টফোলিও ম্যানেজার",
      quote: "I manage investments for several clients and FundBridge has become a key part of our alternative investment strategy. The revenue-sharing model provides predictable cash flows that complement traditional equity investments nicely. The risk assessment tools and business analytics on the platform are genuinely institutional-grade.",
      quoteBn: "আমি বেশ কয়েকজন ক্লায়েন্টের জন্য বিনিয়োগ পরিচালনা করি এবং FundBridge আমাদের বিকল্প বিনিয়োগ কৌশলের একটি মূল অংশ হয়ে উঠেছে। রাজস্ব-ভাগাভাগি মডেল পূর্বানুমানযোগ্য নগদ প্রবাহ প্রদান করে।",
      rating: 4,
    },
  ];

  const isBn = t("testimonials.label") !== "Testimonials";
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Show 3 cards: current, current+1, current+2 (wrapping)
  const visible = [0, 1, 2].map((offset) => ({
    ...testimonials[(current + offset) % testimonials.length],
    idx: (current + offset) % testimonials.length,
  }));

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
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
            {t("testimonials.label")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {visible.map((tm) => (
                <motion.div
                  key={tm.nameEn + "-" + tm.idx}
                  initial={{ opacity: 0, x: 120 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -120 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative rounded-xl sm:rounded-2xl p-5 sm:p-6 bg-card border border-border/60"
                >
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/15 absolute top-4 sm:top-5 right-4 sm:right-5" />
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {Array.from({ length: tm.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-5 sm:mb-6 leading-relaxed text-sm min-h-[120px]">
                    "{isBn ? tm.quoteBn : tm.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs sm:text-sm shrink-0">
                      {(isBn ? tm.name : tm.nameEn).charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{isBn ? tm.name : tm.nameEn}</div>
                      <div className="text-xs text-muted-foreground">{isBn ? tm.roleBn : tm.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
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

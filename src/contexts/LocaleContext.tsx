import { createContext, useContext, useState, type ReactNode } from "react";

type Locale = "en" | "bn";

interface LocaleContextType {
  locale: Locale;
  region: "bd" | "global";
  setRegion: (r: "bd" | "global") => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Locale, string>> = {
  // Navbar
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.explore": { en: "Explore", bn: "অনুসন্ধান" },
  "nav.howItWorks": { en: "How It Works", bn: "কিভাবে কাজ করে" },
  "nav.about": { en: "About", bn: "আমাদের সম্পর্কে" },
  "nav.signIn": { en: "Sign In", bn: "সাইন ইন" },
  "nav.getStarted": { en: "Get Started", bn: "শুরু করুন" },
  "nav.bd": { en: "🇧🇩 Bangladesh", bn: "🇧🇩 বাংলাদেশ" },
  "nav.global": { en: "🌍 Global", bn: "🌍 আন্তর্জাতিক" },

  // Hero
  "hero.badge": { en: "Revenue Sharing Investment Platform", bn: "রাজস্ব শেয়ারিং বিনিয়োগ প্ল্যাটফর্ম" },
  "hero.title1": { en: "Bridging Businesses with", bn: "ব্যবসাকে সংযুক্ত করুন" },
  "hero.titleHighlight": { en: "Smart Capital", bn: "স্মার্ট মূলধনের সাথে" },
  "hero.subtitle": {
    en: "Connect with verified businesses, invest through transparent revenue sharing, and grow your wealth — from Bangladesh to the world.",
    bn: "যাচাইকৃত ব্যবসার সাথে সংযুক্ত হন, স্বচ্ছ রাজস্ব শেয়ারিংয়ে বিনিয়োগ করুন এবং আপনার সম্পদ বৃদ্ধি করুন — বাংলাদেশ থেকে বিশ্বে।",
  },
  "hero.startInvesting": { en: "Start Investing", bn: "বিনিয়োগ শুরু করুন" },
  "hero.listBusiness": { en: "List Your Business", bn: "আপনার ব্যবসা তালিকাভুক্ত করুন" },
  "hero.adminVerified": { en: "Admin Verified", bn: "প্রশাসক যাচাইকৃত" },
  "hero.revenueBased": { en: "Revenue Based Returns", bn: "রাজস্ব ভিত্তিক রিটার্ন" },
  "hero.bdGlobal": { en: "BD & Global Markets", bn: "বাংলাদেশ ও আন্তর্জাতিক বাজার" },
  "hero.getInvestment1": { en: "Get Investment for Your", bn: "আপনার ব্যাবসার জন্য" },
  "hero.getInvestment2": { en: "Startup Today", bn: "ইনভেস্টম্যান্ট সংগ্রহ করুন" },

  // Stats
  "stats.businessesFunded": { en: "Businesses Funded", bn: "অর্থায়িত ব্যবসা" },
  "stats.totalInvested": { en: "Total Invested", bn: "মোট বিনিয়োগ" },
  "stats.activeInvestors": { en: "Active Investors", bn: "সক্রিয় বিনিয়োগকারী" },
  "stats.avgReturns": { en: "Avg. Returns", bn: "গড় রিটার্ন" },

  // How it works
  "hiw.label": { en: "How It Works", bn: "কিভাবে কাজ করে" },
  "hiw.title": { en: "Three Simple Steps", bn: "তিনটি সহজ ধাপ" },
  "hiw.subtitle": {
    en: "From discovery to returns — our streamlined process makes investing simple and transparent.",
    bn: "আবিষ্কার থেকে রিটার্ন — আমাদের সহজ প্রক্রিয়া বিনিয়োগকে সহজ ও স্বচ্ছ করে তোলে।",
  },
  "hiw.step1.title": { en: "Explore Businesses", bn: "ব্যবসা অনুসন্ধান করুন" },
  "hiw.step1.desc": {
    en: "Browse admin-verified businesses with transparent financials, growth metrics, and revenue sharing terms.",
    bn: "স্বচ্ছ আর্থিক তথ্য, প্রবৃদ্ধি মেট্রিক্স এবং রাজস্ব শেয়ারিং শর্তাবলী সহ প্রশাসক-যাচাইকৃত ব্যবসা ব্রাউজ করুন।",
  },
  "hiw.step2.title": { en: "Invest with Confidence", bn: "আত্মবিশ্বাসের সাথে বিনিয়োগ করুন" },
  "hiw.step2.desc": {
    en: "Choose your investment tier, review revenue sharing terms, and invest securely through our platform.",
    bn: "আপনার বিনিয়োগ স্তর নির্বাচন করুন, রাজস্ব শেয়ারিং শর্তাবলী পর্যালোচনা করুন এবং আমাদের প্ল্যাটফর্মের মাধ্যমে নিরাপদে বিনিয়োগ করুন।",
  },
  "hiw.step3.title": { en: "Earn Revenue Share", bn: "রাজস্ব শেয়ার অর্জন করুন" },
  "hiw.step3.desc": {
    en: "Receive regular revenue-based returns as the business grows. Track your earnings in real-time.",
    bn: "ব্যবসা বৃদ্ধির সাথে সাথে নিয়মিত রাজস্ব-ভিত্তিক রিটার্ন পান। রিয়েল-টাইমে আপনার আয় ট্র্যাক করুন।",
  },

  // Featured
  "featured.label": { en: "Featured Opportunities", bn: "বিশেষ সুযোগ" },
  "featured.title": { en: "Verified Businesses", bn: "যাচাইকৃত ব্যবসা" },
  "featured.subtitle": {
    en: "Every business goes through a rigorous admin review before being listed.",
    bn: "প্রতিটি ব্যবসা তালিকাভুক্ত হওয়ার আগে কঠোর প্রশাসনিক পর্যালোচনার মধ্য দিয়ে যায়।",
  },
  "featured.revenueShare": { en: "revenue share", bn: "রাজস্ব শেয়ার" },
  "featured.funded": { en: "Funded", bn: "অর্থায়িত" },

  // Testimonials
  "testimonials.label": { en: "Testimonials", bn: "প্রশংসাপত্র" },
  "testimonials.title": { en: "What People Say", bn: "মানুষ কী বলে" },

  // Footer
  "footer.tagline": {
    en: "Bridging businesses with smart capital through transparent revenue sharing.",
    bn: "স্বচ্ছ রাজস্ব শেয়ারিংয়ের মাধ্যমে ব্যবসাকে স্মার্ট মূলধনের সাথে সংযুক্ত করা।",
  },
  "footer.platform": { en: "Platform", bn: "প্ল্যাটফর্ম" },
  "footer.exploreBiz": { en: "Explore Businesses", bn: "ব্যবসা অনুসন্ধান" },
  "footer.howItWorks": { en: "How It Works", bn: "কিভাবে কাজ করে" },
  "footer.listBiz": { en: "List Your Business", bn: "ব্যবসা তালিকাভুক্ত করুন" },
  "footer.startInvesting": { en: "Start Investing", bn: "বিনিয়োগ শুরু করুন" },
  "footer.company": { en: "Company", bn: "কোম্পানি" },
  "footer.aboutUs": { en: "About Us", bn: "আমাদের সম্পর্কে" },
  "footer.faq": { en: "FAQ", bn: "সাধারণ প্রশ্ন" },
  "footer.contact": { en: "Contact", bn: "যোগাযোগ" },
  "footer.terms": { en: "Terms & Privacy", bn: "শর্তাবলী ও গোপনীয়তা" },
  "footer.stayUpdated": { en: "Stay Updated", bn: "আপডেট থাকুন" },
  "footer.newsletter": { en: "Get the latest investment opportunities.", bn: "সর্বশেষ বিনিয়োগ সুযোগ পান।" },
  "footer.emailPlaceholder": { en: "Email address", bn: "ইমেইল ঠিকানা" },
  "footer.rights": { en: "© 2026 FundBridge. All rights reserved.", bn: "© ২০২৬ ফান্ডব্রিজ। সর্বস্বত্ব সংরক্ষিত।" },

  // Explore page
  "explore.title": { en: "Explore Businesses", bn: "ব্যবসা অনুসন্ধান করুন" },
  "explore.subtitle": {
    en: "Discover admin-verified businesses with transparent revenue sharing opportunities.",
    bn: "স্বচ্ছ রাজস্ব শেয়ারিং সুযোগ সহ প্রশাসক-যাচাইকৃত ব্যবসা আবিষ্কার করুন।",
  },
  "explore.search": { en: "Search businesses...", bn: "ব্যবসা খুঁজুন..." },
  "explore.filters": { en: "Filters", bn: "ফিল্টার" },
  "explore.industry": { en: "Industry", bn: "শিল্প" },
  "explore.location": { en: "Location", bn: "অবস্থান" },
  "explore.revenueShare": { en: "Revenue Share", bn: "রাজস্ব শেয়ার" },
  "explore.clearAll": { en: "Clear all", bn: "সব মুছুন" },
  "explore.found": { en: "found", bn: "পাওয়া গেছে" },
  "explore.business": { en: "business", bn: "ব্যবসা" },
  "explore.businesses": { en: "businesses", bn: "ব্যবসা" },
  "explore.noResults": { en: "No businesses match your filters.", bn: "আপনার ফিল্টারের সাথে কোনো ব্যবসা মিলছে না।" },
  "explore.clearFilters": { en: "Clear Filters", bn: "ফিল্টার মুছুন" },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<"bd" | "global">("bd");
  const locale: Locale = region === "bd" ? "bn" : "en";

  const t = (key: string): string => {
    return translations[key]?.[locale] ?? translations[key]?.en ?? key;
  };

  return (
    <LocaleContext.Provider value={{ locale, region, setRegion, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
};

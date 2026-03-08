import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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

  // How It Works Detailed
  "hiwd.badge": { en: "How The Platform Works", bn: "প্ল্যাটফর্ম কিভাবে কাজ করে" },
  "hiwd.title1": { en: "From Listing to", bn: "তালিকাভুক্তি থেকে" },
  "hiwd.title2": { en: "Earning", bn: "আয় পর্যন্ত" },
  "hiwd.subtitle": {
    en: "A complete guide for business owners and investors — understand every step of the journey from submitting a business to earning revenue returns.",
    bn: "ব্যবসার মালিক এবং বিনিয়োগকারীদের জন্য একটি সম্পূর্ণ গাইড — ব্যবসা জমা দেওয়া থেকে রাজস্ব রিটার্ন অর্জন পর্যন্ত প্রতিটি ধাপ বুঝুন।",
  },
  "hiwd.step1.subtitle": { en: "For Business Owners", bn: "ব্যবসার মালিকদের জন্য" },
  "hiwd.step1.title": { en: "Submit Your Business", bn: "আপনার ব্যবসা জমা দিন" },
  "hiwd.step1.desc": {
    en: "Start by creating your business profile. Fill in key details — business name, industry, location, revenue data, and your funding goal. Upload supporting documents like trade licenses, financial statements, and team info.",
    bn: "আপনার ব্যবসার প্রোফাইল তৈরি করে শুরু করুন। মূল বিবরণ পূরণ করুন — ব্যবসার নাম, শিল্প, অবস্থান, রাজস্ব তথ্য এবং আপনার অর্থায়ন লক্ষ্য। ট্রেড লাইসেন্স, আর্থিক বিবরণী এবং দলের তথ্যের মতো সহায়ক নথি আপলোড করুন।",
  },
  "hiwd.step1.h1": { en: "Complete onboarding form", bn: "অনবোর্ডিং ফর্ম সম্পূর্ণ করুন" },
  "hiwd.step1.h2": { en: "Upload verification documents", bn: "যাচাইকরণ নথি আপলোড করুন" },
  "hiwd.step1.h3": { en: "Set funding goal & revenue share %", bn: "অর্থায়ন লক্ষ্য ও রাজস্ব শেয়ার % সেট করুন" },
  "hiwd.step2.subtitle": { en: "Verification Process", bn: "যাচাইকরণ প্রক্রিয়া" },
  "hiwd.step2.title": { en: "Admin Review & Approval", bn: "প্রশাসনিক পর্যালোচনা ও অনুমোদন" },
  "hiwd.step2.desc": {
    en: "Our admin team carefully reviews every submission. We verify documents, check financial claims, and assess business viability. This ensures only legitimate, high-quality businesses appear on the platform.",
    bn: "আমাদের প্রশাসক দল প্রতিটি জমা সাবধানে পর্যালোচনা করে। আমরা নথি যাচাই করি, আর্থিক দাবি পরীক্ষা করি এবং ব্যবসার কার্যক্ষমতা মূল্যায়ন করি। এটি নিশ্চিত করে যে শুধুমাত্র বৈধ, উচ্চমানের ব্যবসা প্ল্যাটফর্মে প্রদর্শিত হয়।",
  },
  "hiwd.step2.h1": { en: "Document verification", bn: "নথি যাচাইকরণ" },
  "hiwd.step2.h2": { en: "Financial audit check", bn: "আর্থিক অডিট পরীক্ষা" },
  "hiwd.step2.h3": { en: "Business legitimacy review", bn: "ব্যবসার বৈধতা পর্যালোচনা" },
  "hiwd.step3.subtitle": { en: "Published & Visible", bn: "প্রকাশিত ও দৃশ্যমান" },
  "hiwd.step3.title": { en: "Business Goes Live", bn: "ব্যবসা লাইভ হয়" },
  "hiwd.step3.desc": {
    en: "Once approved, your business listing goes live on the Explore page. Investors can now discover your business, view detailed financials, revenue projections, team info, and investment tiers.",
    bn: "অনুমোদিত হলে, আপনার ব্যবসার তালিকা এক্সপ্লোর পৃষ্ঠায় লাইভ হয়ে যায়। বিনিয়োগকারীরা এখন আপনার ব্যবসা আবিষ্কার করতে, বিস্তারিত আর্থিক তথ্য, রাজস্ব অনুমান, দলের তথ্য এবং বিনিয়োগ স্তর দেখতে পারবেন।",
  },
  "hiwd.step3.h1": { en: "Listed on Explore page", bn: "এক্সপ্লোর পৃষ্ঠায় তালিকাভুক্ত" },
  "hiwd.step3.h2": { en: "Visible to all investors", bn: "সকল বিনিয়োগকারীর কাছে দৃশ্যমান" },
  "hiwd.step3.h3": { en: "Detailed profile & financials shown", bn: "বিস্তারিত প্রোফাইল ও আর্থিক তথ্য প্রদর্শিত" },
  "hiwd.step4.subtitle": { en: "For Investors", bn: "বিনিয়োগকারীদের জন্য" },
  "hiwd.step4.title": { en: "Investors Discover Businesses", bn: "বিনিয়োগকারীরা ব্যবসা আবিষ্কার করেন" },
  "hiwd.step4.desc": {
    en: "Investors browse the platform to find verified businesses. Filter by industry, location, revenue share percentage, and funding progress. Each listing shows transparent data to help make informed decisions.",
    bn: "বিনিয়োগকারীরা যাচাইকৃত ব্যবসা খুঁজতে প্ল্যাটফর্ম ব্রাউজ করেন। শিল্প, অবস্থান, রাজস্ব শেয়ার শতাংশ এবং অর্থায়ন অগ্রগতি অনুযায়ী ফিল্টার করুন। প্রতিটি তালিকা সিদ্ধান্ত নিতে সাহায্যের জন্য স্বচ্ছ তথ্য প্রদর্শন করে।",
  },
  "hiwd.step4.h1": { en: "Advanced search & filters", bn: "উন্নত অনুসন্ধান ও ফিল্টার" },
  "hiwd.step4.h2": { en: "Transparent business data", bn: "স্বচ্ছ ব্যবসায়িক তথ্য" },
  "hiwd.step4.h3": { en: "Risk assessment tools", bn: "ঝুঁকি মূল্যায়ন টুল" },
  "hiwd.step5.subtitle": { en: "Revenue Sharing Model", bn: "রাজস্ব শেয়ারিং মডেল" },
  "hiwd.step5.title": { en: "Invest & Choose a Tier", bn: "বিনিয়োগ করুন ও স্তর বেছে নিন" },
  "hiwd.step5.desc": {
    en: "Investors select an investment tier based on their budget. Each tier offers a different revenue share percentage. Investments are tracked in real-time through the investor dashboard with full transparency.",
    bn: "বিনিয়োগকারীরা তাদের বাজেট অনুযায়ী একটি বিনিয়োগ স্তর নির্বাচন করেন। প্রতিটি স্তর ভিন্ন রাজস্ব শেয়ার শতাংশ প্রদান করে। সম্পূর্ণ স্বচ্ছতার সাথে বিনিয়োগকারী ড্যাশবোর্ডের মাধ্যমে বিনিয়োগ রিয়েল-টাইমে ট্র্যাক করা হয়।",
  },
  "hiwd.step5.h1": { en: "Multiple investment tiers", bn: "একাধিক বিনিয়োগ স্তর" },
  "hiwd.step5.h2": { en: "Flexible revenue share options", bn: "নমনীয় রাজস্ব শেয়ার বিকল্প" },
  "hiwd.step5.h3": { en: "Real-time tracking dashboard", bn: "রিয়েল-টাইম ট্র্যাকিং ড্যাশবোর্ড" },
  "hiwd.step6.subtitle": { en: "Ongoing Payouts", bn: "চলমান পেআউট" },
  "hiwd.step6.title": { en: "Earn Revenue Returns", bn: "রাজস্ব রিটার্ন অর্জন করুন" },
  "hiwd.step6.desc": {
    en: "As the business generates revenue, investors receive their share based on the agreed percentage. Payouts are tracked, reported, and distributed through the platform — creating a win-win for both parties.",
    bn: "ব্যবসা রাজস্ব উৎপন্ন করার সাথে সাথে, বিনিয়োগকারীরা সম্মত শতাংশের উপর ভিত্তি করে তাদের অংশ পান। পেআউট ট্র্যাক করা হয়, রিপোর্ট করা হয় এবং প্ল্যাটফর্মের মাধ্যমে বিতরণ করা হয় — উভয় পক্ষের জন্য একটি জয়-জয় পরিস্থিতি তৈরি করে।",
  },
  "hiwd.step6.h1": { en: "Automated payout tracking", bn: "স্বয়ংক্রিয় পেআউট ট্র্যাকিং" },
  "hiwd.step6.h2": { en: "Transparent revenue reports", bn: "স্বচ্ছ রাজস্ব রিপোর্ট" },
  "hiwd.step6.h3": { en: "Consistent passive income", bn: "ধারাবাহিক প্যাসিভ আয়" },
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

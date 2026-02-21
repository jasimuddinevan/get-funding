import { motion } from "framer-motion";
import { 
  FileText, ClipboardCheck, Search, ShieldCheck, 
  TrendingUp, Users, Building2, ArrowRight,
  CheckCircle2, Eye, HandCoins, BarChart3
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Submit Your Business",
    subtitle: "For Business Owners",
    description: "Start by creating your business profile. Fill in key details — business name, industry, location, revenue data, and your funding goal. Upload supporting documents like trade licenses, financial statements, and team info.",
    highlights: ["Complete onboarding form", "Upload verification documents", "Set funding goal & revenue share %"],
    color: "text-primary",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Admin Review & Approval",
    subtitle: "Verification Process",
    description: "Our admin team carefully reviews every submission. We verify documents, check financial claims, and assess business viability. This ensures only legitimate, high-quality businesses appear on the platform.",
    highlights: ["Document verification", "Financial audit check", "Business legitimacy review"],
    color: "text-emerald-500",
  },
  {
    icon: Eye,
    number: "03",
    title: "Business Goes Live",
    subtitle: "Published & Visible",
    description: "Once approved, your business listing goes live on the Explore page. Investors can now discover your business, view detailed financials, revenue projections, team info, and investment tiers.",
    highlights: ["Listed on Explore page", "Visible to all investors", "Detailed profile & financials shown"],
    color: "text-blue-500",
  },
  {
    icon: Search,
    number: "04",
    title: "Investors Discover Businesses",
    subtitle: "For Investors",
    description: "Investors browse the platform to find verified businesses. Filter by industry, location, revenue share percentage, and funding progress. Each listing shows transparent data to help make informed decisions.",
    highlights: ["Advanced search & filters", "Transparent business data", "Risk assessment tools"],
    color: "text-amber-500",
  },
  {
    icon: HandCoins,
    number: "05",
    title: "Invest & Choose a Tier",
    subtitle: "Revenue Sharing Model",
    description: "Investors select an investment tier based on their budget. Each tier offers a different revenue share percentage. Investments are tracked in real-time through the investor dashboard with full transparency.",
    highlights: ["Multiple investment tiers", "Flexible revenue share options", "Real-time tracking dashboard"],
    color: "text-violet-500",
  },
  {
    icon: BarChart3,
    number: "06",
    title: "Earn Revenue Returns",
    subtitle: "Ongoing Payouts",
    description: "As the business generates revenue, investors receive their share based on the agreed percentage. Payouts are tracked, reported, and distributed through the platform — creating a win-win for both parties.",
    highlights: ["Automated payout tracking", "Transparent revenue reports", "Consistent passive income"],
    color: "text-rose-500",
  },
];

const HowItWorksDetailedSection = () => {
  const { t } = useLocale();

  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">How The Platform Works</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            From Listing to <span className="text-gradient-gold">Earning</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            A complete guide for business owners and investors — understand every step of the journey from submitting a business to earning revenue returns.
          </p>
        </motion.div>

        {/* 2-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300 p-5 sm:p-6 hover:shadow-lg hover:shadow-primary/5">
                {/* Top row: number + icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-muted-foreground/20 font-display">
                    {step.number}
                  </span>
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${step.color} group-hover:bg-primary/10 transition-colors`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Subtitle badge */}
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  {step.subtitle}
                </span>

                {/* Title */}
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5">
                  {step.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksDetailedSection;

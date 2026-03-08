import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

const HeroSection = () => {
  const { t } = useLocale();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-primary/[0.06] rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] mb-6">
                <span className="text-muted-foreground">The smarter way to</span>
                <br />
                <span className="italic text-foreground">get funded.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-[480px] leading-[1.7] mb-8"
            >
              Connect with vetted investors. Close rounds faster. Built for ambitious founders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-8"
            >
              <Button
                size="lg"
                className="rounded-full px-8 h-12 bg-primary text-primary-foreground font-semibold btn-glow hover:brightness-110 transition-all"
                asChild
              >
                <Link to="/signup">
                  Apply for Funding
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Link
                to="/explore"
                className="relative text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-3 group"
              >
                Browse Investors →
                <span className="absolute bottom-2 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <span className="font-mono text-[13px]">500+ Funded Startups</span>
              <span className="text-border">·</span>
              <span className="font-mono text-[13px]">$180M+ Raised</span>
              <span className="text-border">·</span>
              <span className="font-mono text-[13px]">92% Match Rate</span>
            </motion.div>
          </div>

          {/* Right: Floating deal card mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            {/* Green glow behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.06] rounded-full blur-3xl" />

            <div className="relative surface-card p-8 max-w-sm mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="eyebrow mb-1">Featured Deal</p>
                  <h3 className="font-display text-2xl text-foreground">TechVenture BD</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="surface-card p-4 !border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Funding Stage</p>
                  <p className="font-mono text-foreground font-medium">Series A</p>
                </div>
                <div className="surface-card p-4 !border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Target</p>
                  <p className="font-mono text-foreground font-medium">$2.4M</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-mono text-foreground">68%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs text-muted-foreground font-medium">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-mono">24 investors</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

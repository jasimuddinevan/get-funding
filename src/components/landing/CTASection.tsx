import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-[1100px] mx-auto rounded-3xl sm:rounded-[24px] p-10 sm:p-16 text-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(160 30% 8%) 0%, hsl(220 20% 4%) 100%)",
            border: "1px solid hsl(160 100% 39% / 0.15)",
          }}
        >
          {/* Floating particles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
                animationDelay: `${i * 1.2}s`,
              }}
            />
          ))}

          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-[52px] text-foreground leading-tight mb-4 relative z-10">
            Ready to close your round?
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8 relative z-10">
            Join 500+ founders who found their investors on FundBridge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 bg-primary text-primary-foreground font-semibold btn-glow hover:brightness-110 transition-all"
              asChild
            >
              <Link to="/signup">
                Apply Now <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 border-foreground/20 hover:border-primary/50"
              asChild
            >
              <Link to="/about">Talk to Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

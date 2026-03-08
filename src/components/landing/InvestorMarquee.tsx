import { motion } from "framer-motion";

const investors = [
  "Sequoia Capital",
  "Andreessen Horowitz",
  "Y Combinator",
  "Grameenphone Accelerator",
  "Bangladesh Angel Network",
  "Tiger Global",
  "Lightspeed",
  "Accel Partners",
  "Founders Fund",
  "SoftBank Vision",
];

const InvestorMarquee = () => {
  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <p className="eyebrow text-center">Investor Network</p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee whitespace-nowrap">
          {[...investors, ...investors].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display italic text-xl text-muted-foreground/30 mx-12 select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestorMarquee;

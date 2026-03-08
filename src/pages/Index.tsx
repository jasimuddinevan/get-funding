import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturedSection from "@/components/landing/FeaturedSection";
import InvestorMarquee from "@/components/landing/InvestorMarquee";
import HowItWorksDetailedSection from "@/components/landing/HowItWorksDetailedSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedSection />
        <InvestorMarquee />
        <HowItWorksDetailedSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

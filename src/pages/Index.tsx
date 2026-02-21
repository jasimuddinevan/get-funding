import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturedSection from "@/components/landing/FeaturedSection";
import HowItWorksDetailedSection from "@/components/landing/HowItWorksDetailedSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedSection />
        <HowItWorksDetailedSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

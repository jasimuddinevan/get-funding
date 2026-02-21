import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturedSection from "@/components/landing/FeaturedSection";
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
        <TestimonialsSection />
      </main>
      <div className="h-16" /> {/* Spacer for footer CTA overlap */}
      <Footer />
    </div>
  );
};

export default Index;

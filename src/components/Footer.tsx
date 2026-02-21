import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin, Shield, ExternalLink } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const Footer = () => {
  const { t } = useLocale();

  return (
    <footer className="bg-card border-t border-border shadow-[0_-1px_30px_-15px_hsl(var(--foreground)/0.06)]">
      {/* CTA Banner */}
      <div className="container mx-auto px-4 pt-8 sm:pt-12">
        <div className="relative mb-8 sm:mb-12 p-6 sm:p-8 lg:p-12 text-center">
          <div className="absolute inset-0" />
          <div className="relative z-10">
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              Ready to Start Investing?
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-5 sm:mb-6 text-xs sm:text-sm">
              Join thousands of investors earning consistent returns through verified revenue-sharing businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <Button className="glow-gold shadow-md px-5 sm:px-6 gap-2 w-full sm:w-auto" asChild>
                <Link to="/signup">Create Free Account <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button variant="outline" className="shadow-sm px-5 sm:px-6 gap-2 w-full sm:w-auto" asChild>
                <Link to="/explore">Browse Businesses <ExternalLink className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-primary-foreground font-bold text-sm">FB</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Fund<span className="text-primary">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/70 shrink-0" />
                <span>support@fundbridge.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary/70 shrink-0" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3 sm:mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore Businesses</Link></li>
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Start Investing</Link></li>
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">List Your Business</Link></li>
              <li><Link to="/investor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investor Dashboard</Link></li>
              <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Revenue Sharing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Press & Media</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
        </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[11px] sm:text-xs text-muted-foreground">{t("footer.rights")}</p>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
              <span>Admin-Verified</span>
            </div>
            <span className="w-px h-3 bg-border" />
            <span>Bangladesh 🇧🇩 & Global 🌍</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

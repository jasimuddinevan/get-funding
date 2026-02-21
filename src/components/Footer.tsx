import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Mail, Phone, MapPin, Shield, TrendingUp, Building2, ExternalLink } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const Footer = () => {
  const { t } = useLocale();

  return (
    <footer className="bg-card border-t border-border shadow-[0_-1px_30px_-15px_hsl(var(--foreground)/0.06)]">
      {/* CTA Banner */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-12 rounded-2xl bg-primary/[0.08] border border-primary/20 p-8 sm:p-12 text-center shadow-lg shadow-primary/5 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.05),transparent_50%)]" />
          <div className="relative z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ready to Start Investing?
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-sm">
              Join thousands of investors earning consistent returns through verified revenue-sharing businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="glow-gold shadow-md px-6 gap-2" asChild>
                <Link to="/signup">Create Free Account <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button variant="outline" className="shadow-sm px-6 gap-2" asChild>
                <Link to="/explore">Browse Businesses <ExternalLink className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
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
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/70" />
                <span>support@fundbridge.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary/70" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore Businesses</Link></li>
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Start Investing</Link></li>
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">List Your Business</Link></li>
              <li><Link to="/investor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investor Dashboard</Link></li>
              <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Revenue Sharing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Press & Media</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Resources & Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5 mb-6">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 rounded-xl border border-border bg-secondary/30 p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground text-sm mb-1">{t("footer.stayUpdated")}</h4>
            <p className="text-xs text-muted-foreground">{t("footer.newsletter")}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input placeholder={t("footer.emailPlaceholder")} className="bg-card h-9 text-sm shadow-sm w-full sm:w-60" />
            <Button size="sm" className="h-9 px-4 shadow-sm glow-gold">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Admin-Verified Businesses</span>
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

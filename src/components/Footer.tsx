import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const Footer = () => {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FB</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Fund<span className="text-primary">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">{t("footer.platform")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.exploreBiz")}</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.howItWorks")}</Link></li>
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.listBiz")}</Link></li>
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.startInvesting")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.aboutUs")}</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.faq")}</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">{t("footer.stayUpdated")}</h4>
            <p className="text-sm text-muted-foreground mb-3">{t("footer.newsletter")}</p>
            <div className="flex gap-2">
              <Input placeholder={t("footer.emailPlaceholder")} className="bg-muted/50 h-9 text-sm" />
              <Button size="sm" className="h-9 px-3">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
          <p className="text-xs text-muted-foreground">Bangladesh 🇧🇩 & Global 🌍</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

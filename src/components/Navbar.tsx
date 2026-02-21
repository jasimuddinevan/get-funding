import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, MapPin, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { region, setRegion, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">FB</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Fund<span className="text-primary">Bridge</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.home")}</Link>
          <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.explore")}</Link>
          <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.about")}</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setRegion(region === "bd" ? "global" : "bd")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            {region === "bd" ? (
              <><MapPin className="w-3.5 h-3.5" />{t("nav.bd")}</>
            ) : (
              <><Globe className="w-3.5 h-3.5" />{t("nav.global")}</>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">{t("nav.signIn")}</Link>
          </Button>
          <Button size="sm" className="glow-gold" asChild>
            <Link to="/signup">{t("nav.getStarted")}</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>{t("nav.home")}</Link>
              <Link to="/explore" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>{t("nav.explore")}</Link>
              <Link to="/how-it-works" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>{t("nav.howItWorks")}</Link>
              <Link to="/about" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>{t("nav.about")}</Link>
              <button
                onClick={() => setRegion(region === "bd" ? "global" : "bd")}
                className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground"
              >
                {region === "bd" ? t("nav.bd") : t("nav.global")}
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground"
              >
                {theme === "light" ? <><Moon className="w-4 h-4" /> Dark Mode</> : <><Sun className="w-4 h-4" /> Light Mode</>}
              </button>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/login">{t("nav.signIn")}</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/signup">{t("nav.getStarted")}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, MapPin, Sun, Moon, ChevronDown, Building2, TrendingUp, Shield, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { region, setRegion, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { user, userRole, signOut } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Companies" },
    { to: "/onboarding/business", label: "Get Listed" },
    { to: "/investor", label: "Investors" },
    { to: "/about", label: "About" },
    ...(user && userRole === "admin" ? [{ to: "/admin", label: "Admin Panel" }] : []),
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-foreground/[0.03] dark:bg-card/50 border-b border-border/60">
        <div className="container mx-auto flex items-center justify-between h-9 px-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>📧 support@fundbridge.io</span>
            <span className="w-px h-3 bg-border" />
            <span>📞 +880 1700-000000</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setRegion(region === "bd" ? "global" : "bd")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {region === "bd" ? (
                <><MapPin className="w-3 h-3" /> Bangladesh</>
              ) : (
                <><Globe className="w-3 h-3" /> Global</>
              )}
            </button>
            <span className="w-px h-3 bg-border" />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <><Moon className="w-3 h-3" /> Dark</> : <><Sun className="w-3 h-3" /> Light</>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/60 shadow-sm dark:shadow-none">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-primary-foreground font-bold text-sm">FB</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Fund<span className="text-primary">Bridge</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-xs text-muted-foreground mr-1 hidden lg:block">{user.email}</span>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="shadow-sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t("nav.signIn")}</Link>
                </Button>
                <Button size="sm" className="glow-gold shadow-md" asChild>
                  <Link to="/signup">{t("nav.getStarted")}</Link>
                </Button>
              </>
            )}
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
              className="md:hidden bg-card border-t border-border"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-sm py-2.5 px-3 rounded-lg text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center justify-between py-2 px-3">
                  <button onClick={() => setRegion(region === "bd" ? "global" : "bd")} className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {region === "bd" ? <><MapPin className="w-3.5 h-3.5" /> Bangladesh</> : <><Globe className="w-3.5 h-3.5" /> Global</>}
                  </button>
                  <button onClick={toggleTheme} className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {theme === "light" ? <><Moon className="w-3.5 h-3.5" /> Dark</> : <><Sun className="w-3.5 h-3.5" /> Light</>}
                  </button>
                </div>
                <div className="flex gap-2 pt-3 border-t border-border mt-2">
                  {user ? (
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { signOut(); setMobileOpen(false); }}>
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to="/login" onClick={() => setMobileOpen(false)}>{t("nav.signIn")}</Link>
                      </Button>
                      <Button size="sm" className="flex-1 glow-gold" asChild>
                        <Link to="/signup" onClick={() => setMobileOpen(false)}>{t("nav.getStarted")}</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;

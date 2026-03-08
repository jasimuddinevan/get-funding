import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, MapPin, Sun, Moon } from "lucide-react";
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
    { to: "/explore", label: "Deals" },
    ...(user && (userRole === "business_owner") ? [{ to: "/business-dashboard", label: "My Businesses" }] : []),
    ...(user && (userRole === "business_owner" || !userRole) && !user ? [{ to: "/onboarding/business", label: "For Founders" }] : []),
    ...(!user ? [{ to: "/onboarding/business", label: "For Founders" }] : []),
    ...(user && userRole === "investor" ? [{ to: "/investor", label: "Dashboard" }] : []),
    ...(!user ? [{ to: "/investor", label: "Investors" }] : []),
    { to: "/about", label: "About" },
    ...(user && userRole === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      {/* Accent strip */}
      <div className="accent-strip w-full" />

      {/* Main Navbar */}
      <nav className="sticky top-0 left-0 right-0 z-50 h-16 bg-background/85 backdrop-blur-xl backdrop-saturate-[1.8] border-b border-foreground/[0.06]">
        <div className="container mx-auto flex items-center justify-between h-full px-4">
          {/* Wordmark Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-display text-[22px] text-foreground">
              Fund<span className="text-primary">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setRegion(region === "bd" ? "global" : "bd")}
              className="text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border hover:border-primary/40"
            >
              {region === "bd" ? (
                <><MapPin className="w-3.5 h-3.5" /> বাংলা</>
              ) : (
                <><Globe className="w-3.5 h-3.5" /> EN</>
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {user ? (
              <>
                <span className="text-xs text-muted-foreground hidden lg:block">{user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link to="/login">{t("nav.signIn")}</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-5 bg-primary text-primary-foreground font-semibold btn-glow hover:brightness-110 transition-all"
                  asChild
                >
                  <Link to="/signup">Get Funded</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden fixed inset-0 top-[65px] bg-background/98 backdrop-blur-xl z-50"
            >
              <div className="container mx-auto px-6 py-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg py-3 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-4 py-4 border-t border-border mt-4">
                  <button onClick={() => setRegion(region === "bd" ? "global" : "bd")} className="text-sm text-muted-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border">
                    {region === "bd" ? <><MapPin className="w-3.5 h-3.5" /> বাংলা</> : <><Globe className="w-3.5 h-3.5" /> English</>}
                  </button>
                  <button onClick={toggleTheme} className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  {user ? (
                    <Button variant="outline" onClick={() => { signOut(); setMobileOpen(false); }}>
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link to="/login" onClick={() => setMobileOpen(false)}>{t("nav.signIn")}</Link>
                      </Button>
                      <Button className="rounded-full bg-primary text-primary-foreground font-semibold btn-glow" asChild>
                        <Link to="/signup" onClick={() => setMobileOpen(false)}>Get Funded</Link>
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

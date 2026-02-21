import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useState<"bd" | "global">("bd");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">FB</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Fund<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Location Toggle */}
          <button
            onClick={() => setLocation(location === "bd" ? "global" : "bd")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            {location === "bd" ? (
              <>
                <MapPin className="w-3.5 h-3.5" />
                🇧🇩 Bangladesh
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                🌍 Global
              </>
            )}
          </button>

          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" className="glow-gold" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/explore" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>Explore</Link>
              <Link to="/how-it-works" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link to="/about" className="text-sm py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>About</Link>
              <button
                onClick={() => setLocation(location === "bd" ? "global" : "bd")}
                className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground"
              >
                {location === "bd" ? "🇧🇩 Bangladesh" : "🌍 Global"}
              </button>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/signup">Get Started</Link>
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

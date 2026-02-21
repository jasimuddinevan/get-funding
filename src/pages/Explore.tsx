import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { MOCK_BUSINESSES, INDUSTRIES } from "@/data/businesses";

const LOCATIONS = ["All Locations", "Bangladesh", "Global"] as const;

const Explore = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [location, setLocation] = useState("All Locations");
  const [revenueRange, setRevenueRange] = useState([0, 20]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_BUSINESSES.filter((b) => {
      if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (industry !== "All Industries" && b.industry !== industry) return false;
      if (location === "Bangladesh" && b.region !== "bd") return false;
      if (location === "Global" && b.region !== "global") return false;
      if (b.revenueShare < revenueRange[0] || b.revenueShare > revenueRange[1]) return false;
      return true;
    });
  }, [search, industry, location, revenueRange]);

  const activeFilterCount = [
    industry !== "All Industries",
    location !== "All Locations",
    revenueRange[0] > 0 || revenueRange[1] < 20,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setIndustry("All Industries");
    setLocation("All Locations");
    setRevenueRange([0, 20]);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">
              Explore Businesses
            </h1>
            <p className="text-muted-foreground">
              Discover admin-verified businesses with transparent revenue sharing opportunities.
            </p>
          </motion.div>

          {/* Search & Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary/50 border-border h-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <div className="flex border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 h-10 flex items-center justify-center transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 h-10 flex items-center justify-center transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl p-5 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 gap-1">
                    <X className="w-3 h-3" /> Clear all
                  </Button>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-secondary/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="bg-secondary/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Revenue Share: {revenueRange[0]}% — {revenueRange[1]}%
                  </label>
                  <Slider
                    value={revenueRange}
                    onValueChange={setRevenueRange}
                    min={0}
                    max={20}
                    step={1}
                    className="mt-3"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-4">
            {filtered.length} business{filtered.length !== 1 ? "es" : ""} found
          </div>

          {/* Business Cards */}
          {filtered.length > 0 ? (
            <div className={view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {filtered.map((biz, i) => (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <BusinessCard business={biz} view={view} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <p className="text-muted-foreground mb-3">No businesses match your filters.</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Search, MapPin, TrendingUp, DollarSign, Loader2, Star, Globe, ExternalLink, SlidersHorizontal, X,
} from "lucide-react";
import { INDUSTRIES } from "@/data/businesses";

interface Business {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  region: string | null;
  description: string | null;
  current_revenue: number | null;
  funding_goal: number | null;
  funded_amount: number | null;
  revenue_share_pct: number | null;
  founded_year: number | null;
  featured: boolean;
  created_at: string;
  status: string;
}

const LOCATIONS = ["All Locations", "Bangladesh", "Global"] as const;

const ActiveBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [location, setLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      setBusinesses((data as Business[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !(b.description ?? "").toLowerCase().includes(q)) return false;
      }
      if (industry !== "All Industries" && b.industry !== industry) return false;
      if (location === "Bangladesh" && b.region !== "bd") return false;
      if (location === "Global" && b.region !== "global") return false;
      return true;
    });
  }, [businesses, search, industry, location]);

  const activeFilterCount = [industry !== "All Industries", location !== "All Locations"].filter(Boolean).length;

  const clearFilters = () => {
    setIndustry("All Industries");
    setLocation("All Locations");
    setSearch("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Businesses</h1>
        <p className="text-muted-foreground text-sm mt-1">All active and published businesses on the platform.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border h-10"
          />
        </div>
        <Button variant="outline" size="sm" className="h-10 gap-2" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">{activeFilterCount}</Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Filters</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 gap-1">
                <X className="w-3 h-3" /> Clear All
              </Button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {INDUSTRIES.map((ind) => (<SelectItem key={ind} value={ind}>{ind}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {LOCATIONS.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length !== 1 ? "businesses" : "business"} found
      </div>

      {/* Business List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="py-12 text-center">
            <Building2 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No businesses found.</p>
            {(search || activeFilterCount > 0) && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-3">Clear Filters</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((biz, i) => (
            <motion.div
              key={biz.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Card className="border-border/40 hover:border-primary/30 transition-all hover:shadow-md group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-foreground truncate">{biz.name}</h3>
                        {biz.featured && (
                          <Star className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {biz.industry && <Badge variant="secondary" className="text-[10px]">{biz.industry}</Badge>}
                        {biz.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {biz.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <a href={`/business/${biz.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-primary transition-colors shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {biz.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{biz.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {biz.funding_goal && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <DollarSign className="w-3 h-3 text-primary" />
                        <span className="text-muted-foreground">Goal:</span>
                        <span className="font-medium text-foreground">৳{(biz.funding_goal / 1000000).toFixed(1)}M</span>
                      </div>
                    )}
                    {biz.revenue_share_pct && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span className="text-muted-foreground">Share:</span>
                        <span className="font-medium text-foreground">{biz.revenue_share_pct}%</span>
                      </div>
                    )}
                    {biz.region && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Globe className="w-3 h-3 text-primary" />
                        <span className="font-medium text-foreground">{biz.region === "bd" ? "Bangladesh" : "Global"}</span>
                      </div>
                    )}
                    {biz.funded_amount != null && biz.funding_goal ? (
                      <div className="flex items-center gap-1.5 text-xs">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                        <span className="font-medium text-foreground">{Math.round((biz.funded_amount / biz.funding_goal) * 100)}% funded</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Funding progress */}
                  {biz.funded_amount != null && biz.funding_goal ? (
                    <div className="mt-3">
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min(100, (biz.funded_amount / biz.funding_goal) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveBusinesses;

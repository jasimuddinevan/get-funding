import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bookmark, MapPin, TrendingUp, Trash2, Heart, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface WatchlistItem {
  id: string;
  business_id: string;
  created_at: string;
  businesses?: {
    name: string;
    industry: string | null;
    location: string | null;
    revenue_share_pct: number | null;
    funding_goal: number | null;
    funded_amount: number | null;
    description: string | null;
  } | null;
}

const Watchlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("watchlists")
      .select("*, businesses(name, industry, location, revenue_share_pct, funding_goal, funded_amount, description)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setItems((data as WatchlistItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  const removeFromWatchlist = async (id: string) => {
    const { error } = await supabase.from("watchlists").delete().eq("id", id);
    if (error) {
      toast.error("Failed to remove");
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Removed from watchlist");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Watchlist</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Businesses you're keeping an eye on.
          </p>
        </div>
        {items.length > 0 && (
          <Badge variant="secondary" className="text-xs self-start sm:self-auto">
            {items.length} saved
          </Badge>
        )}
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" /> Saved Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Your watchlist is empty</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                Save businesses you're interested in to track them here.
              </p>
              <Button size="sm" asChild>
                <Link to="/explore">Browse Businesses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item, i) => {
                const biz = item.businesses;
                const fundedPct = biz?.funding_goal
                  ? Math.min(((biz.funded_amount ?? 0) / biz.funding_goal) * 100, 100)
                  : 0;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/business/${item.business_id}`}
                          className="font-semibold text-foreground text-sm hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {biz?.name ?? "Unknown"}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {biz?.industry && (
                            <Badge variant="secondary" className="text-[10px]">{biz.industry}</Badge>
                          )}
                          {biz?.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />{biz.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {biz?.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{biz.description}</p>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      {biz?.revenue_share_pct != null && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                          <TrendingUp className="w-3.5 h-3.5" />{biz.revenue_share_pct}%
                        </span>
                      )}
                      {biz?.funding_goal != null && (
                        <span className="text-xs text-muted-foreground">
                          Goal: ৳{biz.funding_goal.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Funded</span>
                        <span className="text-foreground font-medium">{Math.round(fundedPct)}%</span>
                      </div>
                      <Progress value={fundedPct} className="h-1.5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Watchlist;

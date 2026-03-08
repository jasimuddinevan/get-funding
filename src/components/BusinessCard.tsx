import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, ShieldCheck, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Business = Tables<"businesses">;

interface BusinessCardProps {
  business: Business;
  view: "grid" | "list";
}

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `৳${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `৳${(val / 100000).toFixed(1)}L`;
  return `৳${val.toLocaleString()}`;
};

const truncateDescription = (text: string | null, maxWords = 35) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
};

const BusinessCard = ({ business: biz, view }: BusinessCardProps) => {
  const pct = biz.funding_goal ? Math.round(((biz.funded_amount ?? 0) / biz.funding_goal) * 100) : 0;

  if (view === "list") {
    return (
      <Link to={`/business/${biz.id}`}>
        <Card className="bg-card border-border/50 rounded-2xl hover:shadow-lg hover:shadow-primary/[0.06] hover:border-primary/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                {biz.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {biz.name}
                  </h3>
                  {biz.status === "approved" && <ShieldCheck className="w-4 h-4 text-primary/70 shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground truncate leading-relaxed">{truncateDescription(biz.description, 20)}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 flex-wrap">
              {biz.industry && (
                <Badge variant="secondary" className="text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-border/60">
                  {biz.industry}
                </Badge>
              )}
              {biz.location && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />{biz.location}
                </span>
              )}
              {biz.revenue_share_pct != null && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
                  <TrendingUp className="w-4 h-4" />{biz.revenue_share_pct}%
                </span>
              )}
              {biz.funding_goal && (
                <div className="w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{formatCurrency(biz.funded_amount ?? 0)}</span>
                    <span className="text-foreground font-semibold">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2 rounded-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/business/${biz.id}`}>
      <Card className="bg-card border-border/50 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-primary/[0.06] hover:border-primary/40 transition-all duration-300 cursor-pointer group h-full overflow-hidden">
        <CardContent className="p-5 sm:p-6 flex flex-col h-full">
          {/* Header: Avatar + Verified */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base">
              {biz.name.charAt(0)}
            </div>
            {biz.status === "approved" && <ShieldCheck className="w-5 h-5 text-primary/70" />}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors truncate leading-tight">
            {biz.name}
          </h3>

          {/* Category & Location */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {biz.industry && (
              <Badge variant="secondary" className="text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-border/60">
                {biz.industry}
              </Badge>
            )}
            {biz.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />{biz.location}
              </span>
            )}
          </div>

          {/* Description */}
          {biz.description && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
              {truncateDescription(biz.description)}
            </p>
          )}

          {/* Bottom content pushed down */}
          <div className="mt-auto space-y-3">
            {/* Revenue Share */}
            <div className="flex items-center justify-between">
              {biz.revenue_share_pct != null && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">{biz.revenue_share_pct}%</span>
                  <span className="text-xs text-muted-foreground">share</span>
                </div>
              )}
              {biz.founded_year && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />{biz.founded_year}
                </span>
              )}
            </div>

            {/* Funding Progress */}
            {biz.funding_goal && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{formatCurrency(biz.funded_amount ?? 0)} / {formatCurrency(biz.funding_goal)}</span>
                  <span className="text-foreground font-semibold">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2 rounded-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;

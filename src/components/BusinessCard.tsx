import { Badge } from "@/components/ui/badge";
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
        <Card className="rounded-lg border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-md cursor-pointer group">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">{biz.name.charAt(0)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {biz.name}
                  </h3>
                  {biz.status === "approved" && <ShieldCheck className="w-4 h-4 text-primary/70 shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground truncate leading-relaxed">{truncateDescription(biz.description, 20)}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 flex-wrap">
              {biz.industry && (
                <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                  {biz.industry}
                </Badge>
              )}
              {biz.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />{biz.location}
                </span>
              )}
              {biz.revenue_share_pct != null && (
                <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-primary">
                  <TrendingUp className="w-4 h-4" />{biz.revenue_share_pct}%
                </span>
              )}
              {biz.funding_goal && (
                <div className="w-32">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{formatCurrency(biz.funded_amount ?? 0)}</span>
                    <span className="font-mono font-medium text-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
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
      <Card className="rounded-lg border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-md cursor-pointer group h-full overflow-hidden">
        <CardContent className="p-5 sm:p-6 flex flex-col h-full">
          {/* Header: Avatar + Verified */}
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary">{biz.name.charAt(0)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {biz.industry && (
                <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                  {biz.industry}
                </Badge>
              )}
              {biz.status === "approved" && <ShieldCheck className="w-4 h-4 text-primary/70" />}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate leading-snug">
            {biz.name}
          </h3>

          {/* Location */}
          {biz.location && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />{biz.location}
            </p>
          )}

          {/* Description */}
          {biz.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
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
                  <span className="font-mono text-sm font-semibold text-primary">{biz.revenue_share_pct}%</span>
                  <span className="text-sm text-muted-foreground">share</span>
                </div>
              )}
              {biz.founded_year && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />{biz.founded_year}
                </span>
              )}
            </div>

            {/* Funding Progress */}
            {biz.funding_goal && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{formatCurrency(biz.funded_amount ?? 0)} / {formatCurrency(biz.funding_goal)}</span>
                  <span className="font-mono font-medium text-foreground">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;

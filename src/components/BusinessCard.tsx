import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, ShieldCheck, Calendar } from "lucide-react";
import { type Business } from "@/data/businesses";
import { Link } from "react-router-dom";

interface BusinessCardProps {
  business: Business;
  view: "grid" | "list";
}

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `৳${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `৳${(val / 100000).toFixed(1)}L`;
  return `৳${val.toLocaleString()}`;
};

const BusinessCard = ({ business: biz, view }: BusinessCardProps) => {
  const pct = Math.round((biz.funded / biz.fundingGoal) * 100);

  if (view === "list") {
    return (
      <Link to={`/business/${biz.id}`}>
        <Card className="glass-card border-border/40 hover:border-primary/30 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold shrink-0">
                {biz.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {biz.name}
                  </h3>
                  {biz.verified && <ShieldCheck className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground truncate">{biz.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 flex-wrap">
              <Badge variant="secondary" className="text-xs">{biz.industry}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />{biz.location}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                <TrendingUp className="w-4 h-4" />{biz.revenueShare}%
              </span>
              <div className="w-32">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{formatCurrency(biz.funded)}</span>
                  <span className="text-foreground font-medium">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/business/${biz.id}`}>
      <Card className="glass-card border-border/40 hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
              {biz.name.charAt(0)}
            </div>
            {biz.verified && <ShieldCheck className="w-5 h-5 text-primary" />}
          </div>

          <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {biz.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{biz.description}</p>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary" className="text-xs">{biz.industry}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />{biz.location}
            </span>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{biz.revenueShare}%</span>
                <span className="text-xs text-muted-foreground">share</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />{biz.foundedYear}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{formatCurrency(biz.funded)} / {formatCurrency(biz.fundingGoal)}</span>
                <span className="text-foreground font-medium">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;

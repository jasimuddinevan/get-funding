import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

const Footer = () => {
  const { t } = useLocale();

  const columns = [
    {
      title: "Product",
      links: [
        { label: "Explore Deals", to: "/explore" },
        { label: "For Founders", to: "/onboarding/business" },
        { label: "For Investors", to: "/investor" },
        { label: "Revenue Sharing", to: "/explore" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Careers", to: "/" },
        { label: "Press", to: "/" },
        { label: "Blog", to: "/" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/" },
        { label: "Terms of Service", to: "/" },
        { label: "Cookie Policy", to: "/" },
        { label: "Licence", to: "/" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand column */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-xl text-foreground">
                Fund<span className="text-primary">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[240px]">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-4">
              {/* Minimal social icons as text */}
              {["X", "Li", "Gh"].map((icon) => (
                <span
                  key={icon}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-sans text-sm font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-muted-foreground">{t("footer.rights")}</p>
          <p className="text-[13px] text-muted-foreground">Made for founders.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

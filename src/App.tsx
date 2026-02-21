import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import BusinessDetail from "./pages/BusinessDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import PortfolioOverview from "./pages/investor/PortfolioOverview";
import InvestmentHistory from "./pages/investor/InvestmentHistory";
import Watchlist from "./pages/investor/Watchlist";
import Notifications from "./pages/investor/Notifications";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminDashboardOverview from "./pages/admin/AdminDashboardOverview";
import BusinessReviews from "./pages/admin/BusinessReviews";
import UserManagement from "./pages/admin/UserManagement";
import InvestmentMonitoring from "./pages/admin/InvestmentMonitoring";

const queryClient = new QueryClient();

const AppShell = () => {
  const { locale } = useLocale();
  return (
    <div className={locale === "bn" ? "font-bengali" : "font-sans"}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/business/:id" element={<BusinessDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/onboarding/business" element={<BusinessOnboarding />} />
            <Route path="/investor" element={<InvestorDashboard />}>
              <Route index element={<PortfolioOverview />} />
              <Route path="investments" element={<InvestmentHistory />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<AdminDashboardOverview />} />
              <Route path="reviews" element={<BusinessReviews />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="investments" element={<InvestmentMonitoring />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LocaleProvider>
          <AppShell />
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

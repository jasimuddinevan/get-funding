
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'investor', 'business_owner');

-- 2. Create business_status enum
CREATE TYPE public.business_status AS ENUM ('draft', 'pending', 'under_review', 'approved', 'rejected', 'suspended');

-- 3. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 5. Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  region TEXT DEFAULT 'bd',
  founded_year INTEGER,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  pitch TEXT,
  problem_solved TEXT,
  target_market TEXT,
  competitive_advantage TEXT,
  current_revenue NUMERIC,
  growth_rate NUMERIC,
  profit_margin NUMERIC,
  financial_projection TEXT,
  revenue_share_pct NUMERIC,
  min_investment NUMERIC,
  max_investment NUMERIC,
  payout_frequency TEXT DEFAULT 'monthly',
  funding_goal NUMERIC,
  funded_amount NUMERIC DEFAULT 0,
  status business_status NOT NULL DEFAULT 'draft',
  admin_feedback TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create business_team_members table
CREATE TABLE public.business_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create business_documents table
CREATE TABLE public.business_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Create investment_tiers table
CREATE TABLE public.investment_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  min_amount NUMERIC NOT NULL,
  revenue_share_pct NUMERIC NOT NULL,
  payout_frequency TEXT DEFAULT 'monthly',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Create investments table
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES public.investment_tiers(id),
  amount NUMERIC NOT NULL,
  revenue_share_pct NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  invested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Create watchlists table
CREATE TABLE public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, business_id)
);

-- 11. Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Create admin_reviews table
CREATE TABLE public.admin_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_reviews ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-assign role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'investor'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_role_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS POLICIES

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- BUSINESSES
CREATE POLICY "Public can view approved businesses" ON public.businesses FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners can view own businesses" ON public.businesses FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert own businesses" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own businesses" ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all businesses" ON public.businesses FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update any business" ON public.businesses FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- BUSINESS_TEAM_MEMBERS
CREATE POLICY "Public can view team of approved businesses" ON public.business_team_members FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND status = 'approved'));
CREATE POLICY "Owners can manage own team" ON public.business_team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can view all teams" ON public.business_team_members FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- BUSINESS_DOCUMENTS
CREATE POLICY "Owners can manage own docs" ON public.business_documents FOR ALL
  USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can view all docs" ON public.business_documents FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- INVESTMENT_TIERS
CREATE POLICY "Public can view tiers of approved businesses" ON public.investment_tiers FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND status = 'approved'));
CREATE POLICY "Owners can manage own tiers" ON public.investment_tiers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can view all tiers" ON public.investment_tiers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- INVESTMENTS
CREATE POLICY "Investors can view own investments" ON public.investments FOR SELECT USING (auth.uid() = investor_id);
CREATE POLICY "Investors can insert investments" ON public.investments FOR INSERT WITH CHECK (auth.uid() = investor_id);
CREATE POLICY "Owners can view investments in their business" ON public.investments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can view all investments" ON public.investments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- WATCHLISTS
CREATE POLICY "Users can manage own watchlist" ON public.watchlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert watchlist" ON public.watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ADMIN_REVIEWS
CREATE POLICY "Admins can manage reviews" ON public.admin_reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can view reviews of own businesses" ON public.admin_reviews FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid()));

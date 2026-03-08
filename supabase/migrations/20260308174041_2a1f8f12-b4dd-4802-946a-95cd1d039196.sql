
-- Table for admin-managed bank payment details
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  branch_name text,
  routing_number text,
  swift_code text,
  instructions text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read active payment methods
CREATE POLICY "Anyone can view active payment methods"
ON public.payment_methods FOR SELECT
TO authenticated
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage payment methods"
ON public.payment_methods FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

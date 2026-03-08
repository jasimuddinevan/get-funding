
-- Add payment proof columns to investments
ALTER TABLE public.investments 
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'bank_transfer',
ADD COLUMN IF NOT EXISTS admin_payment_note text,
ADD COLUMN IF NOT EXISTS payment_reviewed_at timestamptz,
ADD COLUMN IF NOT EXISTS payment_reviewed_by uuid;

-- Add featured column to businesses
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- Create index for quick featured lookups
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON public.businesses (featured) WHERE featured = true;
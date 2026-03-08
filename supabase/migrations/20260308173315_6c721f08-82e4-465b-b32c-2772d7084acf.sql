
-- Admins can update investments (for payment approval/rejection)
CREATE POLICY "Admins can update investments"
ON public.investments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Investors can update own investments (for uploading proof)
CREATE POLICY "Investors can update own investments"
ON public.investments
FOR UPDATE
TO authenticated
USING (auth.uid() = investor_id)
WITH CHECK (auth.uid() = investor_id);

-- Public-safe view of club members (no email/phone/pin)
CREATE OR REPLACE VIEW public.club_members_public
WITH (security_invoker = on) AS
  SELECT id, role_title, name, photo_url, featured, sort_order, published, created_at, updated_at
  FROM public.club_members
  WHERE published = true;

GRANT SELECT ON public.club_members_public TO anon, authenticated;

-- Remove public read of the raw table (contains PII)
DROP POLICY IF EXISTS club_members_public_read ON public.club_members;

CREATE POLICY club_members_public_read_safe
  ON public.club_members FOR SELECT
  TO anon, authenticated
  USING (
    published = true
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = ANY (ARRAY['admin'::app_role, 'faculty'::app_role])
    )
  );
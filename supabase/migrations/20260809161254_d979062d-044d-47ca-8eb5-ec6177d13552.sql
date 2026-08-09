ALTER VIEW public.club_members_public SET (security_invoker = on);

DROP POLICY IF EXISTS club_members_public_read_safe ON public.club_members;
CREATE POLICY club_members_public_read_safe
  ON public.club_members FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Column-level privileges: anon may never read PII columns
REVOKE SELECT ON public.club_members FROM anon;
GRANT SELECT (id, role_title, name, photo_url, featured, sort_order, published, created_at, updated_at)
  ON public.club_members TO anon;
GRANT SELECT ON public.club_members_public TO anon, authenticated;
DROP VIEW IF EXISTS public.club_members_public;

CREATE VIEW public.club_members_public
WITH (security_invoker = on) AS
  SELECT id, role_title, name, photo_url, featured, sort_order, published
  FROM public.club_members
  WHERE published = true;

REVOKE SELECT ON public.club_members FROM anon;
GRANT SELECT (id, role_title, name, photo_url, featured, sort_order, published)
  ON public.club_members TO anon;

GRANT SELECT ON public.club_members_public TO anon, authenticated;
GRANT ALL ON public.club_members TO service_role;
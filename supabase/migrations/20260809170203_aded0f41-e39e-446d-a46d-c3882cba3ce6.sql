DROP VIEW IF EXISTS public.club_members_public;

CREATE VIEW public.club_members_public
WITH (security_invoker = true)
AS
SELECT id, role_title, name, pin, email, phone, photo_url, featured, sort_order, published
FROM public.club_members
WHERE published = true;

GRANT SELECT ON public.club_members_public TO anon, authenticated;
GRANT SELECT (id, role_title, name, pin, email, phone, photo_url, featured, sort_order, published)
  ON public.club_members TO anon;
ALTER VIEW public.club_members_public SET (security_invoker = off);
REVOKE ALL ON public.club_members_public FROM anon, authenticated;
GRANT SELECT ON public.club_members_public TO anon, authenticated;
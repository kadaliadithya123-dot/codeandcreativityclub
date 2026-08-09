CREATE TABLE public.club_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  pin text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  interests text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.club_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.club_applications TO authenticated;
GRANT ALL ON public.club_applications TO service_role;

ALTER TABLE public.club_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY club_applications_public_insert ON public.club_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(full_name)) BETWEEN 2 AND 120
    AND length(btrim(email)) BETWEEN 5 AND 160
    AND length(coalesce(phone, '')) <= 20
    AND length(coalesce(pin, '')) <= 40
    AND length(coalesce(department, '')) <= 80
    AND length(coalesce(interests, '')) <= 2000
    AND status = 'new'
  );

CREATE POLICY club_applications_staff_read ON public.club_applications
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = ANY (ARRAY['admin'::app_role, 'faculty'::app_role])));

CREATE POLICY club_applications_staff_update ON public.club_applications
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = ANY (ARRAY['admin'::app_role, 'faculty'::app_role])))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = ANY (ARRAY['admin'::app_role, 'faculty'::app_role])));

CREATE POLICY club_applications_staff_delete ON public.club_applications
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = ANY (ARRAY['admin'::app_role, 'faculty'::app_role])));
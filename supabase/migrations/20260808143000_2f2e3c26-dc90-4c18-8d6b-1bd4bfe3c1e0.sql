CREATE POLICY club_media_staff_select ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'club-media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)));

CREATE POLICY club_media_staff_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'club-media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)));

CREATE POLICY club_media_staff_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'club-media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)))
  WITH CHECK (bucket_id = 'club-media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)));

CREATE POLICY club_media_staff_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'club-media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)));
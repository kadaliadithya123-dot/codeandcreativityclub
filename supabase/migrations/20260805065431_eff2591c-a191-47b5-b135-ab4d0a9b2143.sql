DROP POLICY IF EXISTS user_roles_admin_insert ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_update ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_delete ON public.user_roles;

-- Explicit deny: role assignment is managed server-side (service role / signup trigger) only.
CREATE POLICY user_roles_no_client_insert ON public.user_roles FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY user_roles_no_client_update ON public.user_roles FOR UPDATE TO authenticated, anon USING (false) WITH CHECK (false);
CREATE POLICY user_roles_no_client_delete ON public.user_roles FOR DELETE TO authenticated, anon USING (false);
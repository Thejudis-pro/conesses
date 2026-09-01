-- Lets an existing admin see accounts that signed up (via the new "Créer un
-- compte" form) but have not yet been granted the 'admin' role, and grant it
-- to them from the admin console — without exposing the service_role key to
-- the client. Both functions are SECURITY DEFINER (so they can read
-- auth.users / write user_roles) but self-check the caller's role and act as
-- a non-admin (empty list / no-op) rather than granting anything to a
-- non-admin caller.

CREATE OR REPLACE FUNCTION public.list_pending_admin_accounts()
RETURNS TABLE (id uuid, email text, created_at timestamptz, email_confirmed boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.email, u.created_at, (u.email_confirmed_at IS NOT NULL)
  FROM auth.users u
  WHERE public.has_role(auth.uid(), 'admin')
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin'
    )
  ORDER BY u.created_at DESC
$$;

REVOKE ALL ON FUNCTION public.list_pending_admin_accounts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_pending_admin_accounts() TO authenticated;

CREATE OR REPLACE FUNCTION public.grant_admin_role(target_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.grant_admin_role(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.grant_admin_role(uuid) TO authenticated;

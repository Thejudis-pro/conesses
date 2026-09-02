-- Promote every existing 'admin' to also hold 'super_admin', so today's
-- admin accounts keep full access and gain the ability to manage roles.
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'super_admin' FROM public.user_roles WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Only super_admins may see/manage pending signups now (previously any
-- 'admin' could) — general admins no longer need to touch role assignment.
CREATE OR REPLACE FUNCTION public.list_pending_admin_accounts()
RETURNS TABLE (id uuid, email text, created_at timestamptz, email_confirmed boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.email, u.created_at, (u.email_confirmed_at IS NOT NULL)
  FROM auth.users u
  WHERE public.has_role(auth.uid(), 'super_admin')
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles r
      WHERE r.user_id = u.id AND r.role IN ('admin', 'super_admin', 'checkin_agent')
    )
  ORDER BY u.created_at DESC
$$;

-- Every account currently holding admin/super_admin/checkin_agent, for the
-- "Comptes Administrateurs" management view.
CREATE OR REPLACE FUNCTION public.list_all_admin_accounts()
RETURNS TABLE (id uuid, email text, role public.app_role, granted_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.email, r.role, r.created_at
  FROM public.user_roles r
  JOIN auth.users u ON u.id = r.user_id
  WHERE public.has_role(auth.uid(), 'super_admin')
    AND r.role IN ('admin', 'super_admin', 'checkin_agent')
  ORDER BY r.created_at DESC
$$;

REVOKE ALL ON FUNCTION public.list_all_admin_accounts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_all_admin_accounts() TO authenticated;

-- Generalized role grant, replacing the admin-only grant_admin_role.
-- Only a super_admin may call it, and only the three staff-facing roles
-- are grantable through this path.
CREATE OR REPLACE FUNCTION public.grant_role(target_user_id uuid, new_role public.app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RETURN;
  END IF;
  IF new_role NOT IN ('admin', 'super_admin', 'checkin_agent') THEN
    RETURN;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, new_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.grant_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.grant_role(uuid, public.app_role) TO authenticated;

-- Removes a specific role from an account (revoke/demote).
CREATE OR REPLACE FUNCTION public.revoke_role(target_user_id uuid, target_role public.app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RETURN;
  END IF;
  DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = target_role;
END;
$$;

REVOKE ALL ON FUNCTION public.revoke_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.revoke_role(uuid, public.app_role) TO authenticated;

DROP FUNCTION IF EXISTS public.grant_admin_role(uuid);

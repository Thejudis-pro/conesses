-- Admin-managed badge categories, replacing the hardcoded ACCESS_LEVELS list.
-- Each category carries a display label, a simple access tier (total/limité,
-- shown on the badge and used for future check-in gating), a color used to
-- theme the printed badge, and a sort position for the management UI.
CREATE TABLE public.badge_access_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  access_tier text NOT NULL CHECK (access_tier IN ('total', 'limite')),
  color text NOT NULL DEFAULT '#006837',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.badge_access_levels ENABLE ROW LEVEL SECURITY;

-- Read: anyone with badge-studio access (admin, super_admin, checkin_agent -
-- checkin agents create free/comp badges too and need the category list).
CREATE POLICY "Badge staff can view access levels"
ON public.badge_access_levels FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'super_admin')
  OR public.has_role(auth.uid(), 'checkin_agent')
);

-- Write: managing the category list itself is an admin setting, not a
-- checkin-agent action.
CREATE POLICY "Admins can manage access levels"
ON public.badge_access_levels FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Seed with the categories the badge studio already used, so nothing changes
-- visually the moment this migration runs.
INSERT INTO public.badge_access_levels (label, access_tier, color, sort_order) VALUES
  ('VIP / Bureau Exécutif', 'total', '#D97706', 0),
  ('Membre Titulaire', 'total', '#006837', 1),
  ('Comité de Pilotage', 'total', '#0A2540', 2),
  ('Invité d''Honneur', 'total', '#7C3AED', 3),
  ('Presse / Média', 'limite', '#DC2626', 4),
  ('Badge Gratuit', 'limite', '#64748B', 5);

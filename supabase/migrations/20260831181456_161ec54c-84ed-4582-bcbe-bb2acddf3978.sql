CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.web_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  reference text NOT NULL UNIQUE,
  form_type text NOT NULL,
  org_name text,
  contact_name text,
  email text,
  phone text,
  region text,
  sector text,
  legal_form text,
  role_wanted text,
  message text,
  status text NOT NULL DEFAULT 'Nouveau',
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

GRANT INSERT ON public.web_forms TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.web_forms TO authenticated;
GRANT ALL ON public.web_forms TO service_role;

ALTER TABLE public.web_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a form" ON public.web_forms
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read submissions" ON public.web_forms
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions" ON public.web_forms
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete submissions" ON public.web_forms
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX web_forms_created_at_idx ON public.web_forms (created_at DESC);
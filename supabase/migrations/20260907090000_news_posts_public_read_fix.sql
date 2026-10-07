-- has_role() is not executable by anon, so the combined policy
-- (published = true OR has_role(...)) fails with "permission denied" for visitors
-- as soon as a draft row exists. Split it: anon reads published posts only,
-- authenticated users keep the admin visibility.
DROP POLICY IF EXISTS "Anyone can read published posts" ON public.news_posts;

CREATE POLICY "Anyone can read published posts" ON public.news_posts
FOR SELECT TO anon USING (published = true);

CREATE POLICY "Authenticated can read published or admin all" ON public.news_posts
FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));

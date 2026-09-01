-- Storage bucket for Actualités cover images, uploaded from the admin's
-- computer instead of pasting an external URL. Public bucket (read via the
-- public URL, no RLS needed for GET); writes restricted to admins.

INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view news images" ON storage.objects
FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Admins can upload news images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

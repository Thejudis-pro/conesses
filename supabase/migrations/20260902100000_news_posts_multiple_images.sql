-- Actualités posts can now carry a gallery of images instead of a single one.
ALTER TABLE public.news_posts ADD COLUMN image_urls text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.news_posts DROP COLUMN image_url;

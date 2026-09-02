import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"

export type NewsPost = Tables<"news_posts">

/** Public: only published posts, newest first. */
export async function fetchPublishedNews(limit?: number): Promise<{ data: NewsPost[]; error: string | null }> {
  let query = supabase.from("news_posts").select("*").eq("published", true).order("created_at", { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}

/** Admin: every post, published or draft. */
export async function fetchAllNewsAdmin(): Promise<{ data: NewsPost[]; error: string | null }> {
  const { data, error } = await supabase.from("news_posts").select("*").order("created_at", { ascending: false })
  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}

/** Public: a single published post by id, for the detail page. */
export async function fetchPublishedNewsById(id: string): Promise<{ data: NewsPost | null; error: string | null }> {
  const { data, error } = await supabase.from("news_posts").select("*").eq("id", id).eq("published", true).maybeSingle()
  if (error) return { data: null, error: error.message }
  return { data: data ?? null, error: null }
}

export const newsExcerpt = (text: string, max = 140) => (text.length > max ? `${text.slice(0, max).trim()}…` : text)

/** Uploads a single image file to the public `news-images` bucket and returns its public URL. */
export async function uploadNewsImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from("news-images").upload(path, file)
  if (error) return { url: null, error: error.message }
  const { data } = supabase.storage.from("news-images").getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/** Uploads several image files in parallel; stops at the first failure. */
export async function uploadNewsImages(files: File[]): Promise<{ urls: string[]; error: string | null }> {
  const results = await Promise.all(files.map(uploadNewsImage))
  const failed = results.find((r) => r.error)
  if (failed) return { urls: [], error: failed.error }
  return { urls: results.map((r) => r.url as string), error: null }
}

export async function createNewsPost(input: { title: string; content: string; image_urls: string[]; published: boolean }): Promise<string | null> {
  const { error } = await supabase.from("news_posts").insert(input)
  return error?.message ?? null
}

export async function updateNewsPost(
  id: string,
  input: { title: string; content: string; image_urls: string[]; published: boolean },
): Promise<string | null> {
  const { error } = await supabase.from("news_posts").update({ ...input, updated_at: new Date().toISOString() }).eq("id", id)
  return error?.message ?? null
}

export async function setNewsPostPublished(id: string, published: boolean): Promise<string | null> {
  const { error } = await supabase.from("news_posts").update({ published, updated_at: new Date().toISOString() }).eq("id", id)
  return error?.message ?? null
}

export async function deleteNewsPost(id: string): Promise<string | null> {
  const { error } = await supabase.from("news_posts").delete().eq("id", id)
  return error?.message ?? null
}

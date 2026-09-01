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

export async function createNewsPost(input: { title: string; content: string; image_url: string | null; published: boolean }): Promise<string | null> {
  const { error } = await supabase.from("news_posts").insert(input)
  return error?.message ?? null
}

export async function updateNewsPost(
  id: string,
  input: { title: string; content: string; image_url: string | null; published: boolean },
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

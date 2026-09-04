import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"

export type BadgeAccessLevel = Tables<"badge_access_levels">
export type BadgeAccessTier = "total" | "limite"

export const TIER_LABELS: Record<BadgeAccessTier, string> = {
  total: "Accès Total",
  limite: "Accès Limité (AL)",
}

/** Default icon per tier, since the management UI keeps categories to a label + tier + color. */
export const tierIcon = (tier: string) => (tier === "total" ? "fa-crown" : "fa-id-badge")

export async function fetchBadgeAccessLevels(): Promise<{ data: BadgeAccessLevel[]; error: string | null }> {
  const { data, error } = await supabase.from("badge_access_levels").select("*").order("sort_order", { ascending: true })
  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}

export async function createBadgeAccessLevel(
  input: { label: string; access_tier: BadgeAccessTier; color: string; sort_order: number },
): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase.from("badge_access_levels").insert(input).select("id").single()
  if (error) return { id: null, error: error.message }
  return { id: data.id, error: null }
}

export async function updateBadgeAccessLevel(id: string, input: Partial<{ label: string; access_tier: BadgeAccessTier; color: string }>): Promise<string | null> {
  const { error } = await supabase.from("badge_access_levels").update(input).eq("id", id)
  return error?.message ?? null
}

export async function deleteBadgeAccessLevel(id: string): Promise<string | null> {
  const { error } = await supabase.from("badge_access_levels").delete().eq("id", id)
  return error?.message ?? null
}

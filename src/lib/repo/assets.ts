import type { SupabaseClient } from '@supabase/supabase-js'
import type { Asset } from '@/lib/types'
export async function listAssetsFor(c: SupabaseClient, contentId: string): Promise<Asset[]> {
  const { data, error } = await c.from('assets').select('*').eq('content_item_id', contentId).order('created_at')
  if (error) throw error; return data as Asset[]
}

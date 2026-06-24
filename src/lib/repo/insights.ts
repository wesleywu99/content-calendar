import type { SupabaseClient } from '@supabase/supabase-js'
export async function getInsight(c: SupabaseClient, id: string) {
  const { data, error } = await c.from('insights').select('*').eq('id', id).single()
  if (error) throw error; return data
}

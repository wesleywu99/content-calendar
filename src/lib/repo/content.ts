import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContentItem, ContentStatus } from '@/lib/types'
import { canTransition } from '@/lib/domain/status'

export async function listContent(c: SupabaseClient): Promise<ContentItem[]> {
  const { data, error } = await c.from('content_items').select('*').order('publish_date', { ascending: true })
  if (error) throw error
  return data as ContentItem[]
}
export async function updateCaption(c: SupabaseClient, id: string, caption: string): Promise<ContentItem> {
  const { data, error } = await c.from('content_items')
    .update({ caption, human_edited: true }).eq('id', id).select().single()
  if (error) throw error
  return data as ContentItem
}
export async function setStatus(c: SupabaseClient, id: string, from: ContentStatus, to: ContentStatus): Promise<ContentItem> {
  if (!canTransition(from, to)) throw new Error(`illegal transition ${from}→${to}`)
  const { data, error } = await c.from('content_items')
    .update({ content_status: to }).eq('id', id).select().single()
  if (error) throw error
  return data as ContentItem
}

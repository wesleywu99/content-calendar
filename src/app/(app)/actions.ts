'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateCaption, setStatus } from '@/lib/repo/content'
import { listAssetsFor } from '@/lib/repo/assets'
import type { ContentStatus, Platform } from '@/lib/types'

export async function saveCaption(id: string, caption: string) {
  const c = await createClient()
  await updateCaption(c, id, caption)
  revalidatePath('/')
}

export async function changeStatus(id: string, from: ContentStatus, to: ContentStatus) {
  const c = await createClient()
  await setStatus(c, id, from, to)
  revalidatePath('/')
}

export async function getAssets(contentId: string) {
  const c = await createClient()
  return listAssetsFor(c, contentId)
}

export async function createContent(data: {
  platform: Platform
  title: string
  publish_date: string
  caption: string | null
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  const c = await createClient()
  const { data: row } = await c.from('content_items').insert({
    ...data,
    content_status: 'idea',
    asset_status: 'none',
    fingerprint: `manual:${data.platform}:${Date.now()}`,
    human_edited: false,
  }).select().single()
  revalidatePath('/')
  return row
}

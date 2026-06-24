'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateCaption, setStatus } from '@/lib/repo/content'
import { listAssetsFor } from '@/lib/repo/assets'
import type { ContentStatus } from '@/lib/types'

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

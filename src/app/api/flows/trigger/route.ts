import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRun, completeRun } from '@/lib/repo/flowRuns'
import { generationCost } from '@/lib/domain/cost'
import { platform } from '@/lib/platform/http'
import type { Platform } from '@/lib/types'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { flowKey, platforms = [], topic = '', date = '', contentId = null } = (await req.json()) as {
    flowKey: string
    platforms?: Platform[]
    topic?: string
    date?: string
    contentId?: string | null
  }
  const cost = generationCost(platforms)

  const run = await createRun(supabase, {
    flow_key: flowKey,
    triggered_by: 'system',
    cost,
    request_meta: { platforms, topic, date, contentId },
  })
  const result = await platform.triggerFlow({ flowKey, platforms, topic, date })
  await completeRun(supabase, run.id, result.ok ? 'succeeded' : 'failed', { runRef: result.runRef ?? null }, result.error)

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 })
  return NextResponse.json({ runId: run.id, runRef: result.runRef })
}

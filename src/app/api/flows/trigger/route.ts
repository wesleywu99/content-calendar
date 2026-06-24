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

  // mock 端到端：未接真實平台時，route 直接以 service_role 寫入，方便 demo
  if (!process.env.PLATFORM_API_BASE && result.ok) {
    if (flowKey === 'gen') {
      for (const p of platforms) {
        const fp = `${topic}:${p}:${date}`
        await supabase.from('content_items').upsert(
          {
            title: topic,
            platform: p,
            publish_date: date || null,
            caption: '（AI 生成草稿）',
            content_status: 'draft',
            fingerprint: fp,
            generated_by: 'mock',
          },
          { onConflict: 'fingerprint', ignoreDuplicates: true },
        )
      }
    } else if (flowKey === 'image' && contentId) {
      await supabase.from('assets').upsert(
        {
          content_item_id: contentId,
          type: 'image',
          url: `https://placehold.co/600x600/6366f1/ffffff?text=mock+${Date.now()}`,
          prompt: 'mock',
          fingerprint: `${contentId}:image:${Date.now()}`,
          generated_by: 'mock',
        },
      )
      await supabase.from('content_items').update({ asset_status: 'ready' }).eq('id', contentId)
    }
  }

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 })
  return NextResponse.json({ runId: run.id, runRef: result.runRef })
}

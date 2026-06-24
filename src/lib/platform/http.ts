import type { PlatformClient } from './index'
import { mockPlatform } from './mock'

export const httpPlatform: PlatformClient = {
  async triggerFlow(input) {
    const res = await fetch(`${process.env.PLATFORM_API_BASE}/flows/${input.flowKey}/trigger`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.PLATFORM_API_KEY}` },
      body: JSON.stringify({ platforms: input.platforms, topic: input.topic, date: input.date }),
    })
    if (!res.ok) return { ok: false, error: `platform ${res.status}` }
    const j = (await res.json().catch(() => ({}))) as { runId?: string; id?: string }
    return { ok: true, runRef: j.runId ?? j.id }
  },
}

export const platform: PlatformClient = process.env.PLATFORM_API_BASE ? httpPlatform : mockPlatform

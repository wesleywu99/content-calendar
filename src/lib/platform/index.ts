import type { Platform } from '@/lib/types'

export interface TriggerInput {
  flowKey: string
  platforms: Platform[]
  topic: string
  date: string
}

export interface TriggerResult {
  ok: boolean
  runRef?: string
  error?: string
}

export interface PlatformClient {
  triggerFlow(input: TriggerInput): Promise<TriggerResult>
}

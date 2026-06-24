import type { SupabaseClient } from '@supabase/supabase-js'
import type { FlowRun } from '@/lib/types'
export async function createRun(c: SupabaseClient, p: { flow_key: string; triggered_by: string; cost: number; request_meta: Record<string, unknown> }): Promise<FlowRun> {
  const { data, error } = await c.from('flow_runs').insert({ ...p, status: 'pending' }).select().single()
  if (error) throw error; return data as FlowRun
}
export async function completeRun(c: SupabaseClient, id: string, status: 'succeeded'|'failed', result_meta: Record<string, unknown>, error?: string): Promise<void> {
  const { error: e } = await c.from('flow_runs').update({ status, result_meta, error: error ?? null, finished_at: new Date().toISOString() }).eq('id', id)
  if (e) throw e
}

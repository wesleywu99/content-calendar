import { describe, it, expect, vi } from 'vitest'
import { createRun } from './flowRuns'
it('createRun 寫 pending + cost', async () => {
  const insert = vi.fn(() => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'r1', status: 'pending' }, error: null }) }) }))
  const client: any = { from: () => ({ insert }) }
  const r = await createRun(client, { flow_key: 'gen', triggered_by: 'a@x', cost: 16, request_meta: {} })
  expect(insert).toHaveBeenCalledWith(expect.objectContaining({ flow_key: 'gen', status: 'pending', cost: 16 }))
  expect(r.id).toBe('r1')
})

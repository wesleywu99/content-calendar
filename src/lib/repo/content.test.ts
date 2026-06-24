import { describe, it, expect, vi } from 'vitest'
import { listContent, updateCaption, setStatus } from './content'

const okSingle = (row: any) => ({ select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) })

it('updateCaption 會把 human_edited 設為 true', async () => {
  const update = vi.fn(() => ({ eq: () => okSingle({ id: 'c1', caption: 'x', human_edited: true }) }))
  const client: any = { from: () => ({ update }) }
  const r = await updateCaption(client, 'c1', 'x')
  expect(update).toHaveBeenCalledWith(expect.objectContaining({ caption: 'x', human_edited: true }))
  expect(r.human_edited).toBe(true)
})

it('setStatus 拒絕非法流轉', async () => {
  const client: any = { from: () => ({}) }
  await expect(setStatus(client, 'c1', 'draft', 'approved')).rejects.toThrow()
})

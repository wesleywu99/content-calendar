import { describe, it, expect } from 'vitest'
import { mockPlatform } from './mock'

describe('mockPlatform', () => {
  it('mock 觸發回 ok + runRef', async () => {
    const r = await mockPlatform.triggerFlow({ flowKey: 'gen', platforms: ['instagram'], topic: 'x', date: '2026-06-29' })
    expect(r.ok).toBe(true)
    expect(r.runRef).toBeTruthy()
  })
})

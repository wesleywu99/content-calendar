import { describe, it, expect } from 'vitest'
import { nextStatuses, canTransition, STATUS_LABEL } from './status'

describe('status transitions', () => {
  it('draft 可送審', () => expect(nextStatuses('draft')).toContain('review'))
  it('review 可核准或退回', () => {
    expect(nextStatuses('review')).toEqual(expect.arrayContaining(['approved', 'draft']))
  })
  it('approved 可取消核准回 review', () => expect(nextStatuses('approved')).toContain('review'))
  it('禁止 draft 直接 approved', () => expect(canTransition('draft', 'approved')).toBe(false))
  it('允許 review→approved', () => expect(canTransition('review', 'approved')).toBe(true))
  it('有中文標籤', () => expect(STATUS_LABEL.review).toBe('待審核'))
})

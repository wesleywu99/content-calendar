import { describe, it, expect } from 'vitest'
import { generationCost, formatCost } from './cost'

describe('cost', () => {
  it('每平台 $8', () => expect(generationCost(['instagram', 'facebook'])).toBe(16))
  it('空陣列 0', () => expect(generationCost([])).toBe(0))
  it('格式化', () => expect(formatCost(16)).toBe('$16'))
})

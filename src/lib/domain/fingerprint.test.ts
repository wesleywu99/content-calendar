import { describe, it, expect } from 'vitest'
import { contentFingerprint, assetFingerprint } from './fingerprint'

describe('fingerprint', () => {
  it('同 insight×平台 指紋穩定', () => {
    expect(contentFingerprint('ins_1', 'instagram'))
      .toBe(contentFingerprint('ins_1', 'instagram'))
  })
  it('不同平台指紋不同', () => {
    expect(contentFingerprint('ins_1', 'instagram'))
      .not.toBe(contentFingerprint('ins_1', 'facebook'))
  })
  it('asset 指紋綁內容 id', () => {
    expect(assetFingerprint('c_1', 1)).toBe('c_1:image:1')
  })
})

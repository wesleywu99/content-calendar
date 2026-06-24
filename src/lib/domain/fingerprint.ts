import type { Platform } from '@/lib/types'
export const contentFingerprint = (insightId: string, platform: Platform) =>
  `${insightId}:${platform}`
export const assetFingerprint = (contentId: string, n: number) =>
  `${contentId}:image:${n}`

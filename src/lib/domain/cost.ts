import type { Platform } from '@/lib/types'
export const PRICE_PER_POST = 8   // TODO Phase 6：改由平台 API 取得
export const generationCost = (platforms: Platform[]) => platforms.length * PRICE_PER_POST
export const formatCost = (n: number) => `$${n}`

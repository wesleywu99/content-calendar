import type { ContentStatus } from '@/lib/types'

export const STATUS_LABEL: Record<ContentStatus, string> = {
  idea: '構思', draft: '草稿', review: '待審核', approved: '已核准',
}
const GRAPH: Record<ContentStatus, ContentStatus[]> = {
  idea: ['draft'], draft: ['review'], review: ['approved', 'draft'], approved: ['review'],
}
export const nextStatuses = (s: ContentStatus): ContentStatus[] => GRAPH[s] ?? []
export const canTransition = (from: ContentStatus, to: ContentStatus): boolean =>
  nextStatuses(from).includes(to)

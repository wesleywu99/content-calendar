export type Platform = 'xiaohongshu' | 'instagram' | 'facebook'
export type ContentStatus = 'idea' | 'draft' | 'review' | 'approved'
export type AssetStatus = 'none' | 'queued' | 'generating' | 'ready' | 'failed'

export interface ContentItem {
  id: string
  title: string
  platform: Platform
  publish_date: string | null      // 'YYYY-MM-DD'
  caption: string | null
  content_status: ContentStatus
  asset_status: AssetStatus
  insight_id: string | null
  fingerprint: string
  owner: string | null
  generated_by: string | null
  human_edited: boolean
  created_at: string
  updated_at: string
}
export interface Asset {
  id: string; content_item_id: string; type: 'image' | 'video'
  url: string; prompt: string | null; fingerprint: string; meta: Record<string, unknown>; created_at: string
}
export interface FlowRun {
  id: string; flow_key: string; triggered_by: string; cost: number | null
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  request_meta: Record<string, unknown>; result_meta: Record<string, unknown>
  error: string | null; started_at: string; finished_at: string | null
}

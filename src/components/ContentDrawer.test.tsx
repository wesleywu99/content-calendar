import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

const { getAssetsMock } = vi.hoisted(() => ({ getAssetsMock: vi.fn(async () => [] as any[]) }))
vi.mock('@/app/(app)/actions', () => ({
  saveCaption: vi.fn(),
  changeStatus: vi.fn(),
  getAssets: (id: string) => getAssetsMock(id),
}))

import ContentDrawer from './ContentDrawer'
import type { Asset, ContentItem } from '@/lib/types'

const draftItem = {
  id: 'c1',
  title: '端午企劃',
  platform: 'instagram',
  publish_date: '2026-06-26',
  caption: '原文案',
  content_status: 'draft',
  asset_status: 'none',
} as ContentItem

describe('ContentDrawer', () => {
  it('顯示文案與可送審按鈕（draft → review）', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.getByDisplayValue('原文案')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '待審核' })).toBeInTheDocument()
  })

  it('draft 不可直接 approved', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.queryByRole('button', { name: '已核准' })).not.toBeInTheDocument()
  })

  it('顯示最新圖片資產', async () => {
    getAssetsMock.mockResolvedValueOnce([
      { id: 'a1', content_item_id: 'c1', type: 'image', url: 'https://example.com/old.png', prompt: null, fingerprint: 'f1', meta: {}, created_at: '2026-06-20' },
      { id: 'a2', content_item_id: 'c1', type: 'image', url: 'https://example.com/new.png', prompt: null, fingerprint: 'f2', meta: {}, created_at: '2026-06-23' },
    ] as Asset[])
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    const img = await screen.findByRole('img')
    expect(img.getAttribute('src')).toBe('https://example.com/new.png')
  })

  it('asset_status=generating 顯示生成中', () => {
    const item = { ...draftItem, asset_status: 'generating' } as ContentItem
    render(<ContentDrawer item={item} onClose={() => {}} />)
    expect(screen.getByText('圖片生成中')).toBeInTheDocument()
  })
})

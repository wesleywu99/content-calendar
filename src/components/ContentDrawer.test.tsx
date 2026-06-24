import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

vi.mock('@/app/(app)/actions', () => ({
  saveCaption: vi.fn(),
  changeStatus: vi.fn(),
}))

import ContentDrawer from './ContentDrawer'
import type { ContentItem } from '@/lib/types'

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
  it('顯示標題與文案', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.getByText('端午企劃')).toBeInTheDocument()
    expect(screen.getByDisplayValue('原文案')).toBeInTheDocument()
  })

  it('顯示送審按鈕（draft → review）', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.getByRole('button', { name: '待審核' })).toBeInTheDocument()
  })

  it('draft 不可直接 approved', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.queryByRole('button', { name: '已核准' })).not.toBeInTheDocument()
  })

  it('顯示平台與日期欄位', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.getByText('2026-06-26')).toBeInTheDocument()
    expect(screen.getByText('IG')).toBeInTheDocument()
  })
})

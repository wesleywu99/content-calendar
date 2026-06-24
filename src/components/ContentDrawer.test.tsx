import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

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
  it('顯示文案與可送審按鈕（draft → review）', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.getByDisplayValue('原文案')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '待審核' })).toBeInTheDocument()
  })

  it('draft 不可直接 approved', () => {
    render(<ContentDrawer item={draftItem} onClose={() => {}} />)
    expect(screen.queryByRole('button', { name: '已核准' })).not.toBeInTheDocument()
  })
})

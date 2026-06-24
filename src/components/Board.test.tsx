import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Board from './Board'
import type { ContentItem } from '@/lib/types'

const items = [
  { id: '1', title: '草稿A', platform: 'instagram', publish_date: '2026-06-26', content_status: 'draft' },
  { id: '2', title: '審核B', platform: 'facebook', publish_date: '2026-06-27', content_status: 'review' },
  { id: '3', title: '核准C', platform: 'xiaohongshu', publish_date: '2026-06-25', content_status: 'approved' },
] as ContentItem[]

describe('Board', () => {
  it('依狀態分三欄顯示', () => {
    render(<Board items={items} />)
    expect(screen.getByText('草稿A')).toBeInTheDocument()
    expect(screen.getByText('審核B')).toBeInTheDocument()
    expect(screen.getByText('核准C')).toBeInTheDocument()
    expect(screen.getAllByText('草稿').length).toBeGreaterThanOrEqual(1)
  })
})

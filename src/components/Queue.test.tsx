import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Queue from './Queue'
import type { ContentItem } from '@/lib/types'

const items = [
  { id: '1', title: '待處理A', platform: 'instagram', publish_date: '2026-06-26', content_status: 'draft' },
  { id: '2', title: '已核准B', platform: 'facebook', publish_date: '2026-06-25', content_status: 'approved' },
] as ContentItem[]

describe('Queue', () => {
  it('只列出非 approved 項目', () => {
    render(<Queue items={items} />)
    expect(screen.getByText('待處理A')).toBeInTheDocument()
    expect(screen.queryByText('已核准B')).not.toBeInTheDocument()
  })
})

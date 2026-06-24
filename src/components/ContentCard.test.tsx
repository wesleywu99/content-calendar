import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContentCard from './ContentCard'
import type { ContentItem } from '@/lib/types'

const item = {
  id: 'c1',
  title: '端午企劃',
  platform: 'instagram',
  publish_date: '2026-06-26',
  content_status: 'draft',
} as ContentItem

describe('ContentCard', () => {
  it('顯示標題與日期', () => {
    render(<ContentCard item={item} />)
    expect(screen.getByText('端午企劃')).toBeInTheDocument()
    expect(screen.getByText('06-26')).toBeInTheDocument()
  })
})

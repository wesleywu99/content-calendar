import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PlatformBadge from './PlatformBadge'

describe('PlatformBadge', () => {
  it('顯示平台標籤', () => {
    render(<PlatformBadge platform="instagram" />)
    expect(screen.getByText('IG')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('顯示中文狀態', () => {
    render(<StatusBadge status="review" />)
    expect(screen.getByText('待審核')).toBeInTheDocument()
  })
})

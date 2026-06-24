import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

import GenerateModal from './GenerateModal'

describe('GenerateModal', () => {
  it('選平台即時更新費用', () => {
    render(<GenerateModal onClose={() => {}} />)
    fireEvent.click(screen.getByText('IG'))
    expect(screen.getByText('$8')).toBeInTheDocument()
    fireEvent.click(screen.getByText('FB'))
    expect(screen.getByText('$16')).toBeInTheDocument()
  })
})

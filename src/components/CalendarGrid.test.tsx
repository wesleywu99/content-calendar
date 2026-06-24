import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CalendarGrid from './CalendarGrid'

const items = [{ id: '1', title: '端午企劃', platform: 'instagram', publish_date: '2026-06-26', content_status: 'draft' } as any]

describe('CalendarGrid', () => {
  it('在對應日期顯示事件', () => {
    render(<CalendarGrid month={new Date(2026, 5, 1)} items={items} onMonthChange={() => {}} onOpen={() => {}} />)
    expect(screen.getByText('端午企劃')).toBeInTheDocument()
  })

  it('點下一月觸發 onMonthChange', () => {
    const fn = vi.fn()
    render(<CalendarGrid month={new Date(2026, 5, 1)} items={[]} onMonthChange={fn} onOpen={() => {}} />)
    fireEvent.click(screen.getByLabelText('下一月'))
    expect(fn).toHaveBeenCalled()
  })
})

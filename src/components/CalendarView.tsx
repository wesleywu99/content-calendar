'use client'
import { useState } from 'react'
import type { ContentItem } from '@/lib/types'
import CalendarGrid from './CalendarGrid'

function firstMonth(items: ContentItem[]) {
  const first = items.find((i) => i.publish_date)?.publish_date
  return first ? new Date(first + 'T00:00:00') : new Date()
}

export default function CalendarView({ items }: { items: ContentItem[] }) {
  const [month, setMonth] = useState<Date>(() => firstMonth(items))
  return (
    <div className="p-6">
      <CalendarGrid month={month} items={items} onMonthChange={setMonth} onOpen={() => {}} />
    </div>
  )
}

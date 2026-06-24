'use client'
import { useState } from 'react'
import type { ContentItem } from '@/lib/types'
import CalendarGrid from './CalendarGrid'
import Queue from './Queue'

function firstMonth(items: ContentItem[]) {
  const first = items.find((i) => i.publish_date)?.publish_date
  return first ? new Date(first + 'T00:00:00') : new Date()
}

export default function DashboardView({ items }: { items: ContentItem[] }) {
  const [month, setMonth] = useState<Date>(() => firstMonth(items))
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
      <div className="lg:col-span-2">
        <CalendarGrid month={month} items={items} onMonthChange={setMonth} onOpen={() => {}} />
      </div>
      <Queue items={items} />
    </div>
  )
}

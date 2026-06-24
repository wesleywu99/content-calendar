'use client'
import { useState } from 'react'
import type { ContentItem } from '@/lib/types'
import CalendarGrid from './CalendarGrid'
import ContentDrawer from './ContentDrawer'
import FAB from './FAB'

function firstMonth(items: ContentItem[]) {
  const first = items.find((i) => i.publish_date)?.publish_date
  return first ? new Date(first + 'T00:00:00') : new Date()
}

export default function CalendarView({ items }: { items: ContentItem[] }) {
  const [month, setMonth] = useState<Date>(() => firstMonth(items))
  const [openId, setOpenId] = useState<string | null>(null)
  const openItem = items.find((i) => i.id === openId) ?? null

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <CalendarGrid month={month} items={items} onMonthChange={setMonth} onOpen={setOpenId} />
      </div>
      {openItem && <ContentDrawer item={openItem} onClose={() => setOpenId(null)} />}
      <FAB />
    </>
  )
}

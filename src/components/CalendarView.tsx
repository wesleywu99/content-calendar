'use client'
import { useState } from 'react'
import type { ContentItem } from '@/lib/types'
import CalendarGrid from './CalendarGrid'
import ContentDrawer from './ContentDrawer'
import CreateDrawer from './CreateDrawer'

function firstMonth(items: ContentItem[]) {
  const first = items.find((i) => i.publish_date)?.publish_date
  return first ? new Date(first + 'T00:00:00') : new Date()
}

export default function CalendarView({
  items,
  onCreate,
}: {
  items: ContentItem[]
  onCreate?: (item: ContentItem) => void
}) {
  const [month, setMonth] = useState<Date>(() => firstMonth(items))
  const [openId, setOpenId] = useState<string | null>(null)
  const [createDate, setCreateDate] = useState<string | null>(null)

  const openItem = items.find((i) => i.id === openId) ?? null

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <CalendarGrid
          month={month}
          items={items}
          onMonthChange={setMonth}
          onOpen={setOpenId}
          onCreateDate={setCreateDate}
        />
      </div>
      {openItem && <ContentDrawer item={openItem} onClose={() => setOpenId(null)} />}
      {createDate && (
        <CreateDrawer
          date={createDate}
          onClose={() => setCreateDate(null)}
          onCreated={(item) => { onCreate?.(item); setCreateDate(null) }}
        />
      )}
    </>
  )
}

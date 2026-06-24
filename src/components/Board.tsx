'use client'
import { useState } from 'react'
import type { ContentItem, ContentStatus } from '@/lib/types'
import ContentCard from './ContentCard'
import ContentDrawer from './ContentDrawer'

const COLUMNS: { key: ContentStatus; label: string }[] = [
  { key: 'draft', label: '草稿' },
  { key: 'review', label: '待審核' },
  { key: 'approved', label: '已核准' },
]

export default function Board({ items }: { items: ContentItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const openItem = items.find((i) => i.id === openId) ?? null

  return (
    <>
      <div className="flex gap-5 items-start h-full">
        {COLUMNS.map((col) => {
          const colItems = items.filter((it) => it.content_status === col.key)
          return (
            <div key={col.key} className="w-72 shrink-0 flex flex-col">
              <div className="flex items-center gap-2 mb-3 px-0.5">
                <span className="text-sm font-medium text-zinc-700">{col.label}</span>
                <span className="text-xs font-medium text-zinc-400 bg-zinc-200/60 px-1.5 py-0.5 rounded-full">
                  {colItems.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {colItems.map((it) => (
                  <ContentCard key={it.id} item={it} onOpen={setOpenId} />
                ))}
                {colItems.length === 0 && (
                  <div className="rounded-xl border border-dashed border-zinc-200 py-8 text-center text-xs text-zinc-300 bg-white/50">
                    沒有項目
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {openItem && <ContentDrawer item={openItem} onClose={() => setOpenId(null)} />}
    </>
  )
}

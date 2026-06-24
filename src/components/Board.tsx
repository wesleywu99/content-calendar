'use client'
import { useState } from 'react'
import type { ContentItem, ContentStatus } from '@/lib/types'
import ContentCard from './ContentCard'
import ContentDrawer from './ContentDrawer'

const COLUMN_DOTS: Record<string, string> = {
  idea: 'bg-outline',
  draft: 'bg-outline',
  review: 'bg-primary',
  approved: 'bg-on-tertiary-fixed-variant',
}

const COLUMNS: { key: ContentStatus; label: string }[] = [
  { key: 'idea', label: 'Idea' },
  { key: 'draft', label: 'Draft' },
  { key: 'review', label: 'Review' },
  { key: 'approved', label: 'Approved' },
]

export default function Board({ items }: { items: ContentItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const openItem = items.find((i) => i.id === openId) ?? null

  return (
    <>
      {/* Kanban Board Container (Stitch mockup) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar px-10 pb-10">
        <div className="flex h-full gap-5">
          {COLUMNS.map((col) => {
            const colItems = items.filter((it) => it.content_status === col.key)
            return (
              <div
                key={col.key}
                className="kanban-column flex flex-col h-full rounded-xl bg-surface-container-low/50"
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-[#ebebf0]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${COLUMN_DOTS[col.key] ?? 'bg-outline'}`} />
                    <h3 className="text-sm font-medium text-on-surface">{col.label}</h3>
                    <span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[10px] font-bold text-on-surface-variant">
                      {colItems.length}
                    </span>
                  </div>
                  <button className="text-outline hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">more_horiz</span>
                  </button>
                </div>

                {/* Column Items */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {colItems.map((it) => (
                    <ContentCard key={it.id} item={it} onOpen={setOpenId} />
                  ))}
                  {colItems.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-outline/40">
                      <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                      <p className="text-[10px] font-medium">No items yet</p>
                    </div>
                  )}
                </div>

                {/* Add Item Button */}
                <div className="p-3">
                  <button className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#ebebf0] hover:border-primary/40 hover:bg-surface-container-low rounded-lg text-[13px] text-outline/60 transition-all">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Item
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {openItem && <ContentDrawer item={openItem} onClose={() => setOpenId(null)} />}
    </>
  )
}

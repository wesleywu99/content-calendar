'use client'
import { useState } from 'react'
import type { ContentItem } from '@/lib/types'
import CalendarView from './CalendarView'
import Board from './Board'

type View = 'calendar' | 'board'

export default function ContentWorkspace({ items: initialItems }: { items: ContentItem[] }) {
  const [view, setView] = useState<View>('calendar')
  const [items, setItems] = useState<ContentItem[]>(initialItems)

  const handleCreated = (item: ContentItem) => setItems((prev) => [...prev, item])

  return (
    <>
      {/* View toggle bar */}
      <div className="flex items-center justify-end px-8 py-2.5 bg-surface border-b border-outline-variant/30 shrink-0">
        <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1">
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all ${
              view === 'calendar'
                ? 'bg-surface-container-lowest shadow-sm text-on-surface font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            Calendar
          </button>
          <button
            type="button"
            onClick={() => setView('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all ${
              view === 'board'
                ? 'bg-surface-container-lowest shadow-sm text-on-surface font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">view_kanban</span>
            Board
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarView items={items} onCreate={handleCreated} />
      ) : (
        <Board items={items} />
      )}
    </>
  )
}

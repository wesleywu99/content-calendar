'use client'
import type { ContentItem } from '@/lib/types'
import { useWorkspace } from './WorkspaceContext'
import CalendarView from './CalendarView'
import Board from './Board'

export default function ContentWorkspace({ items: initialItems }: { items: ContentItem[] }) {
  const { view, activePlatforms } = useWorkspace()
  const filteredItems = initialItems.filter((it) => activePlatforms.includes(it.platform))

  return (
    <>
      {/* Icon bar */}
      <div className="flex justify-end items-center px-8 py-2 bg-surface shrink-0">
        <div className="flex gap-1">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarView items={filteredItems} />
      ) : (
        <Board items={filteredItems} />
      )}
    </>
  )
}

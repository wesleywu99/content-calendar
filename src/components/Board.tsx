'use client'
import type { ContentItem, ContentStatus } from '@/lib/types'
import ContentCard from './ContentCard'

const COLUMNS: { key: ContentStatus; label: string }[] = [
  { key: 'draft', label: '草稿' },
  { key: 'review', label: '待審核' },
  { key: 'approved', label: '已核准' },
]

export default function Board({ items, onOpen }: { items: ContentItem[]; onOpen?: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map((col) => {
        const colItems = items.filter((it) => it.content_status === col.key)
        return (
          <div key={col.key} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold">{col.label}</span>
              <span className="text-xs text-gray-400">{colItems.length}</span>
            </div>
            {colItems.map((it) => (
              <ContentCard key={it.id} item={it} onOpen={onOpen} />
            ))}
            {colItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-300">
                沒有項目
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

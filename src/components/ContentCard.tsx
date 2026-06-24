'use client'
import type { ContentItem } from '@/lib/types'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

export default function ContentCard({ item, onOpen }: { item: ContentItem; onOpen?: (id: string) => void }) {
  const shortDate = item.publish_date ? item.publish_date.slice(5) : null

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className="w-full text-left bg-white rounded-xl p-4 flex flex-col gap-3 cursor-pointer ring-1 ring-zinc-200/60 shadow-sm transition-all duration-200 hover:shadow-md hover:ring-zinc-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
    >
      <h4 className="text-sm font-semibold text-zinc-800 leading-snug line-clamp-2">
        {item.title}
      </h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-1.5">
          <PlatformBadge platform={item.platform} />
          <StatusBadge status={item.content_status} />
        </div>
        {shortDate && (
          <span className="text-xs font-medium text-zinc-400">{shortDate}</span>
        )}
      </div>
    </button>
  )
}

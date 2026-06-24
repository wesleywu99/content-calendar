'use client'
import { format, parseISO } from 'date-fns'
import type { ContentItem } from '@/lib/types'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

export default function ContentCard({ item, onOpen }: { item: ContentItem; onOpen?: (id: string) => void }) {
  const dateLabel = item.publish_date
    ? format(parseISO(item.publish_date), 'MM-dd')
    : '未排程'

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className="group w-full text-left rounded-xl bg-white shadow-card ring-1 ring-zinc-900/5 p-4 hover:shadow-card-hover hover:ring-zinc-900/10 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <PlatformBadge platform={item.platform} />
        <StatusBadge status={item.content_status} />
      </div>
      <div className="mt-2.5 text-sm font-medium text-zinc-800 group-hover:text-zinc-900 line-clamp-2 transition-colors">
        {item.title}
      </div>
      <div className="mt-1 text-xs text-zinc-400">{dateLabel}</div>
    </button>
  )
}

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
      className="group w-full text-left bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-sm hover:border-primary hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <PlatformBadge platform={item.platform} tag />
      </div>
      <h4 className="text-sm font-medium text-on-surface mb-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {item.title}
      </h4>
      <div className="flex items-center justify-between">
        <StatusBadge status={item.content_status} />
        <span className="text-xs text-on-surface-variant">{dateLabel}</span>
      </div>
    </button>
  )
}

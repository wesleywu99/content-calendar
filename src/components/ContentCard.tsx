'use client'
import { format, parseISO } from 'date-fns'
import type { ContentItem } from '@/lib/types'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

export default function ContentCard({ item, onOpen }: { item: ContentItem; onOpen?: (id: string) => void }) {
  const dateLabel = item.publish_date
    ? format(parseISO(item.publish_date), 'MMM d')
    : null

  const isPublished = item.content_status === 'approved'

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className={`card-drag-handle group w-full text-left bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-card hover:border-primary transition-all duration-200 ${
        isPublished ? 'opacity-60 hover:opacity-100' : ''
      }`}
    >
      {/* Top row: Platform badge + Drag indicator */}
      <div className="flex justify-between items-start mb-2">
        <PlatformBadge platform={item.platform} tag />
        <span className="material-symbols-outlined text-outline text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {isPublished ? 'check_circle' : 'drag_indicator'}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-on-surface mb-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {item.title}
      </h4>

      {/* Caption preview (if available) */}
      {item.caption && (
        <p className="text-[13px] text-on-surface-variant line-clamp-2 mb-3 leading-[1.5]">
          {item.caption}
        </p>
      )}

      {/* Bottom row: status / date */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          {item.content_status === 'review' && (
            <div className="bg-error-container text-on-error-container text-[9px] font-bold px-1.5 py-0.5 rounded">
              URGENT
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isPublished ? (
            <span className="text-[10px] text-on-surface-variant italic">
              Published {dateLabel ?? ''}
            </span>
          ) : (
            <>
              <StatusBadge status={item.content_status} />
              {dateLabel && (
                <span className="text-[10px] text-on-surface-variant">{dateLabel}</span>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  )
}

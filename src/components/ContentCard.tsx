'use client'
import type { ContentItem } from '@/lib/types'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

const PLATFORM_COLOR: Record<string, string> = {
  xiaohongshu: '#d98484',
  instagram: '#c78599',
  facebook: '#7d8ba3',
}

export default function ContentCard({ item, onOpen }: { item: ContentItem; onOpen?: (id: string) => void }) {
  const color = PLATFORM_COLOR[item.platform] ?? '#9ca3af'
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className="w-full text-left rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-sm hover:border-gray-300 transition-all"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="px-3.5 py-3">
        <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <PlatformBadge platform={item.platform} />
          <StatusBadge status={item.content_status} />
          {item.publish_date && (
            <span className="text-[11px] text-gray-400 ml-auto">{item.publish_date}</span>
          )}
        </div>
      </div>
    </button>
  )
}

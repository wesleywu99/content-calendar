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
  const color = PLATFORM_COLOR[item.platform] ?? '#a1a1aa'
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className="w-full text-left rounded-xl bg-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      style={{
        borderLeft: `3px solid ${color}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)'
      }}
    >
      <div className="px-4 py-3.5">
        <div className="text-sm font-medium text-zinc-800 leading-snug truncate">{item.title}</div>
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <PlatformBadge platform={item.platform} />
          <StatusBadge status={item.content_status} />
          {item.publish_date && (
            <span className="text-[11px] text-zinc-400 ml-auto font-medium">{item.publish_date}</span>
          )}
        </div>
      </div>
    </button>
  )
}

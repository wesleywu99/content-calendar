'use client'
import type { ContentItem } from '@/lib/types'
import PlatformBadge from './PlatformBadge'

function gradientFor(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360
  return `linear-gradient(135deg, hsl(${h} 15% 91%), hsl(${(h + 40) % 360} 12% 83%))`
}

export default function ContentCard({ item, onOpen }: { item: ContentItem; onOpen?: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className="w-full text-left rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-sm transition"
    >
      <div className="h-28 w-full" style={{ background: gradientFor(item.id) }} />
      <div className="p-3">
        <div className="flex items-center gap-2">
          <PlatformBadge platform={item.platform} />
        </div>
        <div className="mt-1.5 text-sm font-medium truncate">{item.title}</div>
        <div className="mt-0.5 text-xs text-gray-400">{item.publish_date ?? '未排程'}</div>
      </div>
    </button>
  )
}

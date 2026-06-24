import type { ContentItem } from '@/lib/types'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

export default function Queue({ items, onOpen }: { items: ContentItem[]; onOpen?: (id: string) => void }) {
  const pending = items.filter((it) => it.content_status !== 'approved')
  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="px-4 py-3 border-b border-gray-200 font-semibold">需要處理</div>
      <ul className="divide-y divide-gray-100">
        {pending.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => onOpen?.(it.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-gray-50"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{it.title}</div>
                <div className="text-xs text-gray-400">{it.publish_date ?? '未排程'}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <PlatformBadge platform={it.platform} />
                <StatusBadge status={it.content_status} />
              </div>
            </button>
          </li>
        ))}
        {pending.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-gray-300">沒有待處理項目</li>
        )}
      </ul>
    </div>
  )
}

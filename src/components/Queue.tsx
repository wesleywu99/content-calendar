import type { ContentItem } from '@/lib/types'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

export default function Queue({ items, onOpen }: { items: ContentItem[]; onOpen?: (id: string) => void }) {
  const pending = items.filter((it) => it.content_status !== 'approved')
  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant shadow-card overflow-hidden">
      <div className="px-5 py-4 text-sm font-medium text-on-surface border-b border-outline-variant/30">需要處理</div>
      <ul className="divide-y divide-outline-variant/20">
        {pending.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => onOpen?.(it.id)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-surface-container-low transition-colors"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-on-surface truncate">{it.title}</div>
                <div className="text-xs text-on-surface-variant mt-0.5">{it.publish_date ?? '未排程'}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <PlatformBadge platform={it.platform} />
                <StatusBadge status={it.content_status} />
              </div>
            </button>
          </li>
        ))}
        {pending.length === 0 && (
          <li className="px-5 py-8 text-center text-xs text-outline">沒有待處理項目</li>
        )}
      </ul>
    </div>
  )
}

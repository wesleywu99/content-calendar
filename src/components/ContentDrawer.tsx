'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentItem, ContentStatus } from '@/lib/types'
import { nextStatuses, STATUS_LABEL } from '@/lib/domain/status'
import { saveCaption, changeStatus } from '@/app/(app)/actions'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

export default function ContentDrawer({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const router = useRouter()
  const [caption, setCaption] = useState(item.caption ?? '')

  const next = nextStatuses(item.content_status)

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-zinc-900/20 backdrop-blur-[1px]" />
      <aside className="relative w-[440px] max-w-[90vw] bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="text-sm font-medium text-zinc-500">內容詳情</div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
          <div className="flex items-center gap-2">
            <PlatformBadge platform={item.platform} />
            <StatusBadge status={item.content_status} />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{item.title}</h2>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">文案</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={() => { void saveCaption(item.id, caption); router.refresh() }}
              rows={5}
              placeholder="輸入文案…"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all resize-none"
            />
          </div>

          <div>
            <div className="text-xs font-medium text-zinc-500 mb-1">發佈日期</div>
            <div className="text-sm text-zinc-900">{item.publish_date ?? '未排程'}</div>
          </div>

          <div>
            <div className="text-xs font-medium text-zinc-500 mb-1">關聯洞察</div>
            <div className="text-sm text-zinc-400">{item.insight_id ?? '無'}</div>
          </div>
        </div>

        {next.length > 0 && (
          <div className="px-6 py-4 flex gap-2 border-t border-zinc-100">
            {next.map((to: ContentStatus) => (
              <button
                key={to}
                type="button"
                onClick={() => { void changeStatus(item.id, item.content_status, to); router.refresh() }}
                className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 active:scale-[0.98] transition-all"
              >
                {STATUS_LABEL[to]}
              </button>
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}

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
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-inverse-surface/20 backdrop-blur-[1px] animate-overlay-in" />
      <aside className="relative w-[440px] max-w-[90vw] bg-surface h-full shadow-2xl flex flex-col animate-drawer-in">
        <div className="flex items-center justify-between px-6 h-14 border-b border-outline-variant">
          <div className="text-sm font-medium text-on-surface-variant">內容詳情</div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-low hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-6">
          <div className="flex items-center gap-2">
            <PlatformBadge platform={item.platform} />
            <StatusBadge status={item.content_status} />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-on-surface">{item.title}</h2>

          <div>
            <label className="block label-caps text-on-surface-variant mb-2">文案</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={() => { void saveCaption(item.id, caption); router.refresh() }}
              rows={5}
              placeholder="輸入文案…"
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          <div>
            <div className="label-caps text-on-surface-variant mb-1">發佈日期</div>
            <div className="text-sm text-on-surface">{item.publish_date ?? '未排程'}</div>
          </div>

          <div>
            <div className="label-caps text-on-surface-variant mb-1">關聯洞察</div>
            <div className="text-sm text-outline">{item.insight_id ?? '無'}</div>
          </div>
        </div>

        {next.length > 0 && (
          <div className="px-6 py-4 flex gap-2 border-t border-outline-variant">
            {next.map((to: ContentStatus) => (
              <button
                key={to}
                type="button"
                onClick={() => { void changeStatus(item.id, item.content_status, to); router.refresh() }}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container transition-all active:scale-[0.98]"
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

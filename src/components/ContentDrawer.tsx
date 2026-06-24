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
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-black/30" />
      <aside className="relative w-[420px] max-w-[90vw] bg-white h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-200">
          <div className="font-semibold">內容詳情</div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-200 to-indigo-400" />

          <div className="flex items-center gap-2">
            <PlatformBadge platform={item.platform} />
            <StatusBadge status={item.content_status} />
            <span className="text-xs text-gray-400">{item.publish_date ?? '未排程'}</span>
          </div>

          <h2 className="text-lg font-semibold">{item.title}</h2>

          <div>
            <label className="text-xs text-gray-500">文案</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={() => { void saveCaption(item.id, caption); router.refresh() }}
              className="mt-1 w-full h-32 rounded-lg border border-gray-200 p-2 text-sm"
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">關聯洞察</div>
            <div className="text-xs text-gray-400">{item.insight_id ?? '無'}</div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex gap-2">
          {next.map((to: ContentStatus) => (
            <button
              key={to}
              type="button"
              onClick={() => { void changeStatus(item.id, item.content_status, to); router.refresh() }}
              className="flex-1 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
            >
              {STATUS_LABEL[to]}
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}

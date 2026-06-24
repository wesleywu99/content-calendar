'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentItem, ContentStatus } from '@/lib/types'
import { nextStatuses, STATUS_LABEL } from '@/lib/domain/status'
import { saveCaption, changeStatus } from '@/app/(app)/actions'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 px-6 py-3 border-b border-gray-100">
      <span className="w-20 shrink-0 text-xs text-gray-400 pt-0.5">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default function ContentDrawer({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const router = useRouter()
  const [caption, setCaption] = useState(item.caption ?? '')
  const next = nextStatuses(item.content_status)

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-black/20" />
      <aside className="relative w-[400px] max-w-[90vw] bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 h-13 border-b border-gray-200 shrink-0" style={{ height: '52px' }}>
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">內容創意</span>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-lg">
            ✕
          </button>
        </div>

        {/* Title */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-gray-900 leading-snug">{item.title}</h2>
        </div>

        {/* Fields — Airtable style */}
        <div className="flex-1 overflow-y-auto">
          <FieldRow label="平台">
            <PlatformBadge platform={item.platform} />
          </FieldRow>

          <FieldRow label="狀態">
            <StatusBadge status={item.content_status} />
          </FieldRow>

          <FieldRow label="發佈日期">
            <span className="text-sm text-gray-700">{item.publish_date ?? '—'}</span>
          </FieldRow>

          {item.insight_id && (
            <FieldRow label="關聯洞察">
              <span className="text-xs text-gray-500 break-all">{item.insight_id}</span>
            </FieldRow>
          )}

          {/* Caption — full width textarea */}
          <div className="px-6 py-4">
            <div className="text-xs text-gray-400 mb-2">文案 / 創意備注</div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={() => { void saveCaption(item.id, caption); router.refresh() }}
              rows={6}
              placeholder="輸入文案或創意想法…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Footer actions */}
        {next.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 flex gap-2 shrink-0">
            {next.map((to: ContentStatus) => (
              <button
                key={to}
                type="button"
                onClick={() => { void changeStatus(item.id, item.content_status, to); router.refresh() }}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
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

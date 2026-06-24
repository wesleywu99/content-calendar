'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentItem, ContentStatus } from '@/lib/types'
import { nextStatuses, STATUS_LABEL } from '@/lib/domain/status'
import { saveCaption, changeStatus } from '@/app/(app)/actions'
import PlatformBadge from './PlatformBadge'
import StatusBadge from './StatusBadge'

const ANIM_MS = 220

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
      {children}
    </div>
  )
}

export default function ContentDrawer({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const router = useRouter()
  const [caption, setCaption] = useState(item.caption ?? '')
  const [visible, setVisible] = useState(false)
  const next = nextStatuses(item.content_status)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, ANIM_MS)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop with blur */}
      <button
        type="button"
        aria-label="關閉"
        onClick={handleClose}
        className="absolute inset-0 cursor-default transition-opacity duration-200 backdrop-blur-[2px]"
        style={{ background: 'rgba(9,9,11,0.15)', opacity: visible ? 1 : 0 }}
      />

      {/* Panel */}
      <aside
        className="relative w-[440px] max-w-[92vw] bg-white h-full flex flex-col shadow-2xl transition-transform ease-out"
        style={{
          transitionDuration: `${ANIM_MS}ms`,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          borderLeft: '1px solid rgba(228,228,231,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight truncate pr-4">
            {item.title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Platform + Status — 2 column grid */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <FieldLabel>平台</FieldLabel>
              <PlatformBadge platform={item.platform} />
            </div>
            <div>
              <FieldLabel>狀態</FieldLabel>
              <StatusBadge status={item.content_status} />
            </div>
          </div>

          <div className="border-t border-zinc-100" />

          {/* Publish date */}
          <div>
            <FieldLabel>發佈日期</FieldLabel>
            <div className="text-sm font-medium text-zinc-800">
              {item.publish_date ?? '—'}
            </div>
          </div>

          {item.insight_id && (
            <>
              <div className="border-t border-zinc-100" />
              <div>
                <FieldLabel>關聯洞察</FieldLabel>
                <div className="text-xs text-zinc-500 break-all">{item.insight_id}</div>
              </div>
            </>
          )}

          <div className="border-t border-zinc-100" />

          {/* Caption */}
          <div>
            <FieldLabel>文案 / 創意備注</FieldLabel>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={() => { void saveCaption(item.id, caption); router.refresh() }}
              rows={6}
              placeholder="輸入文案或創意想法…"
              className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all duration-150 resize-none shadow-sm"
            />
          </div>
        </div>

        {/* Footer */}
        {next.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 shrink-0 flex gap-2">
            {next.map((to: ContentStatus) => (
              <button
                key={to}
                type="button"
                onClick={() => { void changeStatus(item.id, item.content_status, to); router.refresh() }}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-all duration-150 active:scale-95"
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

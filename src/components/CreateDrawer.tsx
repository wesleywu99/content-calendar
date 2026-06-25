'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentItem, Platform } from '@/lib/types'
import { createContent } from '@/app/(app)/actions'

const PLATFORMS: { key: Platform; label: string; dot: string }[] = [
  { key: 'xiaohongshu', label: '小紅書', dot: 'bg-error' },
  { key: 'instagram', label: 'Instagram', dot: 'bg-primary' },
  { key: 'facebook', label: 'Facebook', dot: 'bg-blue-400' },
]

export default function CreateDrawer({
  date,
  onClose,
  onCreated,
}: {
  date: string
  onClose: () => void
  onCreated: (item: ContentItem) => void
}) {
  const router = useRouter()
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      const row = await createContent({
        platform,
        title: title.trim(),
        publish_date: date,
        caption: caption.trim() || null,
      })
      if (row) {
        router.refresh()
      } else {
        onCreated({
          id: `local-${Date.now()}`,
          title: title.trim(),
          platform,
          publish_date: date,
          caption: caption.trim() || null,
          content_status: 'idea',
          asset_status: 'none',
          insight_id: null,
          fingerprint: `manual:${platform}:${Date.now()}`,
          owner: null,
          generated_by: null,
          human_edited: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } finally {
      setSaving(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-inverse-surface/20 backdrop-blur-[1px] animate-overlay-in"
      />
      <aside className="relative w-[440px] max-w-[90vw] bg-surface h-full shadow-elevated flex flex-col animate-drawer-in">
        <div className="flex items-center justify-between px-6 h-14 border-b border-[#ebebf0]">
          <div className="text-sm font-medium text-on-surface">New Content</div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-low hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-5">
          <div>
            <label className="block label-caps text-on-surface-variant mb-2">Platform</label>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlatform(p.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    platform === p.key
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block label-caps text-on-surface-variant mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Collection Launch"
              autoFocus
              className="w-full rounded-lg border border-[#ebebf0] px-3 py-2 text-[15px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block label-caps text-on-surface-variant mb-2">Publish Date</label>
            <div className="text-[15px] text-on-surface">{date}</div>
          </div>

          <div>
            <label className="block label-caps text-on-surface-variant mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={5}
              placeholder="Write your caption here…"
              className="w-full rounded-lg border border-[#ebebf0] px-3 py-2 text-[15px] leading-[1.6] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 flex justify-end gap-2 border-t border-[#ebebf0]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!title.trim() || saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-container active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-primary transition-all"
          >
            {saving ? 'Saving…' : 'Create'}
          </button>
        </div>
      </aside>
    </div>
  )
}

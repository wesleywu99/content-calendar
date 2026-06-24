'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Platform } from '@/lib/types'
import { generationCost, formatCost } from '@/lib/domain/cost'

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: 'xiaohongshu', label: '小紅書' },
  { key: 'instagram', label: 'IG' },
  { key: 'facebook', label: 'FB' },
]

type Status = 'idle' | 'generating' | 'done' | 'error'

export default function GenerateModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Platform[]>([])
  const [topic, setTopic] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const toggle = (p: Platform) =>
    setSelected((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))

  const cost = formatCost(generationCost(selected))

  const confirm = async () => {
    if (selected.length === 0 || !topic) return
    setStatus('generating')
    try {
      const res = await fetch('/api/flows/trigger', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ flowKey: 'gen', platforms: selected, topic, date }),
      })
      if (!res.ok) throw new Error('trigger failed')
      setStatus('done')
      router.refresh()
      setTimeout(onClose, 900)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-inverse-surface/20 backdrop-blur-[1px] animate-overlay-in" />
      <div className="relative w-[460px] max-w-[92vw] rounded-2xl bg-surface shadow-2xl p-7 border border-outline-variant/30 animate-modal-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-on-surface">新增內容構想</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-low hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block label-caps text-on-surface-variant mb-2">平台</label>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => {
                const on = selected.includes(p.key)
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => toggle(p.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${on ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block label-caps text-on-surface-variant mb-2">主題</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：端午節限定口味"
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block label-caps text-on-surface-variant mb-2">發佈日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-3">
            <span className="text-sm text-on-surface-variant">預估費用</span>
            <span className="text-sm font-semibold text-on-surface">{cost}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
            取消
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={status === 'generating' || selected.length === 0 || !topic}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-primary transition-all"
          >
            {status === 'generating' ? '生成中…' : status === 'done' ? '已送出 ✓' : '確認生成'}
          </button>
        </div>

        {status === 'generating' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-outline border-t-transparent animate-spin" />
            正在生成草稿…
          </div>
        )}
        {status === 'error' && <div className="mt-3 text-xs text-error">生成失敗，請重試。</div>}
      </div>
    </div>
  )
}

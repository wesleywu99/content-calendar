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
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-black/30" />
      <div className="relative w-[440px] max-w-[92vw] rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">生成內容</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1.5">平台（可多選）</div>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => {
                const on = selected.includes(p.key)
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => toggle(p.key)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${on ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-600'}`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1.5">主題</div>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：端午節限定口味"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1.5">發佈日期</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-xs text-gray-500">預估費用</span>
            <span className="text-sm font-semibold">{cost}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600">
            取消
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={status === 'generating' || selected.length === 0 || !topic}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {status === 'generating' ? '生成中…' : status === 'done' ? '已送出 ✓' : '確認生成'}
          </button>
        </div>

        {status === 'generating' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            正在生成草稿…
          </div>
        )}
        {status === 'error' && <div className="mt-3 text-xs text-red-500">生成失敗，請重試。</div>}
      </div>
    </div>
  )
}

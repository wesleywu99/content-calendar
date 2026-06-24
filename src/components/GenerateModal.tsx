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
      <button type="button" aria-label="關閉" onClick={onClose} className="absolute inset-0 bg-zinc-900/20 backdrop-blur-[1px]" />
      <div className="relative w-[460px] max-w-[92vw] rounded-2xl bg-white shadow-2xl p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">新增內容構想</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">平台</label>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => {
                const on = selected.includes(p.key)
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => toggle(p.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${on ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">主題</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：端午節限定口味"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">發佈日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
            <span className="text-sm text-zinc-500">預估費用</span>
            <span className="text-sm font-semibold text-zinc-900">{cost}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
            取消
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={status === 'generating' || selected.length === 0 || !topic}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-zinc-900 transition-all"
          >
            {status === 'generating' ? '生成中…' : status === 'done' ? '已送出 ✓' : '確認生成'}
          </button>
        </div>

        {status === 'generating' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
            正在生成草稿…
          </div>
        )}
        {status === 'error' && <div className="mt-3 text-xs text-red-500">生成失敗，請重試。</div>}
      </div>
    </div>
  )
}

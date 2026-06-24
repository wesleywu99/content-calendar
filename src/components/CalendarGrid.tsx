'use client'
import { useState } from 'react'
import { startOfMonth, startOfWeek, addDays, addMonths, format, isSameMonth } from 'date-fns'
import type { ContentItem, Platform } from '@/lib/types'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const PLATFORM_META: Record<Platform, { dot: string; label: string }> = {
  xiaohongshu: { dot: 'bg-error', label: '小紅書' },
  instagram: { dot: 'bg-primary', label: 'IG' },
  facebook: { dot: 'bg-blue-400', label: 'FB' },
}

const PLATFORM_CHIP: Record<string, string> = {
  xiaohongshu: 'bg-error/10 text-error',
  instagram: 'bg-primary/10 text-primary',
  facebook: 'bg-blue-400/10 text-blue-400',
}

const MAX_VISIBLE = 3

interface Props {
  month: Date
  items: ContentItem[]
  onMonthChange: (d: Date) => void
  onOpen: (id: string) => void
}

export default function CalendarGrid({ month, items, onMonthChange, onOpen }: Props) {
  const [activePlatforms, setActivePlatforms] = useState<Platform[]>(['xiaohongshu', 'instagram', 'facebook'])

  const monthStart = startOfMonth(month)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const todayKey = format(new Date(), 'yyyy-MM-dd')

  const togglePlatform = (p: Platform) =>
    setActivePlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))

  const itemsFor = (d: Date) => {
    const key = format(d, 'yyyy-MM-dd')
    return items.filter((it) => it.publish_date === key && activePlatforms.includes(it.platform))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Subheader */}
      <div className="px-6 py-3 bg-surface border-b border-outline-variant/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-xl">calendar_today</span>
            {format(month, 'yyyy 年 M 月')}
          </h2>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="上一月"
              onClick={() => onMonthChange(addMonths(month, -1))}
              className="p-1.5 hover:bg-surface-container border border-outline-variant rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              type="button"
              aria-label="下一月"
              onClick={() => onMonthChange(addMonths(month, 1))}
              className="p-1.5 hover:bg-surface-container border border-outline-variant rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => onMonthChange(new Date())}
              className="px-3 py-1 text-xs border border-outline-variant rounded label-caps hover:bg-surface-container transition-colors"
            >
              今天
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="label-caps text-on-surface-variant">篩選平台</span>
          <div className="flex bg-surface-container rounded-full p-1 border border-outline-variant/30">
            {(Object.keys(PLATFORM_META) as Platform[]).map((p) => {
              const on = activePlatforms.includes(p)
              const meta = PLATFORM_META[p]
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1 text-xs rounded-full transition-all flex items-center gap-1.5 ${on ? 'bg-surface-container-lowest shadow-sm text-on-surface' : 'text-on-surface-variant opacity-50'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-outline-variant/50 bg-surface shrink-0">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`py-2 text-center label-caps text-on-surface-variant ${i >= 5 ? 'text-error/50' : ''}`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-container-lowest">
        <div className="calendar-grid">
          {days.map((d) => {
            const inMonth = isSameMonth(d, month)
            const isToday = format(d, 'yyyy-MM-dd') === todayKey
            const dayItems = itemsFor(d)
            const visible = dayItems.slice(0, MAX_VISIBLE)
            const hiddenCount = dayItems.length - MAX_VISIBLE

            return (
              <div
                key={format(d, 'yyyy-MM-dd')}
                className={`bg-white p-2 min-h-[120px] transition-colors ${inMonth ? '' : 'bg-surface-dim/30'} hover:bg-surface-container-lowest/50`}
              >
                <div className="flex items-center">
                  {isToday ? (
                    <span className="text-xs font-bold flex items-center justify-center bg-primary text-on-primary w-6 h-6 rounded-full">
                      {format(d, 'd')}
                    </span>
                  ) : (
                    <span className={`text-xs font-medium ${inMonth ? 'text-on-surface' : 'text-on-surface-variant/40'}`}>
                      {format(d, 'd')}
                    </span>
                  )}
                  {isToday && (
                    <span className="text-[10px] ml-1 text-primary label-caps">TODAY</span>
                  )}
                </div>

                <div className="mt-1.5 space-y-1">
                  {visible.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => onOpen(it.id)}
                      className={`w-full text-left p-1.5 rounded border border-outline-variant/30 bg-white shadow-sm hover:border-primary transition-all ${PLATFORM_CHIP[it.platform] ?? 'bg-surface-container text-on-surface-variant'}`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${PLATFORM_META[it.platform as Platform]?.dot ?? 'bg-outline'}`} />
                        <span className="label-caps text-[9px]">
                          {PLATFORM_META[it.platform as Platform]?.label ?? it.platform}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium leading-tight line-clamp-1 text-on-surface">{it.title}</p>
                    </button>
                  ))}
                  {hiddenCount > 0 && (
                    <span className="text-[10px] font-medium text-on-surface-variant pl-1">
                      +{hiddenCount} 更多
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

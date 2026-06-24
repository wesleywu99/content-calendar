'use client'
import { startOfMonth, startOfWeek, addDays, addMonths, format, isSameMonth, isToday } from 'date-fns'
import type { ContentItem } from '@/lib/types'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const PLATFORM_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  xiaohongshu: { bg: 'rgba(217,132,132,0.1)', text: '#b45454', border: 'rgba(217,132,132,0.3)' },
  instagram:   { bg: 'rgba(199,133,153,0.1)', text: '#9a5f73', border: 'rgba(199,133,153,0.3)' },
  facebook:    { bg: 'rgba(125,139,163,0.1)', text: '#4f6280', border: 'rgba(125,139,163,0.3)' },
}

const MAX_VISIBLE = 3

interface Props {
  month: Date
  items: ContentItem[]
  onMonthChange: (d: Date) => void
  onOpen: (id: string) => void
}

export default function CalendarGrid({ month, items, onMonthChange, onOpen }: Props) {
  const monthStart = startOfMonth(month)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))

  const itemsFor = (d: Date) => {
    const key = format(d, 'yyyy-MM-dd')
    return items.filter((it) => it.publish_date === key)
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/70 bg-white">
        <div className="text-sm font-semibold text-zinc-800">{format(month, 'yyyy 年 M 月')}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="上一月"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="h-7 w-7 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors duration-150 flex items-center justify-center"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="今天"
            onClick={() => onMonthChange(new Date())}
            className="h-7 px-2.5 rounded-md text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors duration-150"
          >
            今天
          </button>
          <button
            type="button"
            aria-label="下一月"
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="h-7 w-7 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors duration-150 flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 bg-zinc-50 border-b border-zinc-200/70">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2.5 text-center text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid — gap-px technique for clean 1px internal lines */}
      <div className="grid grid-cols-7 gap-px bg-zinc-100">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month)
          const today = isToday(d)
          const dayItems = itemsFor(d)
          const visible = dayItems.slice(0, MAX_VISIBLE)
          const overflow = dayItems.length - MAX_VISIBLE

          return (
            <div
              key={format(d, 'yyyy-MM-dd')}
              className={`min-h-[100px] p-1.5 transition-colors duration-100 ${
                today ? 'bg-blue-50/60' : inMonth ? 'bg-white hover:bg-zinc-50/60' : 'bg-zinc-50/40'
              }`}
            >
              <div className="flex justify-end pr-0.5 mb-1.5">
                {today ? (
                  <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[11px] font-semibold flex items-center justify-center">
                    {format(d, 'd')}
                  </span>
                ) : (
                  <span className={`text-xs px-1 font-medium ${inMonth ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    {format(d, 'd')}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                {visible.map((it) => {
                  const p = PLATFORM_COLOR[it.platform]
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => onOpen(it.id)}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[11px] font-medium truncate cursor-pointer transition-opacity duration-100 hover:opacity-70 active:opacity-50"
                      style={{
                        background: p?.bg ?? 'rgba(0,0,0,0.04)',
                        color: p?.text ?? '#52525b',
                        border: `1px solid ${p?.border ?? 'rgba(0,0,0,0.1)'}`,
                      }}
                    >
                      {it.title}
                    </button>
                  )
                })}
                {overflow > 0 && (
                  <div className="text-[10px] text-zinc-400 px-2 py-0.5">
                    +{overflow} 個
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

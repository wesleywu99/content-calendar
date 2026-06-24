'use client'
import { startOfMonth, startOfWeek, addDays, addMonths, format, isSameMonth, isToday } from 'date-fns'
import type { ContentItem } from '@/lib/types'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const PLATFORM_COLOR: Record<string, string> = {
  xiaohongshu: '#d98484',
  instagram: '#c78599',
  facebook: '#7d8ba3',
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
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
        <div className="text-sm font-semibold text-gray-900">{format(month, 'yyyy 年 M 月')}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="上一月"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="h-7 w-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center justify-center text-base"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="今天"
            onClick={() => onMonthChange(new Date())}
            className="h-7 rounded-md px-2.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            今天
          </button>
          <button
            type="button"
            aria-label="下一月"
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="h-7 w-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center justify-center text-base"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 text-center text-[11px] font-medium text-gray-400 tracking-wide">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month)
          const today = isToday(d)
          const dayItems = itemsFor(d)
          const visible = dayItems.slice(0, MAX_VISIBLE)
          const overflow = dayItems.length - MAX_VISIBLE

          return (
            <div
              key={format(d, 'yyyy-MM-dd')}
              className={`min-h-[100px] border-b border-r border-gray-100 p-1.5 ${
                today ? 'bg-blue-50/40' : inMonth ? '' : 'bg-gray-50/50'
              }`}
            >
              <div className="flex justify-end pr-0.5 mb-1">
                {today ? (
                  <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[11px] font-medium flex items-center justify-center">
                    {format(d, 'd')}
                  </span>
                ) : (
                  <span className={`text-[11px] ${inMonth ? 'text-gray-500' : 'text-gray-300'}`}>
                    {format(d, 'd')}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                {visible.map((it) => {
                  const color = PLATFORM_COLOR[it.platform] ?? '#9ca3af'
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => onOpen(it.id)}
                      className="w-full text-left rounded px-1.5 py-0.5 text-[11px] truncate hover:brightness-95 transition-all"
                      style={{
                        background: `${color}18`,
                        borderLeft: `2px solid ${color}`,
                        color: color,
                      }}
                    >
                      {it.title}
                    </button>
                  )
                })}
                {overflow > 0 && (
                  <div className="text-[10px] text-gray-400 px-1.5 py-0.5">
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

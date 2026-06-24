'use client'
import { startOfMonth, startOfWeek, addDays, addMonths, format, isSameMonth } from 'date-fns'
import type { ContentItem } from '@/lib/types'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const PLATFORM_CHIP: Record<string, string> = {
  xiaohongshu: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  instagram: 'bg-violet-50 text-violet-700 hover:bg-violet-100',
  facebook: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
}

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
  const todayKey = format(new Date(), 'yyyy-MM-dd')

  const itemsFor = (d: Date) => {
    const key = format(d, 'yyyy-MM-dd')
    return items.filter((it) => it.publish_date === key)
  }

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-zinc-900/5 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-base font-semibold tracking-tight text-zinc-900">{format(month, 'yyyy 年 M 月')}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="上一月"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors flex items-center justify-center"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="今天"
            onClick={() => onMonthChange(new Date())}
            className="h-8 rounded-lg px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            今天
          </button>
          <button
            type="button"
            aria-label="下一月"
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-zinc-100">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-3 py-2 text-xs font-medium text-zinc-400">週{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-zinc-100">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month)
          const isToday = format(d, 'yyyy-MM-dd') === todayKey
          const dayItems = itemsFor(d)
          return (
            <div
              key={format(d, 'yyyy-MM-dd')}
              className={`min-h-[104px] p-2 border-b border-r border-zinc-100 ${inMonth ? '' : 'bg-zinc-50/50'}`}
            >
              <div className="flex items-center justify-center">
                <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-zinc-900 text-white font-medium' : inMonth ? 'text-zinc-600' : 'text-zinc-300'}`}>
                  {format(d, 'd')}
                </span>
              </div>
              <div className="mt-1 space-y-1">
                {dayItems.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onOpen(it.id)}
                    className={`w-full text-left rounded-md px-2 py-1 text-[11px] font-medium truncate transition-colors ${PLATFORM_CHIP[it.platform] ?? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                  >
                    {it.title}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

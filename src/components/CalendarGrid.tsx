'use client'
import { startOfMonth, startOfWeek, addDays, addMonths, format, isSameMonth } from 'date-fns'
import type { ContentItem } from '@/lib/types'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const PLATFORM_BAR: Record<string, string> = {
  xiaohongshu: 'bg-xhs',
  instagram: 'bg-ig',
  facebook: 'bg-fb',
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

  const itemsFor = (d: Date) => {
    const key = format(d, 'yyyy-MM-dd')
    return items.filter((it) => it.publish_date === key)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="font-semibold">{format(month, 'yyyy 年 M 月')}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="上一月"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="h-7 w-7 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="今天"
            onClick={() => onMonthChange(new Date())}
            className="h-7 rounded-md border border-gray-200 px-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            今天
          </button>
          <button
            type="button"
            aria-label="下一月"
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="h-7 w-7 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-2 py-1.5 text-center text-xs text-gray-400">週{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month)
          const dayItems = itemsFor(d)
          return (
            <div
              key={format(d, 'yyyy-MM-dd')}
              className={`min-h-[92px] border-b border-r border-gray-100 p-1 ${inMonth ? '' : 'bg-gray-50/60'}`}
            >
              <div className={`text-right text-xs px-1 ${inMonth ? 'text-gray-500' : 'text-gray-300'}`}>
                {format(d, 'd')}
              </div>
              <div className="mt-0.5 space-y-1">
                {dayItems.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onOpen(it.id)}
                    className="w-full text-left rounded-md bg-gray-50 hover:bg-gray-100 px-1.5 py-1 text-[11px] flex items-center gap-1"
                  >
                    <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${PLATFORM_BAR[it.platform] ?? 'bg-gray-400'}`} />
                    <span className="truncate">{it.title}</span>
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

'use client'
import { startOfMonth, startOfWeek, addDays, addMonths, format, isSameMonth, isToday } from 'date-fns'
import type { ContentItem } from '@/lib/types'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

// Pure color blocks — no border, high contrast bg+text
const PLATFORM_CHIP: Record<string, { bg: string; text: string }> = {
  xiaohongshu: { bg: '#fff1f2', text: '#e11d48' },
  instagram:   { bg: '#fdf2f8', text: '#db2777' },
  facebook:    { bg: '#eff6ff', text: '#2563eb' },
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
    <div className="w-full bg-white rounded-2xl ring-1 ring-zinc-200/60 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/60 bg-white shrink-0">
        <div className="text-sm font-semibold text-zinc-800">{format(month, 'yyyy 年 M 月')}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="上一月"
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="h-7 w-7 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors duration-150 flex items-center justify-center text-lg leading-none"
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
            className="h-7 w-7 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors duration-150 flex items-center justify-center text-lg leading-none"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 bg-zinc-50/80 border-b border-zinc-200/60 shrink-0">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2.5 text-center text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            {w}
          </div>
        ))}
      </div>

      {/* Days — gap-px with zinc-100 background for clean 1px grid lines */}
      <div className="flex-1 grid grid-cols-7 gap-px bg-zinc-100">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month)
          const today = isToday(d)
          const dayItems = itemsFor(d)
          const visible = dayItems.slice(0, MAX_VISIBLE)
          const overflow = dayItems.length - MAX_VISIBLE

          return (
            <div
              key={format(d, 'yyyy-MM-dd')}
              className={`min-h-[100px] p-1.5 flex flex-col gap-1 transition-colors duration-100 ${
                !inMonth
                  ? 'bg-zinc-50/50'
                  : today
                  ? 'bg-blue-50/40'
                  : 'bg-white hover:bg-zinc-50/50'
              }`}
            >
              {/* Date number — left aligned */}
              <div className="pl-1 pt-0.5">
                {today ? (
                  <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[11px] font-semibold flex items-center justify-center">
                    {format(d, 'd')}
                  </span>
                ) : (
                  <span className={`text-xs font-medium ${inMonth ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    {format(d, 'd')}
                  </span>
                )}
              </div>

              {/* Event chips — no border, pure color blocks */}
              <div className="space-y-0.5">
                {visible.map((it) => {
                  const chip = PLATFORM_CHIP[it.platform]
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => onOpen(it.id)}
                      className="w-full text-left rounded-md px-2 py-1 text-[11px] font-medium truncate cursor-pointer transition-opacity duration-100 hover:opacity-70 active:opacity-50"
                      style={{
                        background: chip?.bg ?? '#f4f4f5',
                        color: chip?.text ?? '#52525b',
                      }}
                    >
                      {it.title}
                    </button>
                  )
                })}
                {overflow > 0 && (
                  <div className="text-[10px] text-zinc-400 px-2 py-0.5">+{overflow} 個</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

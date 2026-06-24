'use client'
import { useState, useRef, useEffect } from 'react'
import {
  startOfMonth, startOfWeek, addDays, addMonths, subMonths,
  format, isSameMonth, isSameDay, setMonth, setYear, getYear,
} from 'date-fns'
import type { ContentItem, Platform } from '@/lib/types'
import { STATUS_LABEL } from '@/lib/domain/status'
import type { ContentStatus } from '@/lib/types'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const PLATFORM_META: Record<Platform, { dot: string; label: string }> = {
  xiaohongshu: { dot: 'bg-error', label: '小紅書' },
  instagram: { dot: 'bg-primary', label: 'Instagram' },
  facebook: { dot: 'bg-blue-400', label: 'Facebook' },
}

const STATUS_CHIP: Record<ContentStatus, string> = {
  idea: 'text-on-surface-variant bg-surface-container',
  draft: 'text-on-surface-variant bg-surface-container',
  review: 'text-orange-600 bg-orange-50',
  approved: 'text-green-600 bg-green-50',
}

const MAX_VISIBLE = 3

interface Props {
  month: Date
  items: ContentItem[]
  onMonthChange: (d: Date) => void
  onOpen: (id: string) => void
}

// ---------- Mini Month Picker ----------
function MonthPicker({
  currentMonth,
  onSelect,
  onClose,
}: {
  currentMonth: Date
  onSelect: (d: Date) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [viewYear, setViewYear] = useState(getYear(currentMonth))

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const months = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-2 z-50 bg-surface-container-lowest rounded-2xl shadow-elevated border border-[#ebebf0] p-4 w-[280px] animate-modal-in"
    >
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setViewYear((y) => y - 1)}
          className="p-1 rounded-lg hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <span className="text-sm font-semibold text-on-surface">{viewYear}</span>
        <button
          type="button"
          onClick={() => setViewYear((y) => y + 1)}
          className="p-1 rounded-lg hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {months.map((m) => {
          const isActive = viewYear === getYear(currentMonth) && m === currentMonth.getMonth()
          return (
            <button
              key={m}
              type="button"
              onClick={() => {
                onSelect(setYear(setMonth(new Date(), m), viewYear))
                onClose()
              }}
              className={`py-2 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {format(setMonth(new Date(), m), 'MMM')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Main CalendarGrid ----------
export default function CalendarGrid({ month, items, onMonthChange, onOpen }: Props) {
  const [activePlatforms, setActivePlatforms] = useState<Platform[]>([
    'xiaohongshu', 'instagram', 'facebook',
  ])
  const [pickerOpen, setPickerOpen] = useState(false)

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
      {/* Header bar — no bottom border, clean and airy */}
      <div className="px-8 py-4 bg-surface flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          {/* Clickable month title */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              className="text-[20px] font-semibold tracking-[-0.02em] text-on-surface flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-outline text-[22px]">calendar_today</span>
              {format(month, 'MMMM yyyy')}
              <span className="material-symbols-outlined text-on-surface-variant/50 text-[18px]">
                {pickerOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {pickerOpen && (
              <MonthPicker
                currentMonth={month}
                onSelect={onMonthChange}
                onClose={() => setPickerOpen(false)}
              />
            )}
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => onMonthChange(subMonths(month, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => onMonthChange(addMonths(month, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          {/* Today button — blue accent */}
          <button
            type="button"
            onClick={() => onMonthChange(new Date())}
            className="px-4 py-1.5 text-[12px] font-semibold text-white bg-primary rounded-full hover:bg-primary-container transition-colors"
          >
            Today
          </button>
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-3">
          <span className="label-caps text-xs text-on-surface-variant/60">Filter</span>
          <div className="flex bg-surface-container-low rounded-full p-1">
            {(Object.keys(PLATFORM_META) as Platform[]).map((p) => {
              const on = activePlatforms.includes(p)
              const meta = PLATFORM_META[p]
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 text-[11px] rounded-full transition-all flex items-center gap-1.5 ${
                    on
                      ? 'bg-white shadow-sm'
                      : 'text-on-surface-variant/60 hover:text-on-surface-variant'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Day labels — no border, just floating text */}
      <div className="grid grid-cols-7 px-8 shrink-0">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`py-3 text-center label-caps text-[10px] text-on-surface-variant/50 ${
              i >= 5 ? 'text-error/30' : ''
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid — rounded container with generous padding */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
        <div className="calendar-grid shadow-card">
          {days.map((d) => {
            const inMonth = isSameMonth(d, month)
            const isToday = format(d, 'yyyy-MM-dd') === todayKey
            const dayItems = itemsFor(d)
            const visible = dayItems.slice(0, MAX_VISIBLE)
            const hiddenCount = dayItems.length - MAX_VISIBLE

            return (
              <div
                key={format(d, 'yyyy-MM-dd')}
                className={`calendar-cell p-3 ${
                  inMonth ? '' : 'text-on-surface-variant/30'
                } ${isToday ? 'bg-primary/[0.03]' : ''}`}
              >
                {/* Day number */}
                <div className="flex items-center gap-1.5">
                  {isToday ? (
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-[12px] font-bold">
                      {format(d, 'd')}
                    </span>
                  ) : (
                    <span className={`text-[13px] font-medium ${inMonth ? 'text-on-surface' : 'text-on-surface-variant/30'}`}>
                      {format(d, 'd')}
                    </span>
                  )}
                </div>

                {/* Event chips */}
                <div className="mt-2 space-y-1.5">
                  {visible.map((it) => {
                    const meta = PLATFORM_META[it.platform]
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => onOpen(it.id)}
                        className={`w-full text-left p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${
                          isToday ? 'ring-1 ring-primary/10' : ''
                        } ${it.content_status === 'review' ? 'border-l-[3px] border-l-primary/40' : ''}`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${meta?.dot ?? 'bg-outline'}`} />
                          <span className="label-caps text-[9px] uppercase text-on-surface-variant/60">
                            {meta?.label ?? it.platform}
                          </span>
                        </div>
                        <p className={`text-[11px] font-medium leading-tight line-clamp-1 ${
                          isToday ? 'text-primary font-semibold' : 'text-on-surface'
                        }`}>
                          {it.title}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${STATUS_CHIP[it.content_status]}`}>
                            {STATUS_LABEL[it.content_status]}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                  {hiddenCount > 0 && (
                    <span className="text-[10px] font-medium text-primary pl-1">
                      +{hiddenCount} more
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

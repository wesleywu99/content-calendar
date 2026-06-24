'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: '儀表板' },
  { href: '/calendar', label: '月曆' },
  { href: '/board', label: '看板' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-zinc-100 flex flex-col">
      <div className="h-16 flex items-center gap-2.5 px-6">
        <div className="w-7 h-7 rounded-lg bg-zinc-900" />
        <span className="font-semibold tracking-tight text-zinc-900">內容中心</span>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${active ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900'}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-6 py-4 text-[11px] text-zinc-400">
        團隊共用介面 · 內部測試
      </div>
    </aside>
  )
}

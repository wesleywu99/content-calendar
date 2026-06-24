'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: '月曆' },
  { href: '/board', label: '看板' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-52 shrink-0 border-r border-zinc-200/70 bg-zinc-50 flex flex-col">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-zinc-200/70">
        <div className="w-5 h-5 rounded bg-zinc-900" />
        <span className="text-sm font-semibold tracking-tight text-zinc-900">內容中心</span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                active
                  ? 'bg-white text-zinc-900 font-medium shadow-sm border border-zinc-200/50'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 text-[11px] text-zinc-400 border-t border-zinc-200/50">
        內部工具 · Beta
      </div>
    </aside>
  )
}

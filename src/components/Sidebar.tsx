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
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col">
      <div className="h-14 flex items-center gap-2 px-5 border-b border-gray-200">
        <div className="w-7 h-7 rounded-lg bg-brand" />
        <span className="font-semibold">內容中心</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${active ? 'bg-indigo-50 text-brand' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 text-[11px] text-gray-400 border-t border-gray-200">
        團隊共用介面 · 內部測試
      </div>
    </aside>
  )
}

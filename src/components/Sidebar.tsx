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
    <aside className="w-52 shrink-0 border-r border-gray-200 bg-white flex flex-col">
      <div className="h-[52px] flex items-center gap-2.5 px-5 border-b border-gray-200">
        <div className="w-6 h-6 rounded-md bg-gray-900" />
        <span className="text-sm font-semibold tracking-tight">內容中心</span>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                active
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 text-[11px] text-gray-300 border-t border-gray-100">
        內部工具 · Beta
      </div>
    </aside>
  )
}

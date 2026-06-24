'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GenerateButton from './GenerateButton'

const NAV = [
  { href: '/', label: '儀表板', icon: 'dashboard' },
  { href: '/board', label: '看板', icon: 'view_kanban' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 shrink-0 border-r border-outline-variant bg-surface flex flex-col py-6 px-4 overflow-y-auto custom-scrollbar">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-semibold tracking-tight text-on-surface">ContentFlow</h1>
        <p className="label-caps text-on-surface-variant mt-1">SaaS Platform</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${active ? 'text-primary font-bold bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[15px]">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4">
        <GenerateButton variant="full" />
        <div className="flex items-center gap-3 p-2 border border-outline-variant rounded-xl bg-surface-container-lowest">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
            AR
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate text-on-surface">Alex Rivera</p>
            <p className="label-caps text-on-surface-variant">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

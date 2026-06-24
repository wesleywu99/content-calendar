'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GenerateButton from './GenerateButton'

const NAV = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/', label: 'Calendar', icon: 'calendar_month' },
  { href: '/board', label: 'Board', icon: 'view_kanban' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 shrink-0 h-screen fixed left-0 top-0 flex flex-col py-6 px-4 bg-surface z-50">
      {/* Logo */}
      <div className="mb-10 px-2">
        <h1 className="text-[32px] font-semibold tracking-[-0.03em] leading-[1.2] text-on-surface">
          ContentFlow
        </h1>
        <p className="label-caps text-on-surface-variant uppercase mt-1">SaaS Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV.map((item, idx) => {
          // "Board" (idx=2) is the active item in the mockup, but we use pathname logic
          const active =
            item.href === '/board'
              ? pathname === '/board'
              : item.href === '/'
                ? pathname === '/' || pathname.startsWith('/calendar')
                : false
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                active
                  ? 'text-primary font-bold border-r-2 border-primary bg-surface-container-low'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
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

      {/* Bottom section */}
      <div className="mt-auto pt-4">
        <GenerateButton variant="full" />
      </div>
    </aside>
  )
}

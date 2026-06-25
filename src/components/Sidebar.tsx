'use client'
import GenerateButton from './GenerateButton'

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen fixed left-0 top-0 flex flex-col py-6 px-4 bg-surface z-50">
      {/* Logo */}
      <div className="mb-10 px-2">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.2] text-on-surface">
          Content Calendar
        </h1>
      </div>

      {/* Spacer — reserved for future macro navigation */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="mt-auto pt-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-surface-container-low border border-[#ebebf0] rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1 px-1">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        <GenerateButton variant="full" />
      </div>
    </aside>
  )
}

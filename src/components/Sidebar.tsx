'use client'
import GenerateButton from './GenerateButton'
import { useWorkspace } from './WorkspaceContext'
import type { Platform } from '@/lib/types'

const PLATFORM_META: Record<Platform, { dot: string; label: string }> = {
  xiaohongshu: { dot: 'bg-error', label: '小紅書' },
  instagram: { dot: 'bg-primary', label: 'Instagram' },
  facebook: { dot: 'bg-blue-400', label: 'Facebook' },
}

export default function Sidebar() {
  const { activePlatforms, togglePlatform } = useWorkspace()

  return (
    <aside className="w-64 shrink-0 h-screen fixed left-0 top-0 flex flex-col py-6 px-4 bg-[#F8F9FA] z-50">
      {/* Logo */}
      <div className="mb-6 px-2">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.2] text-on-surface">
          Content Calendar
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
          search
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white border border-[#ebebf0] rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-primary transition-all"
        />
      </div>

      {/* Generate */}
      <GenerateButton variant="full" />

      {/* Platform filter */}
      <div className="mt-6 px-2">
        <div className="label-caps text-on-surface-variant/60 mb-2">Platforms</div>
        <div className="space-y-1">
          {(Object.keys(PLATFORM_META) as Platform[]).map((p) => {
            const on = activePlatforms.includes(p)
            const meta = PLATFORM_META[p]
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                  on
                    ? 'bg-white shadow-sm font-medium text-on-surface border border-outline-variant/30'
                    : 'text-on-surface-variant/40 hover:bg-black/[0.05] hover:text-on-surface-variant/70 border border-transparent'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${meta.dot} ${on ? 'opacity-100' : 'opacity-20'}`} />
                {meta.label}
                {on && (
                  <span className="material-symbols-outlined text-[16px] ml-auto text-primary/60">check</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  )
}

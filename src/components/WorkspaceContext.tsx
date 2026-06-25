'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Platform } from '@/lib/types'

type ViewMode = 'calendar' | 'board'

interface WorkspaceState {
  activePlatforms: Platform[]
  togglePlatform: (p: Platform) => void
  view: ViewMode
  setView: (v: ViewMode) => void
}

const ALL_PLATFORMS: Platform[] = ['xiaohongshu', 'instagram', 'facebook']

const WorkspaceContext = createContext<WorkspaceState | null>(null)

export function useWorkspace(): WorkspaceState {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    return {
      activePlatforms: ALL_PLATFORMS,
      togglePlatform: () => {},
      view: 'calendar' as ViewMode,
      setView: () => {},
    }
  }
  return ctx
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activePlatforms, setActivePlatforms] = useState<Platform[]>(ALL_PLATFORMS)
  const [view, setView] = useState<ViewMode>('calendar')

  const togglePlatform = (p: Platform) =>
    setActivePlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))

  return (
    <WorkspaceContext.Provider value={{ activePlatforms, togglePlatform, view, setView }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function ViewToggle() {
  const { view, setView } = useWorkspace()
  return (
    <div className="flex items-center gap-0.5 bg-surface-container-low rounded-lg p-1">
      <button
        type="button"
        onClick={() => setView('calendar')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-md transition-all ${
          view === 'calendar'
            ? 'bg-surface-container-lowest shadow-sm text-on-surface font-medium'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
        Calendar
      </button>
      <button
        type="button"
        onClick={() => setView('board')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-md transition-all ${
          view === 'board'
            ? 'bg-surface-container-lowest shadow-sm text-on-surface font-medium'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">view_kanban</span>
        Board
      </button>
    </div>
  )
}

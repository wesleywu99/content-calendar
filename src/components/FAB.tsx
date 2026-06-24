'use client'

/**
 * Floating Action Button (from Stitch mockup)
 * Only visible on Dashboard / Calendar views
 */
export default function FAB() {
  return (
    <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-elevated flex items-center justify-center hover:scale-105 transition-transform group z-30">
      <span className="material-symbols-outlined text-2xl">add</span>
      <div className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        New Content Item
      </div>
    </button>
  )
}

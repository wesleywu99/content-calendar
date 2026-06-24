import GenerateButton from './GenerateButton'

export default function TopBar({ title }: { title?: string }) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-surface shrink-0 z-40">
      {/* Left: Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search content tasks..."
            className="w-full bg-surface-container-low border border-[#ebebf0] rounded-lg pl-10 pr-4 py-2 text-[13px] focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div className="h-6 w-px bg-[#ebebf0]" />
        <GenerateButton />
      </div>
    </header>
  )
}

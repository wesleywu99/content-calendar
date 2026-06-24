import GenerateButton from './GenerateButton'

export default function TopBar() {
  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-outline-variant bg-surface shrink-0">
      <div className="relative flex items-center group">
        <span className="material-symbols-outlined absolute left-3 text-outline group-focus-within:text-primary transition-colors">
          search
        </span>
        <input
          type="text"
          placeholder="搜尋內容..."
          className="pl-10 pr-4 py-1.5 w-64 border border-outline-variant rounded-md bg-transparent text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1 border-r border-outline-variant pr-3 mr-1">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <GenerateButton />
      </div>
    </header>
  )
}

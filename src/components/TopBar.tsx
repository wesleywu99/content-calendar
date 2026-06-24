export default function TopBar({ title }: { title: string }) {
  return (
    <header className="h-14 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-gray-400">生成中</span>
        <button
          type="button"
          disabled
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          生成內容
        </button>
      </div>
    </header>
  )
}

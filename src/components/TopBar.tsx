import GenerateButton from './GenerateButton'

export default function TopBar({ title }: { title: string }) {
  return (
    <header className="h-14 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <GenerateButton />
      </div>
    </header>
  )
}

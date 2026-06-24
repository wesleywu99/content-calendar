import GenerateButton from './GenerateButton'

export default function TopBar({ title }: { title: string }) {
  return (
    <header className="h-16 shrink-0 border-b border-zinc-200/70 bg-white flex items-center justify-between px-8">
      <h1 className="text-base font-semibold tracking-tight text-zinc-800">{title}</h1>
      <GenerateButton />
    </header>
  )
}

import GenerateButton from './GenerateButton'

export default function TopBar({ title }: { title: string }) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h1>
      <GenerateButton />
    </header>
  )
}

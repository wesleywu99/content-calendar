import { createClient } from '@/lib/supabase/server'
import { listContent } from '@/lib/repo/content'
import TopBar from '@/components/TopBar'
import Board from '@/components/Board'

export const dynamic = 'force-dynamic'

export default async function BoardPage() {
  const supabase = await createClient()
  const items = await listContent(supabase)
  return (
    <div className="flex flex-col h-full">
      <TopBar title="看板" />
      <main className="flex-1 overflow-auto p-8 bg-zinc-50">
        <Board items={items} />
      </main>
    </div>
  )
}

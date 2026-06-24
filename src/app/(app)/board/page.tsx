import { createClient } from '@/lib/supabase/server'
import { listContent } from '@/lib/repo/content'
import TopBar from '@/components/TopBar'
import Board from '@/components/Board'

export const dynamic = 'force-dynamic'

export default async function BoardPage() {
  const supabase = await createClient()
  const items = await listContent(supabase)
  return (
    <>
      <TopBar title="看板" />
      <main className="p-6">
        <Board items={items} />
      </main>
    </>
  )
}

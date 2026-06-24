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
      <TopBar />
      <div className="px-10 py-5 shrink-0">
        <h2 className="text-xl font-semibold tracking-tight text-on-surface">內容看板</h2>
        <p className="text-on-surface-variant text-sm mt-0.5">管理並追蹤即將發佈的社群貼文</p>
      </div>
      <Board items={items} />
    </>
  )
}

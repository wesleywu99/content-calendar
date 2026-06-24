import TopBar from '@/components/TopBar'
import Board from '@/components/Board'
import { MOCK_ITEMS } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export default async function BoardPage() {
  let items = MOCK_ITEMS
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@/lib/supabase/server')
      const { listContent } = await import('@/lib/repo/content')
      const supabase = await createClient()
      items = await listContent(supabase)
    }
  } catch {
    // Fall back to mock data
  }
  return (
    <>
      <TopBar />
      {/* Page Header */}
      <div className="px-10 py-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-[32px] font-semibold tracking-[-0.03em] leading-[1.2] text-on-surface">
            Content Board
          </h2>
          <p className="text-on-surface-variant text-[15px] mt-1">
            Manage and track your upcoming social media campaigns.
          </p>
        </div>
        <button className="flex items-center gap-2 border border-outline-variant px-3 py-1.5 rounded-lg text-[13px] text-on-surface-variant hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter
        </button>
      </div>
      <Board items={items} />
    </>
  )
}

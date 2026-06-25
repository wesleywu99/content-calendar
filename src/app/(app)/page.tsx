import ContentWorkspace from '@/components/ContentWorkspace'
import { MOCK_ITEMS } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
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
  return <ContentWorkspace items={items} />
}

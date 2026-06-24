import { createClient } from '@/lib/supabase/server'
import { listContent } from '@/lib/repo/content'
import TopBar from '@/components/TopBar'
import CalendarView from '@/components/CalendarView'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const items = await listContent(supabase)
  return (
    <>
      <TopBar />
      <CalendarView items={items} />
    </>
  )
}

import TopBar from '@/components/TopBar'

export default function DashboardPage() {
  return (
    <>
      <TopBar title="儀表板" />
      <main className="flex-1 p-6">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
          儀表板內容（月曆 + 待處理佇列）將在 Phase 4 接上。
        </div>
      </main>
    </>
  )
}

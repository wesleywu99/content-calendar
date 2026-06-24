import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 h-screen bg-background overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}

import Sidebar from '@/components/Sidebar'
import { WorkspaceProvider } from '@/components/WorkspaceContext'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className="min-h-screen">
        <Sidebar />
        <main className="ml-64 h-screen bg-background overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </WorkspaceProvider>
  )
}

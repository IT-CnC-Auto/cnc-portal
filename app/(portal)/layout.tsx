import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cnc-gray-50">
      {/* Fixed black sidebar (264px wide) */}
      <Sidebar />

      {/* Everything sits to the right of the sidebar */}
      <div className="pl-64 min-h-screen flex flex-col">
        <Header title="Dashboard" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

import { Sidebar } from '@/components/layout/Sidebar'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cnc-gray-50">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">{children}</div>
    </div>
  )
}

// app/(portal)/admin/layout.tsx
// Auth gate for all admin pages. Redirects non-admin/owner users to the portal root.

import { redirect } from 'next/navigation'
import { isAdminOrOwner } from '@/lib/auth/roles'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await isAdminOrOwner())) {
    redirect('/')
  }

  return <>{children}</>
}

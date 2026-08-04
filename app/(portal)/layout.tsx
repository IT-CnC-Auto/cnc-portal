import { redirect }     from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar }      from '@/components/layout/Sidebar'
import { Header }       from '@/components/layout/Header'
import { InactivityMonitor } from '@/components/layout/InactivityMonitor'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // MFA enforcement for ALL users: without a verified factor the session
  // stays at AAL1 — route to enrolment (no factor yet) or verification
  // (factor exists, this session not yet stepped up).
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aal?.currentLevel !== 'aal2') {
    redirect(aal?.nextLevel === 'aal2' ? '/mfa/verify' : '/mfa/enroll')
  }

  return (
    <div className="min-h-screen bg-cnc-gray-50">
      {/* Auto sign-out after 5 hours of inactivity */}
      <InactivityMonitor />
      {/* Fixed black sidebar (264px wide) */}
      <Sidebar />
      <div className="pl-64 min-h-screen flex flex-col">
        <Header title="Internal Portal" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

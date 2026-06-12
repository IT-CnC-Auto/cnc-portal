// src/app/(portal)/admin/members/page.tsx
// Server Component.  Verifies admin/owner, fetches all team data,
// then renders the interactive client component.

import { redirect }      from 'next/navigation'
import { createClient }  from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { TeamMember } from '@/types/members'
import MembersClient       from './_components/MembersClient'

export const metadata = { title: 'Team — Care Net Portal' }

// ── Data fetching ─────────────────────────────────────────────

async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createClient()

  // Profiles joined with roles — only accessible to admin/owner via RLS
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select(`
      id, full_name, email, photo_path,
      job_title, mfa_enrolled, is_active, invited_by, created_at,
      user_roles!inner ( role, department )
    `)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  // Auth metadata (last_sign_in_at, email_confirmed_at) — requires admin API
  const { data: { users: authUsers } } =
    await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })

  return (profiles ?? []).map((p: any) => {
    const authUser = authUsers.find(u => u.id === p.id)
    return {
      id:                 p.id,
      full_name:          p.full_name,
      email:              p.email,
      photo_path:         p.photo_path   ?? null,
      job_title:          p.job_title    ?? null,
      mfa_enrolled:       p.mfa_enrolled ?? false,
      is_active:          p.is_active,
      invited_by:         p.invited_by   ?? null,
      created_at:         p.created_at,
      role:               p.user_roles.role,
      department:         p.user_roles.department ?? null,
      last_sign_in_at:    authUser?.last_sign_in_at    ?? null,
      email_confirmed_at: authUser?.email_confirmed_at ?? null,
    } satisfies TeamMember
  })
}


// ── Page ──────────────────────────────────────────────────────

export default async function MembersPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Gate: must be owner or administrator
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!roleData || !['owner', 'administrator'].includes(roleData.role)) {
    redirect('/')
  }

  const members = await getTeamMembers()

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <MembersClient
        members={members}
        currentUserId={user.id}
        currentUserRole={roleData.role}
      />
    </div>
  )
}


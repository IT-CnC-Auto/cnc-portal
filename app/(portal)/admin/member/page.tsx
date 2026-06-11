// app/(portal)/admin/members/page.tsx
// Main member management page.
// Server component — fetches members and passes to client table.

import { supabaseAdmin } from '@/lib/supabase/admin'
import { isOwner } from '@/lib/auth/roles'
import AdminMemberTable from '@/components/AdminMemberTable'
import InviteMemberModal from '@/components/InviteMemberModal'
import type { MemberRecord } from '@/types/roles'

async function getMembers(): Promise<MemberRecord[]> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select(`
      id,
      full_name,
      email,
      photo_path,
      is_active,
      created_at,
      user_roles (
        role,
        department
      )
    `)
    .order('full_name', { ascending: true })

  if (error) {
    console.error('getMembers error:', error)
    return []
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    photo_path: row.photo_path,
    is_active: row.is_active,
    created_at: row.created_at,
    role: row.user_roles?.[0]?.role ?? 'department_member',
    department: row.user_roles?.[0]?.department ?? null,
  }))
}

export default async function MembersPage() {
  const [members, callerIsOwner] = await Promise.all([
    getMembers(),
    isOwner(),
  ])

  const activeCount = members.filter(m => m.is_active).length
  const inactiveCount = members.filter(m => !m.is_active).length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-6">
        <div className="rounded-lg border border-gray-200 px-5 py-3">
          <p className="text-sm text-gray-500">Active members</p>
          <p className="text-2xl font-bold text-black">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 px-5 py-3">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="text-2xl font-bold text-gray-400">{inactiveCount}</p>
        </div>
        <div className="ml-auto">
          {/* Invite button — opens modal client-side */}
          <InviteMemberModal callerIsOwner={callerIsOwner} />
        </div>
      </div>

      {/* Member table */}
      <AdminMemberTable
        members={members}
        callerIsOwner={callerIsOwner}
      />
    </div>
  )
}


// app/api/admin/members/[id]/route.ts
// PATCH:  Update a member's role or department.
// DELETE: Permanently remove a member — deletes the user_roles and
//         user_profiles rows first (both FK-reference auth.users and
//         block auth deletion), then deletes the auth user.
// Restricted to administrator and owner roles.
//
// TODO: Implement PATCH handler.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { isAdminOrOwner, getAuthUserId } from '@/lib/auth/roles'

export async function PATCH() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const userId = params.id
  const callerId = await getAuthUserId()

  if (userId === callerId) {
    return NextResponse.json(
      { error: 'You cannot remove your own account.' },
      { status: 400 }
    )
  }

  const supabaseAdmin = getSupabaseAdmin()

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // A half-activated invite may have no user_roles row — maybeSingle, not single
  const { data: roleRow } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (roleRow?.role === 'owner') {
    return NextResponse.json(
      { error: 'The owner account cannot be removed.' },
      { status: 400 }
    )
  }

  // Detach references the target holds in other members' rows so they
  // cannot block the deletes below.
  await supabaseAdmin
    .from('user_profiles')
    .update({ invited_by: null })
    .eq('invited_by', userId)
  await supabaseAdmin
    .from('user_roles')
    .update({ assigned_by: null })
    .eq('assigned_by', userId)

  // Children first — both tables FK-reference auth.users
  const { error: roleError } = await supabaseAdmin
    .from('user_roles')
    .delete()
    .eq('user_id', userId)

  if (roleError) {
    console.error('Member delete — user_roles error:', roleError)
    return NextResponse.json(
      { error: `Failed to delete role record: ${roleError.message}` },
      { status: 500 }
    )
  }

  const { error: profileDeleteError } = await supabaseAdmin
    .from('user_profiles')
    .delete()
    .eq('id', userId)

  if (profileDeleteError) {
    console.error('Member delete — user_profiles error:', profileDeleteError)
    return NextResponse.json(
      { error: `Failed to delete profile: ${profileDeleteError.message}` },
      { status: 500 }
    )
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (authError) {
    // Profile and role rows are already gone — the auth user is now orphaned
    console.error('Member delete — auth.users error:', authError)
    return NextResponse.json(
      {
        error: `Profile removed but auth user deletion failed: ${authError.message}. Delete the auth user manually in the Supabase dashboard.`,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: `${profile.email} has been removed.` })
}

// app/api/admin/invite/route.ts
// POST: Invite a new portal member by email.
// Sends a Supabase-managed invite email with a set-password link.
// Also creates the user_profiles and user_roles records.
// Restricted to administrator and owner roles only.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { isAdminOrOwner, getAuthUserId } from '@/lib/auth/roles'
import type { InviteMemberPayload } from '@/types/roles'

export async function POST(req: NextRequest) {
  // Auth check
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const invitedBy = await getAuthUserId()

  let body: InviteMemberPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, full_name, role, department } = body

  // Validation
  if (!email || !full_name || !role) {
    return NextResponse.json(
      { error: 'email, full_name and role are required' },
      { status: 400 }
    )
  }
  if (role === 'department_member' && !department) {
    return NextResponse.json(
      { error: 'department is required for department_member role' },
      { status: 400 }
    )
  }

  // Only owners can invite administrators or owners
  const callerRole = role
  if (
    (callerRole === 'administrator' || callerRole === 'owner') &&
    !(await isOwner())
  ) {
    return NextResponse.json(
      { error: 'Only the owner can assign administrator or owner roles' },
      { status: 403 }
    )
  }

  // Send Supabase invite email
  // This creates the auth.users record and sends a magic link / set-password email
  const { data: inviteData, error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name },           // stored in auth.users raw_user_meta_data
    })

  if (inviteError) {
    console.error('Invite error:', inviteError)
    return NextResponse.json(
      { error: inviteError.message },
      { status: 500 }
    )
  }

  const userId = inviteData.user.id

  // Create user_profiles record
  const { error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .insert({
      id: userId,
      full_name,
      email,
      invited_by: invitedBy,
    })

  if (profileError) {
    console.error('Profile insert error:', profileError)
    // Clean up the auth user if profile creation fails
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    )
  }

  // Create user_roles record
  const { error: roleError } = await supabaseAdmin
    .from('user_roles')
    .insert({
      user_id: userId,
      role,
      department: department ?? null,
      assigned_by: invitedBy,
    })

  if (roleError) {
    console.error('Role insert error:', roleError)
    return NextResponse.json(
      { error: 'Profile created but role assignment failed — check Supabase logs' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: `Invite sent to ${email}`, user_id: userId },
    { status: 201 }
  )
}

// Helper used above — import from roles.ts would cause circular issue so inline
async function isOwner(): Promise<boolean> {
  const { isOwner: checkOwner } = await import('@/lib/auth/roles')
  return checkOwner()
}

// app/api/admin/members/[id]/route.ts
// PUT:    Update a member's name, role, department, or active status.
// DELETE: Soft-delete (deactivate) a member. Hard-delete owner-only.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { isAdminOrOwner, isOwner, getCurrentUserRole } from '@/lib/auth/roles'
import type { UpdateMemberPayload } from '@/types/roles'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = params

  let body: UpdateMemberPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { full_name, role, department, is_active } = body

  // Only owners can elevate roles to administrator or owner
  if (role && (role === 'administrator' || role === 'owner')) {
    if (!(await isOwner())) {
      return NextResponse.json(
        { error: 'Only the owner can assign administrator or owner roles' },
        { status: 403 }
      )
    }
  }

  // Department required if role is being set to department_member
  if (role === 'department_member' && department === null) {
    return NextResponse.json(
      { error: 'department is required when role is department_member' },
      { status: 400 }
    )
  }

  // Update profile fields if provided
  if (full_name !== undefined || is_active !== undefined) {
    const profileUpdate: Record<string, unknown> = {}
    if (full_name !== undefined) profileUpdate.full_name = full_name
    if (is_active !== undefined) profileUpdate.is_active = is_active

    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update(profileUpdate)
      .eq('id', id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
  }

  // Update role fields if provided
  if (role !== undefined || department !== undefined) {
    const roleUpdate: Record<string, unknown> = {}
    if (role !== undefined) roleUpdate.role = role
    if (department !== undefined) roleUpdate.department = department

    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .update(roleUpdate)
      .eq('user_id', id)

    if (roleError) {
      console.error('Role update error:', roleError)
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Member updated' })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = params
  const callerIsOwner = await isOwner()
  const callerIsAdmin = await isAdminOrOwner()

  if (!callerIsAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Soft-delete: set is_active = false (available to admins)
  // Hard-delete: remove from auth.users entirely (owner only)
  // Default behaviour is soft-delete to preserve audit trail (POPIA)
  const hardDelete = callerIsOwner

  if (hardDelete) {
    // Deletes auth.users record — cascades to user_profiles and user_roles
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (error) {
      console.error('Hard delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'Member permanently removed' })
  }

  // Soft-delete: deactivate without removing data
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Soft delete error:', error)
    return NextResponse.json({ error: 'Failed to deactivate member' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Member deactivated' })
}


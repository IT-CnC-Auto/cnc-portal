// app/api/admin/members/route.ts
// GET:  List all portal members with their roles.
// POST: Resend invite email to a pending user (pass { user_id } in body).
// Restricted to administrator and owner roles.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { isAdminOrOwner } from '@/lib/auth/roles'
import type { MemberRecord } from '@/types/roles'

export async function GET() {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Join profiles and roles in one query
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
    console.error('Members fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }

  // Flatten the joined result into MemberRecord shape
  const members: MemberRecord[] = (data ?? []).map((row: any) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    photo_path: row.photo_path,
    is_active: row.is_active,
    created_at: row.created_at,
    role: row.user_roles?.[0]?.role ?? 'department_member',
    department: row.user_roles?.[0]?.department ?? null,
  }))

  return NextResponse.json({ members })
}

// Resend invite — regenerates the invite token and sends a fresh email
export async function POST(req: NextRequest) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { user_id: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  // Fetch the user's email from their profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('email')
    .eq('id', body.user_id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Re-send the invite — Supabase invalidates the old token automatically
  const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    profile.email
  )

  if (inviteError) {
    console.error('Resend invite error:', inviteError)
    return NextResponse.json({ error: inviteError.message }, { status: 500 })
  }

  return NextResponse.json({ message: `Invite resent to ${profile.email}` })
}

// app/api/admin/members/[id]/route.ts
// PATCH: Update a member's role or department.
// DELETE: Deactivate a member (sets is_active = false, does not delete auth user).
// Restricted to administrator and owner roles.
//
// TODO: Implement PATCH and DELETE handlers.

import { NextResponse } from 'next/server'

export async function PATCH() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

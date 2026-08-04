import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserRole, getCurrentUserDepartment } from '@/lib/auth/roles'

export const dynamic = 'force-dynamic'

// GET /api/executive
// Returns the Directors-page executive overview snapshot (executive_snapshot,
// single row id='current'). Directors Only: requires an authenticated session
// with role owner/administrator, or membership of the directors department.
// RLS on the table enforces the same rule as defence in depth.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const [role, department] = await Promise.all([
    getCurrentUserRole(),
    getCurrentUserDepartment(),
  ])

  const allowed = role === 'owner' || role === 'administrator' || department === 'directors'
  if (!allowed) {
    return NextResponse.json({ error: 'Restricted to directors' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('executive_snapshot')
    .select('*')
    .eq('id', 'current')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 })
  }
  if (!data) {
    return NextResponse.json({ empty: true }, { status: 200 })
  }

  return NextResponse.json(data, { status: 200 })
}

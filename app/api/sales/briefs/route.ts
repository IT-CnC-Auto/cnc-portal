import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/sales/briefs
// Returns the signed-in user's visible briefs from `sales_assistant_brief`
// (Internal Portal). Row-level security does the scoping — this route adds
// NO filtering logic of its own, by design:
//   - a consultant sees only their own briefs (via sales_consultant.user_id)
//   - sales / directors / owner / administrator see the management roll-up
// Uses the SSR client (user session) — NOT the anon-key REST pattern used by
// /api/sales/pipeline — precisely so RLS applies per-user.
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('sales_assistant_brief')
    .select('id, brief_date, scope, ghl_user_id, body_md, brief_data, model, generated_at')
    .order('brief_date', { ascending: false })
    .order('scope', { ascending: true })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 })
  }

  return NextResponse.json({ briefs: data ?? [], count: data?.length ?? 0 }, { status: 200 })
}

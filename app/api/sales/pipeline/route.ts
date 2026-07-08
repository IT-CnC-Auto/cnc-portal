import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// GET /api/sales/pipeline
// Reads the `sales_pipeline_opportunity` snapshot in the Internal Portal Supabase
// project. That snapshot is refreshed every 15 min from CNC Nexus
// (`integration_pipeline_opportunity`) by the `sync-pipeline-from-nexus` edge
// function — the "Nexus → Portal" bridge. Contact email/phone are intentionally
// not part of the snapshot (POPIA data minimisation).
export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const select = [
    'autohive_opportunity_id',
    'canonical_name',
    'company_name',
    'pipeline_name',
    'stage_name',
    'stage_position',
    'stage_probability',
    'monetary_value',
    'status',
    'autohive_assigned_to',
    'autohive_created_at',
    'autohive_updated_at',
    'last_stage_change_at',
    'nexus_synced_at',
  ].join(',')

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/sales_pipeline_opportunity?select=${select}&order=autohive_created_at.desc.nullslast`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    return NextResponse.json({ error: `Supabase error ${res.status}` }, { status: 502 })
  }

  const rows = (await res.json()) as Array<Record<string, unknown>>

  // freshness = newest nexus_synced_at across the snapshot
  const syncedAt = rows.reduce((max, r) => {
    const t = (r.nexus_synced_at as string | null) ?? ''
    return t > max ? t : max
  }, '')

  return NextResponse.json(
    { opportunities: rows, synced_at: syncedAt, count: rows.length },
    { status: 200 },
  )
}

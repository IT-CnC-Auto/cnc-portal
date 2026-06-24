import { NextResponse } from 'next/server'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// GET /api/finance
// Reads the cached finance_snapshot row written hourly by Make.com scenario #5479845
export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/finance_snapshot?id=eq.current&select=*`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      // Revalidate every 5 minutes on the CDN edge — Supabase is the cache,
      // Make.com writes to it hourly, so no need to hit Supabase on every request.
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: `Supabase error ${res.status}` }, { status: 502 })
  }

  const rows: {
    invoices: unknown[]
    pl_report: unknown
    period_from: string
    period_to: string
    synced_at: string
  }[] = await res.json()

  if (!rows.length) {
    // Snapshot not yet written — Make.com hasn't run yet
    return NextResponse.json({ empty: true }, { status: 200 })
  }

  const { invoices, pl_report, period_from, period_to, synced_at } = rows[0]

  return NextResponse.json(
    { invoices, reports: [pl_report], from: period_from, to: period_to, synced_at },
    { status: 200 }
  )
}

import { NextResponse } from 'next/server'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// GET /api/finance
// Reads the cached finance_snapshot row written hourly by Make.com scenario #5480740
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
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: `Supabase error ${res.status}` }, { status: 502 })
  }

  const rows: {
    invoices: { Invoices?: unknown[] } | null
    pl_report: unknown
    period_from: string
    period_to: string
    synced_at: string
  }[] = await res.json()

  if (!rows.length) {
    return NextResponse.json({ empty: true }, { status: 200 })
  }

  const { invoices, pl_report, period_from, period_to, synced_at } = rows[0]

  // invoices column stores the full Xero /2.0/Invoices response — extract the array
  const invoiceArray = (invoices as { Invoices?: unknown[] } | null)?.Invoices ?? []

  // pl_report stores the full Xero /2.0/Reports/ProfitAndLoss response; the report
  // rows live at .Reports[0]. Unwrap so the client sees reports[0].Rows directly.
  const plInner = (pl_report as { Reports?: unknown[] } | null)?.Reports?.[0] ?? pl_report

  return NextResponse.json(
    { invoices: invoiceArray, reports: [plInner], from: period_from, to: period_to, synced_at },
    { status: 200 }
  )
}

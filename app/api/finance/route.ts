import { NextResponse } from 'next/server'

const MAKE_ZONE            = process.env.MAKE_ZONE ?? 'us2'
const MAKE_API_KEY         = process.env.MAKE_API_KEY ?? ''
const SCENARIO_INVOICES    = 4661512
const SCENARIO_PL          = 4740403
const BASE                 = `https://${MAKE_ZONE}.make.com/api/v2`

async function runScenario(scenarioId: number, input: Record<string, unknown>) {
  const headers = {
    Authorization: `Token ${MAKE_API_KEY}`,
    'Content-Type': 'application/json',
  }

  // Trigger the scenario
  const runRes = await fetch(`${BASE}/scenarios/${scenarioId}/run`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input, responsive: true }),
  })

  if (!runRes.ok) {
    throw new Error(`Make.com run failed: ${runRes.status} ${await runRes.text()}`)
  }

  const run = await runRes.json()

  // If Make returns data directly (responsive mode), return it
  if (run.data ?? run.outputs ?? run.tool_output ?? run.output) {
    return run.data ?? run.outputs ?? run.tool_output ?? run.output
  }

  // Otherwise poll for execution result
  const execId = run.executionId ?? run.id
  if (!execId) return run

  for (let i = 0; i < 12; i++) {
    await new Promise(r => setTimeout(r, 1500))
    const statusRes = await fetch(`${BASE}/executions/${execId}`, { headers })
    if (!statusRes.ok) break
    const status = await statusRes.json()
    if (status.status === 'success' || status.status === 'completed') {
      return status.outputs ?? status.data ?? status
    }
    if (status.status === 'failed' || status.status === 'error') {
      throw new Error(`Scenario ${scenarioId} execution failed`)
    }
  }

  throw new Error(`Scenario ${scenarioId} timed out`)
}

// GET /api/finance
export async function GET() {
  if (!MAKE_API_KEY) {
    return NextResponse.json({ error: 'MAKE_API_KEY not configured' }, { status: 500 })
  }

  const now   = new Date()
  const yyyy  = now.getFullYear()
  const mm    = String(now.getMonth() + 1).padStart(2, '0')
  const dd    = String(now.getDate()).padStart(2, '0')
  const from  = `${yyyy}-${mm}-01`
  const to    = `${yyyy}-${mm}-${dd}`

  const [invoicesRaw, plRaw] = await Promise.all([
    runScenario(SCENARIO_INVOICES, { statuses: 'AUTHORISED,PAID', limit: 15 }),
    runScenario(SCENARIO_PL, { reportType: 'ProfitAndLoss', fromDate: from, toDate: to }),
  ])

  // Normalise invoices — Make.com returns array wrapped in bundles
  const bundles: Record<string, unknown>[] =
    Array.isArray(invoicesRaw)
      ? invoicesRaw
      : (invoicesRaw as { array?: unknown[] })?.array ?? []

  const invoices = bundles.map((b) => {
    const d = (b as { bundle?: unknown }).bundle ?? b
    return d as {
      InvoiceNumber: string
      Contact: { Name: string }
      Total: number
      AmountDue: number
      Date: string
      DueDate: string
      Status: string
      CurrencyCode: string
    }
  })

  // Normalise P&L — comes back as Xero Reports array
  const reports =
    (plRaw as { body?: { Reports?: unknown[] } })?.body?.Reports ??
    (plRaw as { Reports?: unknown[] })?.Reports ??
    []

  return NextResponse.json({ invoices, reports, from, to }, { status: 200 })
}

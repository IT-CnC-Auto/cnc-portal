'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

const CNC_RED = '#ED1B24'

// ── Types ────────────────────────────────────────────────────────────────────

interface XeroInvoice {
  InvoiceNumber: string
  Contact: { Name: string }
  Total: number
  AmountDue: number
  Date: string
  DueDate: string
  Status: string
  CurrencyCode: string
}

interface PlRow {
  RowType: string
  Title?: string
  Cells?: { Value: string }[]
  Rows?: PlRow[]
}

interface FinanceData {
  invoices: XeroInvoice[]
  reports: { Rows: PlRow[] }[]
  from: string
  to: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `R ${(n / 1_000).toFixed(0)}K`
  return fmt(n)
}

function extractPlValue(rows: PlRow[], title: string): number {
  for (const row of rows) {
    if (row.RowType === 'SummaryRow' && row.Cells?.[0]?.Value === title) {
      return parseFloat(row.Cells?.[1]?.Value ?? '0') || 0
    }
    if (row.Rows) {
      const v = extractPlValue(row.Rows, title)
      if (v !== 0) return v
    }
  }
  return 0
}

function invoiceStatus(inv: XeroInvoice): 'Paid' | 'Overdue' | 'Pending' {
  if (inv.Status === 'PAID') return 'Paid'
  if (inv.AmountDue > 0 && new Date(inv.DueDate) < new Date()) return 'Overdue'
  return 'Pending'
}

// ── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ icon, value, label, badge, badgeColor }: {
  icon: string; value: string; label: string; badge: string; badgeColor: string
}) {
  return (
    <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: `4px solid ${CNC_RED}` }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: '#fff5f5' }}>{icon}</div>
          <span className="text-xs font-bold" style={{ color: badgeColor }}>{badge}</span>
        </div>
        <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
      </div>
    </div>
  )
}

function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 rounded-full" style={{ background: CNC_RED }} />
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">{title}</h2>
      </div>
      {action}
    </div>
  )
}

const statusStyle: Record<string, string> = {
  Paid:    'bg-green-50 text-green-700',
  Pending: 'bg-yellow-50 text-yellow-700',
  Overdue: 'bg-red-50 text-red-700',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FinancePage() {
  const [data,    setData]    = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/finance')
      .then(r => {
        if (!r.ok) throw new Error(`API ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // ── Derived values ──────────────────────────────────────────────────────

  const plRows   = data?.reports?.[0]?.Rows ?? []
  const revenue  = extractPlValue(plRows, 'Total Income')
  const cogs     = extractPlValue(plRows, 'Total Cost of Sales')
  const expenses = extractPlValue(plRows, 'Total Operating Expenses')
  const netProfit = extractPlValue(plRows, 'Net Profit')

  const outstanding = (data?.invoices ?? [])
    .filter(i => i.Status === 'AUTHORISED')
    .reduce((s, i) => s + i.AmountDue, 0)

  const overdueCount = (data?.invoices ?? [])
    .filter(i => invoiceStatus(i) === 'Overdue').length

  // ── Loading / error states ───────────────────────────────────────────────

  if (loading) return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">FINANCE</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">Invoicing · Tax · Budget · Reporting</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-sm border border-gray-100 shadow-sm h-32 animate-pulse" style={{ borderTop: `4px solid ${CNC_RED}` }} />
        ))}
      </div>
      <div className="flex items-center justify-center h-40 text-sm text-gray-400">Fetching live data from Xero…</div>
    </div>
  )

  if (error) return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">FINANCE</h1>
        </div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-sm p-6 text-sm text-red-700">
        <p className="font-bold mb-1">Could not load Xero data</p>
        <p className="text-red-500">{error}</p>
        <p className="mt-3 text-red-400 text-xs">Check that MAKE_API_KEY is set in Vercel environment variables.</p>
      </div>
    </div>
  )

  const invoices = data?.invoices ?? []
  const period = data ? `${data.from} — ${data.to}` : ''

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">FINANCE</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">
          Live · Xero · {period}
          <span className="ml-2 inline-flex items-center gap-1 text-green-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Live
          </span>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="💰" value={fmtShort(revenue)}     label="MTD Revenue"          badge={`COS: ${fmtShort(cogs)}`}        badgeColor="#16a34a" />
        <KpiCard icon="📄" value={fmtShort(outstanding)} label="Outstanding Invoices"  badge={`${overdueCount} overdue`}       badgeColor={overdueCount > 0 ? CNC_RED : '#16a34a'} />
        <KpiCard icon="📉" value={fmtShort(expenses)}    label="MTD Operating Expenses" badge="vs Xero P&L"                   badgeColor="#d97706" />
        <KpiCard icon="📈" value={fmtShort(netProfit)}   label="Net Profit MTD"        badge={revenue > 0 ? `${((netProfit / revenue) * 100).toFixed(1)}% margin` : '—'} badgeColor="#16a34a" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader
            title={`INVOICES — ${invoices.length} RESULTS`}
            action={
              <span className="text-xs text-gray-400">Live · Xero</span>
            }
          />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Invoice', 'Client', 'Total', 'Amount Due', 'Due Date', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.slice(0, 12).map((inv, i) => {
                const st = invoiceStatus(inv)
                return (
                  <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                    <td className="px-5 py-3 text-sm font-bold text-gray-800">{inv.InvoiceNumber}</td>
                    <td className="px-5 py-3 text-sm text-gray-700 max-w-[160px] truncate">{inv.Contact?.Name ?? '—'}</td>
                    <td className="px-5 py-3 text-sm font-bold text-gray-900">{fmt(inv.Total)}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{fmt(inv.AmountDue)}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">{inv.DueDate ? new Date(inv.DueDate).toLocaleDateString('en-ZA') : '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle[st]}`}>{st}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="P&L SUMMARY" action={<span className="text-xs text-gray-400">{period}</span>} />
          <div className="divide-y divide-gray-50">
            {[
              { label: 'Total Income',             value: revenue,    color: '#16a34a' },
              { label: 'Cost of Sales',            value: cogs,       color: '#d97706' },
              { label: 'Gross Profit',             value: revenue - cogs, color: '#16a34a' },
              { label: 'Operating Expenses',       value: expenses,   color: CNC_RED   },
              { label: 'Net Profit',               value: netProfit,  color: netProfit >= 0 ? '#16a34a' : CNC_RED },
            ].map((row, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{row.label}</span>
                <span className="text-sm font-black" style={{ color: row.color }}>{fmtShort(row.value)}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-4 rounded-full" style={{ background: CNC_RED }} />
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">QUICK ACTIONS</h3>
            </div>
            <div className="space-y-2">
              {['Generate VAT201', 'Run Payroll', 'Export Management Accounts', 'Download IRP5s'].map(a => (
                <button key={a} className="w-full text-left text-xs font-bold text-gray-700 py-2 px-3 bg-gray-50 hover:bg-red-50 hover:text-red-700 transition-colors rounded-sm">
                  → {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

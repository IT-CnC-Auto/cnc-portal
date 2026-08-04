'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const CNC_RED = '#ED1B24'
const GREEN   = '#006100'
const AMBER   = '#E6A100'
const DARK    = '#1A1A1A'
const RED_NEG = '#C00000'

// Dot/bar colours for regional rows, assigned by position
const REGION_COLOURS = [DARK, RED_NEG, '#666666', '#8C8C8C', '#B0B0B0']

// ── Types (mirror public.executive_snapshot) ─────────────────────────────────

interface TargetRow   { label: string; amount: number }
interface RegionRow   { name: string; amount: number; yoy_pct: number }
interface CashAccount { name: string; amount: number; muted?: boolean }

interface ExecutiveSnapshot {
  period_label: string
  period_from: string
  period_to: string
  report_ref: string | null
  status_note: string | null
  source_note: string | null
  generated_on: string | null
  working_days_total: number
  working_days_elapsed: number
  public_holidays: number
  core_sales: number
  upselling: number | null
  breakeven_target: number | null
  targets: TargetRow[]
  regions: RegionRow[]
  prior_year_daily_avg: number | null
  cash_accounts: CashAccount[]
  cash_all_accounts: number | null
  cash_note: string | null
  cash_as_at: string | null
  updated_at: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function num(v: unknown): number {
  if (typeof v === 'number') return v
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? 0 : n
}

function fmtR(v: unknown): string {
  return `R ${Math.round(num(v)).toLocaleString('en-US')}`
}

function fmtPct(v: number, dp = 1): string {
  return `${v.toFixed(dp)}%`
}

function fmtSigned(v: number, dp = 1): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(dp)}%`
}

const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function parseISO(iso: string | null): Date | null {
  if (!iso) return null
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`)
  return isNaN(d.getTime()) ? null : d
}

function fmtDate(iso: string | null): string {
  const d = parseISO(iso)
  return d ? `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}` : ''
}

// "1 – 28 July 2026" when both dates share a month, else both in full
function fmtRange(fromIso: string, toIso: string): string {
  const a = parseISO(fromIso)
  const b = parseISO(toIso)
  if (!a || !b) return ''
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()} – ${b.getDate()} ${MONTHS_LONG[b.getMonth()]} ${b.getFullYear()}`
  }
  return `${fmtDate(fromIso)} – ${fmtDate(toIso)}`
}

// "1–28 Jul" for the core-sales card subtitle
function fmtRangeShort(fromIso: string, toIso: string): string {
  const a = parseISO(fromIso)
  const b = parseISO(toIso)
  if (!a || !b) return ''
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()}–${b.getDate()} ${MONTHS_SHORT[b.getMonth()]}`
  }
  return `${a.getDate()} ${MONTHS_SHORT[a.getMonth()]} – ${b.getDate()} ${MONTHS_SHORT[b.getMonth()]}`
}

function trackerColour(pct: number): string {
  if (pct >= 100) return GREEN
  if (pct >= 90)  return AMBER
  return RED_NEG
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Ring({ size, r, stroke, frac, colour, children }: {
  size: number; r: number; stroke: number; frac: number; colour: string; children: ReactNode
}) {
  const c = 2 * Math.PI * r
  const clamped = Math.min(Math.max(frac, 0), 1)
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e3e3e6" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={colour} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - clamped)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-medium text-gray-900">
        {children}
      </div>
    </div>
  )
}

function SummaryCard({ accent, label, value, sub }: {
  accent: string; label: string; value: string; sub: string
}) {
  return (
    <div className="rounded-lg px-4 py-3.5" style={{ background: '#f7f7f8', borderLeft: `3px solid ${accent}` }}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-600 mb-1.5">{label}</p>
      <p className="text-[22px] font-medium text-gray-900 leading-tight mb-1">{value}</p>
      <p className="text-[11px] text-gray-400">{sub}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase mb-3" style={{ color: CNC_RED, letterSpacing: '.08em' }}>
      {children}
    </p>
  )
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 px-[18px] py-4 ${className}`} style={{ background: '#f7f7f8' }}>
      {children}
    </div>
  )
}

function YoyChip({ pct }: { pct: number }) {
  const positive = pct >= 0
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-[10px]"
      style={positive ? { background: '#C6EFCE', color: '#006100' } : { background: '#FFC7CE', color: '#9C0006' }}
    >
      {fmtSigned(pct)}
    </span>
  )
}

function PageTitle() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
        <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">DIRECTORS</h1>
      </div>
      <p className="text-sm text-gray-400 ml-4">Executive Overview · Directors Only</p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type PageState = 'loading' | 'ready' | 'restricted' | 'empty' | 'error'

export default function DirectorsPage() {
  const [snap,   setSnap]   = useState<ExecutiveSnapshot | null>(null)
  const [state,  setState]  = useState<PageState>('loading')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    fetch('/api/executive')
      .then(async r => {
        if (r.status === 403) { setState('restricted'); return }
        if (!r.ok) throw new Error(`API ${r.status}`)
        const d = await r.json()
        if (d.empty) { setState('empty'); return }
        setSnap(d as ExecutiveSnapshot)
        setState('ready')
      })
      .catch(e => {
        setErrMsg(e instanceof Error ? e.message : String(e))
        setState('error')
      })
  }, [])

  if (state === 'loading') {
    return (
      <div className="max-w-screen-xl mx-auto">
        <PageTitle />
        <div className="max-w-[900px] mx-auto">
          <div className="h-40 rounded-t-xl animate-pulse" style={{ background: CNC_RED, opacity: 0.85 }} />
          <div className="h-96 rounded-b-xl border border-t-0 border-gray-200 bg-white animate-pulse" />
        </div>
      </div>
    )
  }

  if (state === 'restricted') {
    return (
      <div className="max-w-screen-xl mx-auto">
        <PageTitle />
        <div className="max-w-[900px] mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm font-bold text-gray-800 mb-2">This page is restricted</p>
          <p className="text-sm text-gray-500">
            The executive overview is available to directors and administrators only.
            If you believe you need access, please contact the portal administrator.
          </p>
        </div>
      </div>
    )
  }

  if (state === 'empty') {
    return (
      <div className="max-w-screen-xl mx-auto">
        <PageTitle />
        <div className="max-w-[900px] mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm font-bold text-gray-800 mb-2">No executive snapshot published yet</p>
          <p className="text-sm text-gray-500">
            The executive overview appears here once the reporting snapshot has been loaded for the current period.
          </p>
        </div>
      </div>
    )
  }

  if (state === 'error' || !snap) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <PageTitle />
        <div className="max-w-[900px] mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          <p className="font-bold mb-1">Could not load the executive overview</p>
          <p className="text-red-500">{errMsg || 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  // ── Derived values (all computed from the raw snapshot inputs) ─────────────

  const core   = num(snap.core_sales)
  const be     = num(snap.breakeven_target)
  const up     = num(snap.upselling)
  const daysT  = num(snap.working_days_total)
  const daysE  = num(snap.working_days_elapsed)
  const prior  = num(snap.prior_year_daily_avg)

  const bePct      = be > 0 ? (core / be) * 100 : 0
  const projected  = daysE > 0 ? (core / daysE) * daysT : core
  const dailyAvg   = daysE > 0 ? core / daysE : 0
  const yoyPct     = prior > 0 ? (dailyAvg / prior - 1) * 100 : 0
  const monthFrac  = daysT > 0 ? daysE / daysT : 0
  const daysLeft   = Math.max(daysT - daysE, 0)
  const upSharePct = core > 0 ? (up / core) * 100 : 0

  const trackerRows: TargetRow[] = [
    ...(be > 0 ? [{ label: 'Break even', amount: be }] : []),
    ...(snap.targets ?? []),
  ]

  const regions       = snap.regions ?? []
  const cashAccounts  = snap.cash_accounts ?? []
  const availableCash = cashAccounts.reduce((s, a) => s + num(a.amount), 0)

  const sourceLine = [
    `Reporting period: ${fmtRange(snap.period_from, snap.period_to)}`,
    snap.source_note ? `Source: ${snap.source_note}` : '',
    snap.generated_on ? `Generated ${fmtDate(snap.generated_on)}` : '',
  ].filter(Boolean).join('  |  ')

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-screen-xl mx-auto">
      <PageTitle />

      <div className="max-w-[900px] mx-auto">
        {/* Red header band */}
        <div className="rounded-t-xl px-6 pt-5" style={{ background: CNC_RED }}>
          {/* Brand row */}
          <div
            className="flex justify-between items-start gap-4 pb-3 mb-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,.32)' }}
          >
            <div className="text-white text-[15px] font-bold leading-tight" style={{ letterSpacing: '.02em' }}>
              Care Net Consultants
              <span className="block text-[10px] font-normal mt-[3px]" style={{ color: 'rgba(255,255,255,.9)', letterSpacing: '.01em' }}>
                Your Partner in Workplace Health
              </span>
            </div>
            <div
              className="text-right text-white text-[10px] font-bold uppercase leading-tight whitespace-nowrap"
              style={{ letterSpacing: '.09em' }}
            >
              Directors Only
              {snap.report_ref && (
                <span className="block font-normal normal-case mt-[3px]" style={{ letterSpacing: '.04em', color: 'rgba(255,255,255,.82)' }}>
                  {snap.report_ref}
                </span>
              )}
            </div>
          </div>

          {/* Title row */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-white text-lg font-medium mb-[2px]">
                Care Net Consultants: {snap.period_label}
              </h2>
              <p className="text-xs mb-3.5" style={{ color: 'rgba(255,255,255,.9)' }}>{sourceLine}</p>
            </div>
            {snap.status_note && (
              <span
                className="inline-flex items-center text-[11px] font-medium px-2.5 py-[3px] rounded-[10px] flex-none"
                style={{ background: '#FFF2CC', color: '#854F0B' }}
              >
                {snap.status_note}
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex">
            <span className="px-[18px] py-2 text-[13px] font-medium rounded-t-md bg-white" style={{ color: CNC_RED }}>
              Executive overview
            </span>
          </div>
        </div>
        <div style={{ height: 3, background: CNC_RED }} />

        {/* Body */}
        <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 px-6 pt-5 pb-6">
          <SectionLabel>Summary</SectionLabel>

          {/* Summary cards */}
          <div className="grid gap-2.5 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <SummaryCard accent={CNC_RED} label="Core sales" value={fmtR(core)} sub={`excl. VAT | ${fmtRangeShort(snap.period_from, snap.period_to)}`} />
            <SummaryCard accent={AMBER} label="Break even target" value={fmtR(be)} sub="Accumulated to date" />
            <SummaryCard accent="#666666" label="Upselling" value={fmtR(up)} sub={`${fmtPct(upSharePct)} of core`} />
            <SummaryCard
              accent={bePct >= 100 ? GREEN : RED_NEG}
              label="% of break even"
              value={fmtPct(bePct)}
              sub={bePct >= 100 ? 'Ahead of schedule' : 'Behind schedule'}
            />
            <SummaryCard accent={DARK} label="Projected month-end" value={fmtR(projected)} sub="At current daily rate" />
          </div>

          {/* Two-panel row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Month progress + target tracker */}
            <Panel>
              <p className="text-[13px] font-medium text-gray-900 mb-3.5">Month progress</p>
              <div className="flex items-center gap-4 mb-3">
                <Ring size={72} r={30} stroke={6} frac={monthFrac} colour={DARK}>
                  <span className="text-[15px]">{Math.round(monthFrac * 100)}%</span>
                </Ring>
                <div>
                  <p className="text-lg font-medium text-gray-900">{daysE} of {daysT} days</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{daysLeft} working days remaining</p>
                  <p className="text-[11px] text-gray-400">{num(snap.public_holidays)} public holidays</p>
                </div>
              </div>

              <p className="text-[13px] font-medium text-gray-900 mt-4 mb-1">Target tracker</p>
              {trackerRows.map((t, i) => {
                const amount = num(t.amount)
                const pct    = amount > 0 ? (core / amount) * 100 : 0
                const colour = trackerColour(pct)
                return (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <span className="text-xs text-gray-600 w-[72px] flex-none">{t.label}</span>
                    <div className="flex-1 h-2 rounded overflow-hidden" style={{ background: '#e3e3e6' }}>
                      <div className="h-full rounded" style={{ width: `${Math.min(pct, 100)}%`, background: colour }} />
                    </div>
                    <span className="text-xs font-medium w-[46px] text-right" style={{ color: colour }}>{fmtPct(pct)}</span>
                  </div>
                )
              })}
            </Panel>

            {/* Regional breakdown + YoY */}
            <Panel>
              <p className="text-[13px] font-medium text-gray-900 mb-3.5">Regional breakdown</p>
              {regions.map((rg, i) => {
                const amount = num(rg.amount)
                const share  = core > 0 ? (amount / core) * 100 : 0
                const colour = REGION_COLOURS[i % REGION_COLOURS.length]
                return (
                  <div key={i}>
                    <div className={`flex items-center gap-2.5 py-2 ${i < regions.length - 1 ? 'border-b border-gray-200' : ''}`} style={{ borderBottomWidth: i < regions.length - 1 ? 0.5 : 0 }}>
                      <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: colour }} />
                      <span className="text-[13px] text-gray-900 flex-1">{rg.name}</span>
                      <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap">{fmtR(amount)}</span>
                      <YoyChip pct={num(rg.yoy_pct)} />
                    </div>
                    <div className="pb-2.5 pl-5">
                      <div className="h-1.5 rounded-[3px] w-full" style={{ background: '#e3e3e6' }}>
                        <div className="h-full rounded-[3px]" style={{ width: `${Math.min(share, 100)}%`, background: colour }} />
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="mt-3 pt-3.5" style={{ borderTop: '.5px solid #e3e3e6' }}>
                <p className="text-[13px] font-medium text-gray-900 mb-3">YoY growth (daily average basis)</p>
                <div className="flex items-center gap-3">
                  <Ring size={60} r={24} stroke={6} frac={Math.abs(yoyPct) / 100} colour={yoyPct >= 0 ? GREEN : RED_NEG}>
                    <span className="text-[13px]">{fmtSigned(yoyPct)}</span>
                  </Ring>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{fmtR(dailyAvg)} / day</p>
                    {prior > 0 && (
                      <p className="text-[11px] text-gray-400 mt-0.5">vs {fmtR(prior)} / day prior year</p>
                    )}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Cash position */}
          {cashAccounts.length > 0 && (
            <>
              <SectionLabel>
                Cash position{snap.cash_as_at ? `: ${fmtDate(snap.cash_as_at)}` : ''}
              </SectionLabel>
              <Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {cashAccounts.map((a, i) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center py-[7px] text-[13px] ${i < cashAccounts.length - 1 ? 'border-b border-gray-200' : ''}`}
                      >
                        <span className={a.muted ? 'text-gray-400' : 'text-gray-600'}>{a.name}</span>
                        <span className={`font-medium ${a.muted ? 'text-gray-400' : 'text-gray-900'}`}>{fmtR(a.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center gap-2.5">
                    <div className="rounded-md px-3.5 py-2.5 flex justify-between items-center" style={{ background: '#C6EFCE' }}>
                      <span className="text-xs font-medium uppercase" style={{ color: GREEN }}>Available cash</span>
                      <span className="text-lg font-medium" style={{ color: GREEN }}>{fmtR(availableCash)}</span>
                    </div>
                    {snap.cash_all_accounts !== null && (
                      <div className="rounded-md px-3.5 py-2.5 flex justify-between items-center" style={{ background: DARK }}>
                        <span className="text-xs font-medium uppercase" style={{ color: 'rgba(255,255,255,.75)' }}>All accounts</span>
                        <span className="text-lg font-medium text-white">{fmtR(snap.cash_all_accounts)}</span>
                      </div>
                    )}
                    {snap.cash_note && (
                      <p className="text-[10px] text-gray-400 text-right m-0">{snap.cash_note}</p>
                    )}
                  </div>
                </div>
              </Panel>
            </>
          )}

          {/* Working-days bar */}
          <div className="mt-4">
            <div className="h-2.5 rounded-[5px] overflow-hidden mb-1" style={{ background: '#e3e3e6' }}>
              <div className="h-full rounded-[5px]" style={{ width: `${monthFrac * 100}%`, background: DARK }} />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Day {daysE} of {daysT}</span>
              <span>{daysLeft} working days remaining</span>
            </div>
          </div>
        </div>

        <p className="text-center italic text-[11px] text-gray-500 mt-5 mb-1">I am because we are.</p>
      </div>
    </div>
  )
}

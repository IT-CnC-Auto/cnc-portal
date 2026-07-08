'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp, Target, Trophy, Layers,
  UserCheck, RefreshCw, Phone, FileSignature, HeartHandshake,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'

export const dynamic = 'force-dynamic'

interface Opportunity {
  autohive_opportunity_id: string
  canonical_name: string | null
  company_name: string | null
  pipeline_name: string | null
  stage_name: string | null
  stage_position: number | null
  stage_probability: number | null
  monetary_value: number | null
  status: string | null
  autohive_assigned_to: string | null
  autohive_created_at: string | null
  autohive_updated_at: string | null
  nexus_synced_at: string | null
}

interface PipelineData {
  opportunities: Opportunity[]
  synced_at: string
  count: number
}

const zarShort = (n: number) => {
  if (n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `R ${Math.round(n / 1_000)}K`
  return `R ${Math.round(n)}`
}

const zar = (n: number) => `R ${Math.round(n).toLocaleString('en-ZA')}`

// AutoHive/GHL Sales Pipeline stage names → badge styling
const stageColors: Record<string, string> = {
  'Lead Captured': 'bg-gray-100 text-gray-600',
  'Contacted – Awaiting Response': 'bg-blue-50 text-blue-700',
  'Discovery Call Booked': 'bg-blue-50 text-blue-700',
  'Needs Identified – Proposal Pending': 'bg-orange-50 text-orange-700',
  'Quotation Sent': 'bg-orange-50 text-orange-700',
  'Negotiation / Follow-Up': 'bg-orange-50 text-orange-700',
  'Booking Confirmed': 'bg-green-50 text-green-700',
  'Won – Active Client': 'bg-green-50 text-green-700',
}

// AutoHive/GHL Sales Pipeline rep roster (assignedTo user id → display name)
const REP_NAMES: Record<string, string> = {
  BUmbSNmCrifMiDP5wgt1: 'Annemarie Lotter',
  SGrLQugQabeTWb4wBe7Q: 'Celeste Bulpitt',
  '52sed7BeubVEIoakOR61': 'Elsie Lubisi',
  IgJ1euJjU8LoKrTEx1Uz: 'Gladys Mgitywa',
  j8ufOBqYgnfuNuwoZYHA: 'Maryna Nel',
  U8pZMnuDQnJzghmcw54b: 'Sire van Zyl',
}

const ownerName = (id: string | null) =>
  id ? (REP_NAMES[id] ?? `${id.slice(0, 8)}…`) : 'Unassigned'

const actions = [
  { label: 'Lead Qualification', icon: Target, desc: 'SK-040 · ICP scoring for OH prospects' },
  { label: 'Client Onboarding', icon: UserCheck, desc: 'SK-042 · Welcome sequences + system setup' },
  { label: 'Renewal Management', icon: RefreshCw, desc: 'SK-043 · Contract expiry monitoring' },
  { label: '60-Second Sales Engine', icon: Phone, desc: 'SK-134 · Voice memo → AI outbound call' },
  { label: 'SLA Creation', icon: FileSignature, desc: 'SK-121 · KPIs, penalties, RACI matrix' },
  { label: 'Client Recovery', icon: HeartHandshake, desc: 'SK-123 · DISC-driven win-back sequences' },
]

const sectionTitle =
  'text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3'
const thCls = 'text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide'

export default function SalesPage() {
  const [data, setData] = useState<PipelineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sales/pipeline')
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`)
        return r.json()
      })
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData({
          opportunities: d.opportunities ?? [],
          synced_at: d.synced_at ?? '',
          count: d.count ?? 0,
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const opps = data?.opportunities ?? []
  const open = opps.filter((o) => o.status === 'open')
  const won = opps.filter((o) => o.status === 'won')
  const openValue = open.reduce((s, o) => s + (o.monetary_value ?? 0), 0)
  const weighted = open.reduce(
    (s, o) => s + (o.monetary_value ?? 0) * ((o.stage_probability ?? 0) / 100),
    0,
  )
  const wonValue = won.reduce((s, o) => s + (o.monetary_value ?? 0), 0)

  // Stage funnel (ordered by pipeline position)
  const stageMap = new Map<number, { name: string; count: number; value: number }>()
  for (const o of opps) {
    const pos = o.stage_position ?? -1
    const cur = stageMap.get(pos) ?? { name: o.stage_name ?? 'Unknown', count: 0, value: 0 }
    cur.count += 1
    cur.value += o.monetary_value ?? 0
    stageMap.set(pos, cur)
  }
  const stages = Array.from(stageMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v)

  // Newest opportunities first, by created date (nulls sink to the bottom)
  const recent = [...opps]
    .sort((a, b) => (b.autohive_created_at ?? '').localeCompare(a.autohive_created_at ?? ''))
    .slice(0, 25)

  const salesStats = [
    { title: 'Open Pipeline', value: zarShort(openValue), change: `${open.length} deals`, changePositive: true, icon: TrendingUp, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
    { title: 'Weighted Forecast', value: zarShort(weighted), change: 'prob-adjusted', changePositive: true, icon: Target, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Won', value: String(won.length), change: wonValue > 0 ? `+${zarShort(wonValue)}` : undefined, changePositive: true, icon: Trophy, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Total Opportunities', value: String(opps.length), icon: Layers, iconBg: 'bg-cnc-red/10', iconColor: 'text-cnc-red' },
  ]

  const syncedLabel = data?.synced_at
    ? new Date(data.synced_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

  return (
    <>
      <Header title="Sales & CRM" subtitle="Pipeline · AutoHive CRM · live from CNC Nexus" />
      <main className="flex-1 p-6 space-y-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-semibold mb-1">Could not load pipeline data</p>
            <p className="text-red-500">{error}</p>
            <p className="mt-2 text-red-400 text-xs">
              Check NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, and that the
              sync-pipeline-from-nexus edge function has run.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-cnc-gray-100 h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-cnc-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Live · {data?.count ?? 0} opportunities · synced {syncedLabel}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {salesStats.map((s) => (
                <StatCard key={s.title} {...s} />
              ))}
            </div>

            <section>
              <h3 className={sectionTitle}>Pipeline by Stage</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                {stages.map((s, i) => (
                  <div key={i} className="bg-white rounded-xl border border-cnc-gray-100 p-3">
                    <p className="text-[11px] text-cnc-gray-400 leading-tight h-8 overflow-hidden" title={s.name}>
                      {s.name}
                    </p>
                    <p className="text-xl font-heading font-bold text-cnc-black mt-1 leading-none">{s.count}</p>
                    <p className="text-xs text-cnc-gray-500 mt-1">{zarShort(s.value)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className={sectionTitle}>Active Pipeline — {recent.length} most recent</h3>
              <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-x-auto">
                <table className="w-full min-w-[820px]">
                  <thead>
                    <tr className="border-b border-cnc-gray-50">
                      {['Opportunity', 'Company', 'Value', 'Stage', 'Owner', 'Created', 'Updated'].map((h) => (
                        <th key={h} className={thCls}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((o) => (
                      <tr
                        key={o.autohive_opportunity_id}
                        className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-3 text-sm font-medium text-cnc-black max-w-[220px] truncate">
                          {o.canonical_name ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-sm text-cnc-gray-500 max-w-[180px] truncate">
                          {o.company_name ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-cnc-black whitespace-nowrap">
                          {zar(o.monetary_value ?? 0)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                              stageColors[o.stage_name ?? ''] ?? 'bg-gray-50 text-gray-600'
                            }`}
                          >
                            {o.stage_name ?? '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-cnc-gray-500 whitespace-nowrap">
                          {ownerName(o.autohive_assigned_to)}
                        </td>
                        <td className="px-5 py-3 text-xs text-cnc-gray-400 whitespace-nowrap">
                          {o.autohive_created_at
                            ? new Date(o.autohive_created_at).toLocaleDateString('en-ZA')
                            : '—'}
                        </td>
                        <td className="px-5 py-3 text-xs text-cnc-gray-400 whitespace-nowrap">
                          {o.autohive_updated_at
                            ? new Date(o.autohive_updated_at).toLocaleDateString('en-ZA')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* CRM Actions (skill launchers) */}
        <section>
          <h3 className={sectionTitle}>CRM Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map(({ label, icon: Icon, desc }) => (
              <button
                key={label}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-cnc-red/10 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-orange-500 group-hover:text-cnc-red transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-cnc-black">{label}</p>
                  <p className="text-xs text-cnc-gray-400 mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

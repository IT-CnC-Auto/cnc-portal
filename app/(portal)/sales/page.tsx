import type { Metadata } from 'next'
import {
  TrendingUp, UserCheck, RefreshCw, Phone,
  Target, FileSignature, HeartHandshake, BarChart3,
  AlertCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Sales & CRM' }

const stageColors: Record<string, string> = {
  'Lead Captured': 'bg-gray-100 text-gray-600',
  'Contacted – Awaiting Response': 'bg-blue-50 text-blue-700',
  'Discovery Call Booked': 'bg-indigo-50 text-indigo-700',
  'Needs Identified – Proposal Pending': 'bg-purple-50 text-purple-700',
  'Quotation Sent': 'bg-yellow-50 text-yellow-700',
  'Negotiation / Follow-Up': 'bg-orange-50 text-orange-700',
  'Booking Confirmed': 'bg-teal-50 text-teal-700',
  'Won – Active Client': 'bg-green-50 text-green-700',
}

const actions = [
  { label: 'Lead Qualification',       icon: Target,        desc: 'SK-040 · ICP scoring for OH prospects' },
  { label: 'Pipeline Management',       icon: BarChart3,     desc: 'SK-041 · AutoHive CRM stage tracking' },
  { label: 'Client Onboarding',         icon: UserCheck,     desc: 'SK-042 · Welcome sequences + system setup' },
  { label: 'Renewal Management',        icon: RefreshCw,     desc: 'SK-043 · Contract expiry monitoring' },
  { label: '60-Second Sales Engine',    icon: Phone,         desc: 'SK-134 · Voice memo → AI outbound call' },
  { label: 'SLA Creation',              icon: FileSignature, desc: 'SK-121 · KPIs, penalties, RACI matrix' },
  { label: 'Client Recovery',           icon: HeartHandshake,desc: 'SK-123 · DISC-driven 90-day win-back' },
]

function formatZAR(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default async function SalesPage() {
  const supabase = await createClient()

  const { data: opportunities, error } = await supabase
    .from('integration_pipeline_opportunity')
    .select('*')
    .order('monetary_value', { ascending: false })

  const open = opportunities?.filter((o) => o.status === 'open') ?? []
  const won  = opportunities?.filter((o) => o.status === 'won')  ?? []

  const pipelineValue = open.reduce((sum, o) => sum + (Number(o.monetary_value) || 0), 0)
  const weightedValue = open.reduce(
    (sum, o) => sum + ((Number(o.monetary_value) || 0) * (Number(o.stage_probability) || 0)) / 100,
    0
  )
  const renewalsDue = open.filter(
    (o) => o.stage_name === 'Negotiation / Follow-Up' || o.stage_name === 'Booking Confirmed'
  ).length

  const salesStats = [
    {
      title: 'Open Pipeline Value',
      value: formatZAR(pipelineValue),
      change: `${open.length} deals`,
      changePositive: true,
      icon: TrendingUp,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Weighted Forecast',
      value: formatZAR(weightedValue),
      change: 'probability-adjusted',
      changePositive: true,
      icon: BarChart3,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Won This Period',
      value: String(won.length),
      change: won.length > 0
        ? formatZAR(won.reduce((s, o) => s + (Number(o.monetary_value) || 0), 0))
        : undefined,
      changePositive: true,
      icon: Target,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Action Required',
      value: String(renewalsDue),
      change: renewalsDue > 0 ? 'needs attention' : undefined,
      changePositive: renewalsDue === 0,
      icon: RefreshCw,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ]

  return (
    <>
      <Header
        title="Sales & CRM"
        subtitle="Pipeline · AutoHive CRM · Mining · Construction · Manufacturing"
      />
      <main className="flex-1 p-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {salesStats.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        {/* Sync error notice */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-cnc-red">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Pipeline sync unavailable. Check Make.com scenario 5276329.</span>
          </div>
        )}

        {/* CRM Actions */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            CRM Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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

        {/* Live Pipeline */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Active Pipeline
          </h3>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            {open.length === 0 ? (
              <div className="p-8 text-center text-sm text-cnc-gray-400">
                No open opportunities found. Check AutoHive CRM sync.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cnc-gray-50">
                    {['Company', 'Stage', 'Value', 'Probability', 'Owner'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {open.slice(0, 20).map((deal, i) => (
                    <tr
                      key={deal.autohive_opportunity_id ?? i}
                      className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-cnc-black leading-tight">
                          {deal.company_name || deal.canonical_name || '—'}
                        </p>
                        {deal.company_name && deal.canonical_name && deal.company_name !== deal.canonical_name && (
                          <p className="text-xs text-cnc-gray-400 mt-0.5">{deal.canonical_name}</p>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColors[deal.stage_name] ?? 'bg-gray-50 text-gray-600'}`}>
                          {deal.stage_name ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-cnc-black">
                        {deal.monetary_value ? formatZAR(Number(deal.monetary_value)) : '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-cnc-gray-500">
                        {deal.stage_probability ? `${Number(deal.stage_probability).toFixed(0)}%` : '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-cnc-gray-500">
                        {deal.assigned_to ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {open.length > 20 && (
              <div className="px-5 py-3 border-t border-cnc-gray-50 text-xs text-cnc-gray-400">
                Showing top 20 of {open.length} open deals — open AutoHive CRM for full view
              </div>
            )}
          </div>
        </section>

        {/* Account Owners */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Account Owners
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Sire van Zyl', 'Gladys', 'Elsie', 'Celeste', 'Maryna', 'Annemarie'].map((name, i) => (
              <div
                key={name}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-cnc-gray-100 rounded-full text-xs font-semibold text-cnc-black"
              >
                <span className="w-5 h-5 rounded-full bg-cnc-red text-white flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </span>
                {name}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-cnc-gray-400">
            Round-robin lead assignment order (Make.com Scenario 5051344) · Sire added 25/06/2026
          </p>
        </section>

      </main>
    </>
  )
}

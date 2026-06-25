import type { Metadata } from 'next'
import { TrendingUp, UserCheck, RefreshCw, Phone, Target, FileSignature, HeartHandshake } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const metadata: Metadata = { title: 'Sales & CRM' }

const stageColors: Record<string, string> = {
  'Lead Captured':  'bg-gray-100 text-gray-600',
  'Qualification':  'bg-gray-100 text-gray-600',
  'Proposal':       'bg-blue-50 text-blue-700',
  'Negotiation':    'bg-orange-50 text-orange-700',
  'Presentation':   'bg-purple-50 text-purple-700',
  'Closing':        'bg-green-50 text-green-700',
  'Won':            'bg-green-100 text-green-800',
  'Lost':           'bg-red-50 text-red-700',
}

const actions = [
  { label: 'Lead Qualification', icon: Target,        desc: 'SK-040 · ICP scoring for OH prospects' },
  { label: 'Client Onboarding',  icon: UserCheck,     desc: 'SK-042 · Welcome sequences + system setup' },
  { label: 'Renewal Management', icon: RefreshCw,     desc: 'SK-043 · Contract expiry monitoring' },
  { label: '60-Second Sales Engine', icon: Phone,     desc: 'SK-134 · Voice memo → AI outbound call' },
  { label: 'SLA Creation',       icon: FileSignature, desc: 'SK-121 · KPIs, penalties, RACI matrix' },
  { label: 'Client Recovery',    icon: HeartHandshake,desc: 'SK-123 · DISC-driven win-back sequences' },
]

async function getPipelineData() {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('integration_pipeline_opportunity')
    .select('autohive_opportunity_id, canonical_name, company_name, stage_name, status, monetary_value, source, autohive_created_at')
    .eq('status', 'open')
    .order('autohive_created_at', { ascending: false })
    .limit(100)
  return data ?? []
}

export default async function SalesPage() {
  const opportunities = await getPipelineData()

  const totalValue  = opportunities.reduce((sum, o) => sum + (Number(o.monetary_value) || 0), 0)
  const totalCount  = opportunities.length
  const withValue   = opportunities.filter(o => Number(o.monetary_value) > 0).length

  const salesStats = [
    {
      title: 'Open Pipeline',
      value: totalValue > 0 ? `R ${(totalValue / 1000).toFixed(0)}K` : `${totalCount}`,
      change: totalValue > 0 ? `${totalCount} deals` : 'active leads',
      changePositive: true,
      icon: TrendingUp,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Won This Month',
      value: '—',
      icon: Target,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Active Clients',
      value: '124',
      icon: UserCheck,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Renewals Due (30d)',
      value: '7',
      change: '3 high risk',
      changePositive: false,
      icon: RefreshCw,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ]

  return (
    <>
      <Header title="Sales & CRM" subtitle="Pipeline · AutoHive CRM · Mining · Construction · Manufacturing" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {salesStats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            CRM Actions
          </h3>
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

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest">
              Active Pipeline
            </h3>
            <span className="text-xs text-cnc-gray-400">
              {totalCount} opportunities · live from AutoHive
            </span>
          </div>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cnc-gray-50">
                  {['Contact / Company', 'Stage', 'Value', 'Source', 'Added'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {opportunities.slice(0, 25).map((opp) => (
                  <tr key={opp.autohive_opportunity_id} className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-cnc-black">{opp.canonical_name}</p>
                      {opp.company_name && opp.company_name !== opp.canonical_name && (
                        <p className="text-xs text-cnc-gray-400 mt-0.5">{opp.company_name}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stageColors[opp.stage_name ?? ''] ?? 'bg-gray-50 text-gray-500'}`}>
                        {opp.stage_name ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-cnc-black">
                      {Number(opp.monetary_value) > 0
                        ? `R ${Number(opp.monetary_value).toLocaleString('en-ZA')}`
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500 capitalize">
                      {opp.source ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-xs text-cnc-gray-400">
                      {opp.autohive_created_at
                        ? new Date(opp.autohive_created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalCount > 25 && (
              <p className="px-5 py-3 text-xs text-cnc-gray-400 border-t border-cnc-gray-50">
                Showing 25 of {totalCount} open opportunities
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

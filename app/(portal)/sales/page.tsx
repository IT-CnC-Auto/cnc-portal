import type { Metadata } from 'next'
import {
  TrendingUp, UserCheck, RefreshCw, Phone, Target,
  FileSignature, HeartHandshake, LayoutList, ExternalLink,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'
import { getCrmAdmin } from '@/lib/supabase/admin'
import { STAGE_COLORS } from '@/lib/sales/stage-colors'

export const metadata: Metadata = { title: 'Sales & CRM' }
export const dynamic = 'force-dynamic'

// Swap CRM_BASE to your AutoHive white-label domain if different
const CRM_BASE = 'https://app.autohivetech.co.za/v2/location/z4TWGIAtg8ANLIbra7Yt/opportunities'

// GHL pipeline IDs (location z4TWGIAtg8ANLIbra7Yt)
const PIPELINE_SALES  = 'ODVqF9PNkIltiRkwXShs'  // "Sales Pipeline"
const PIPELINE_NEWBIZ = '4JiuAx2LUbKcIsHxyGXZ'  // "New Business"

// GHL user IDs → rep display names
const OWNER_NAMES: Record<string, string> = {
  'IgJ1euJjU8LoKrTEx1Uz': 'Gladys Mgitywa',
  'BUmbSNmCrifMiDP5wgt1': 'Annemarie Lotter',
  'j8ufOBqYgnfuNuwoZYHA': 'Maryna Ferreira',
  'SGrLQugQabeTWb4wBe7Q': 'Celeste Bulpitt',
  '52sed7BeubVEIoakOR61': 'Elsie Lubisi',
  'U8pZMnuDQnJzghmcw54b': 'Sire van Zyl',
}

const ACTIONS = [
  {
    label: 'Sales Pipeline',
    icon: LayoutList,
    desc: 'SK-041 · All open opportunities',
    href: `${CRM_BASE}/pipeline-details/${PIPELINE_SALES}`,
  },
  {
    label: 'Lead Qualification',
    icon: Target,
    desc: 'SK-040 · ICP scoring for OH prospects',
    href: `${CRM_BASE}/pipeline-details/${PIPELINE_SALES}`,
  },
  {
    label: 'Client Onboarding',
    icon: UserCheck,
    desc: 'SK-042 · Welcome sequences + system setup',
    href: `${CRM_BASE}/pipeline-details/${PIPELINE_NEWBIZ}`,
  },
  {
    label: 'Renewal Management',
    icon: RefreshCw,
    desc: 'SK-043 · Contract expiry monitoring',
    href: `${CRM_BASE}/contacts/`,
  },
  {
    label: '60-Second Sales Engine',
    icon: Phone,
    desc: 'SK-134 · Voice memo → AI outbound call',
    href: `${CRM_BASE}/automation/workflows/`,
  },
  {
    label: 'SLA Creation',
    icon: FileSignature,
    desc: 'SK-121 · KPIs, penalties, RACI matrix',
    href: `${CRM_BASE}/contacts/`,
  },
  {
    label: 'Client Recovery',
    icon: HeartHandshake,
    desc: 'SK-123 · DISC-driven win-back sequences',
    href: `${CRM_BASE}/contacts/`,
  },
]

// Connected app launch widgets
const apps = [
  { name: 'AutoHive CRM', abbr: 'AH',  color: 'bg-orange-500',  href: 'https://app.autohivetech.co.za/',        desc: 'Pipeline, contacts & opportunities' },
  { name: 'MCO Login',    abbr: 'MCO', color: 'bg-blue-600',    href: 'https://app.mycliniconline.co.za/login', desc: 'MyClinicOnline clinical system' },
  { name: 'ApprovalMax',  abbr: 'AM',  color: 'bg-emerald-600', href: 'https://app.approvalmax.com/login',      desc: 'Purchase & invoice approvals' },
  { name: 'Xero',         abbr: 'XR',  color: 'bg-sky-500',     href: 'https://login.xero.com/',                desc: 'Accounting, invoices & debtors' },
]

interface Deal {
  autohive_opportunity_id: string
  canonical_name:       string | null
  stage_name:           string | null
  monetary_value:       number
  autohive_assigned_to: string | null
  contact_email:        string | null
  company_name:         string | null
  source:               string | null
  autohive_created_at:  string | null
}

function fmtZAR(n: number) {
  if (n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `R ${Math.round(n / 1_000)}K`
  return `R ${n.toLocaleString('en-ZA')}`
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

async function getPipelineData() {
  // integration_pipeline_opportunity lives in CNC Nexus, not the portal project.
  const sb = getCrmAdmin()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [{ data: openDeals, error: e1 }, { data: wonData, error: e2 }] = await Promise.all([
    sb
      .from('integration_pipeline_opportunity')
      .select('autohive_opportunity_id, canonical_name, stage_name, monetary_value, autohive_assigned_to, contact_email, company_name, source, autohive_created_at')
      .eq('status', 'open')
      .order('autohive_created_at', { ascending: false }),
    sb
      .from('integration_pipeline_opportunity')
      .select('autohive_opportunity_id, last_status_change_at')
      .eq('status', 'won'),
  ])

  if (e1) throw new Error(e1.message)
  if (e2) throw new Error(e2.message)

  const all = (openDeals ?? []) as Deal[]
  const won = wonData ?? []
  const wonThisMonth = won.filter((d: any) => d.last_status_change_at >= monthStart).length

  return {
    deals:       all.slice(0, 25),
    openCount:   all.length,
    totalValue:  all.reduce((s, d) => s + (d.monetary_value ?? 0), 0),
    wonThisMonth,
    totalWon:    won.length,
  }
}

export default async function SalesPage() {
  let deals: Deal[]     = []
  let openCount         = 0
  let totalValue        = 0
  let wonThisMonth      = 0
  let totalWon          = 0
  let loadError: string | null = null

  try {
    const d = await getPipelineData()
    deals        = d.deals
    openCount    = d.openCount
    totalValue   = d.totalValue
    wonThisMonth = d.wonThisMonth
    totalWon     = d.totalWon
  } catch (e) {
    loadError = (e as Error).message
  }

  return (
    <>
      <Header title="Sales & CRM" subtitle="Pipeline · AutoHive CRM · Live · Supabase" />
      <main className="flex-1 p-6 space-y-6">

        {/* KPI stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Open Pipeline"
            value={loadError ? '—' : fmtZAR(totalValue)}
            change={loadError ? undefined : `${openCount} deals`}
            changePositive
            icon={TrendingUp}
            iconBg="bg-orange-50"
            iconColor="text-orange-500"
          />
          <StatCard
            title="Won This Month"
            value={loadError ? '—' : String(wonThisMonth)}
            icon={Target}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title="Total Won (All Time)"
            value={loadError ? '—' : String(totalWon)}
            icon={UserCheck}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Renewals Due (30d)"
            value="—"
            change="View in CRM"
            changePositive={false}
            icon={RefreshCw}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
          />
        </div>

        {/* CRM action buttons */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            CRM Functions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {ACTIONS.map(({ label, icon: Icon, desc, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-cnc-red/10 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-orange-500 group-hover:text-cnc-red transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-semibold text-cnc-black">{label}</p>
                  <p className="text-xs text-cnc-gray-400 mt-0.5">{desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cnc-gray-300 group-hover:text-cnc-red flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* Connected Apps */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Connected Apps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {apps.map(({ name, abbr, color, href, desc }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0 text-white text-xs font-heading font-bold`}>
                  {abbr}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-heading font-semibold text-cnc-black flex items-center gap-1.5">
                    {name}
                    <ExternalLink className="w-3.5 h-3.5 text-cnc-gray-300 group-hover:text-cnc-red transition-colors" />
                  </p>
                  <p className="text-xs text-cnc-gray-400 mt-0.5 truncate">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Error state */}
        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-semibold mb-1">Could not load pipeline data</p>
            <p className="text-red-500 text-xs">{loadError}</p>
          </div>
        )}

        {/* Live pipeline table */}
        {!loadError && (
          <section>
            <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
              Active Pipeline — showing {deals.length} of {openCount} open deals
            </h3>
            <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cnc-gray-50">
                    {['Company / Contact', 'Source', 'Value', 'Stage', 'Owner', 'Created'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, i) => (
                    <tr
                      key={deal.autohive_opportunity_id ?? i}
                      className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-cnc-black">
                          {deal.company_name || deal.canonical_name || '—'}
                        </p>
                        {deal.contact_email && (
                          <p className="text-xs text-cnc-gray-400 mt-0.5">{deal.contact_email}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-cnc-gray-500">{deal.source || '—'}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-cnc-black">
                        {deal.monetary_value ? fmtZAR(deal.monetary_value) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            STAGE_COLORS[deal.stage_name ?? ''] ?? 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {deal.stage_name || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-cnc-gray-500">
                        {OWNER_NAMES[deal.autohive_assigned_to ?? ''] || deal.autohive_assigned_to || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-cnc-gray-500 whitespace-nowrap">
                        {fmtDate(deal.autohive_created_at)}
                      </td>
                    </tr>
                  ))}
                  {deals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-sm text-cnc-gray-400">
                        No open deals in Supabase. Run Make.com scenario 5276329 to sync.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </>
  )
}

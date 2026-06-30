import type { Metadata } from 'next'
import { TrendingUp, UserCheck, RefreshCw, Target, ExternalLink } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'

export const metadata: Metadata = { title: 'Sales & CRM' }

const salesStats = [
  { title: 'Open Pipeline', value: 'R 380K', change: '18 deals', changePositive: true, icon: TrendingUp, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  { title: 'Won This Month', value: '4', change: '+R 142K', changePositive: true, icon: Target, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  { title: 'Active Clients', value: '124', icon: UserCheck, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { title: 'Renewals Due (30d)', value: '7', change: '3 high risk', changePositive: false, icon: RefreshCw, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
]

// Connected app launch widgets
const apps = [
  { name: 'AutoHive CRM', abbr: 'AH',  color: 'bg-orange-500',  href: 'https://app.autohivetech.co.za/',     desc: 'Pipeline, contacts & opportunities' },
  { name: 'MCO Login',    abbr: 'MCO', color: 'bg-blue-600',    href: 'https://app.mycliniconline.co.za/login', desc: 'MyClinicOnline clinical system' },
  { name: 'ApprovalMax',  abbr: 'AM',  color: 'bg-emerald-600', href: 'https://app.approvalmax.com/login',   desc: 'Purchase & invoice approvals' },
  { name: 'Xero',         abbr: 'XR',  color: 'bg-sky-500',     href: 'https://login.xero.com/',             desc: 'Accounting, invoices & debtors' },
]

const pipeline = [
  { company: 'Glencore Coal (Pty) Ltd', industry: 'Mining', value: 'R 86,400', stage: 'Proposal', owner: 'Annemarie' },
  { company: 'Group Five Construction', industry: 'Construction', value: 'R 54,200', stage: 'Negotiation', owner: 'Celeste' },
  { company: 'Toyota SA Manufacturing', industry: 'Manufacturing', value: 'R 128,000', stage: 'Closing', owner: 'Maryna' },
  { company: 'Sappi Southern Africa', industry: 'Manufacturing', value: 'R 38,800', stage: 'Qualification', owner: 'Gladys' },
  { company: 'Tongaat Hulett Sugar', industry: 'Agriculture', value: 'R 72,600', stage: 'Proposal', owner: 'Elsie' },
]

const stageColors: Record<string, string> = {
  Qualification: 'bg-gray-100 text-gray-600',
  Proposal: 'bg-blue-50 text-blue-700',
  Negotiation: 'bg-orange-50 text-orange-700',
  Closing: 'bg-green-50 text-green-700',
}

export default function SalesPage() {
  return (
    <>
      <Header title="Sales & CRM" subtitle="Pipeline · AutoHive CRM · Mining · Construction · Manufacturing" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {salesStats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

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
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all text-left group"
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

        {/* Pipeline */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Active Pipeline
          </h3>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cnc-gray-50">
                  {['Company', 'Industry', 'Value', 'Stage', 'Owner'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pipeline.map((deal, i) => (
                  <tr key={i} className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-cnc-black">{deal.company}</td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500">{deal.industry}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-cnc-black">{deal.value}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColors[deal.stage] ?? 'bg-gray-50 text-gray-600'}`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500">{deal.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-cnc-gray-50 border border-cnc-gray-200 rounded-xl p-4 text-sm text-cnc-gray-500">
          <p className="font-semibold text-cnc-gray-700 mb-1">Module in development</p>
          <p>Full AutoHive CRM integration, pipeline management (SK-041), 60-Second Sales Engine (SK-134), and SLA builder (SK-121) are being built.</p>
        </div>
      </main>
    </>
  )
}

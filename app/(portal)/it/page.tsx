import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'IT & AI · CNC Portal' }

const CNC_RED = '#ED1B24'

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

const systems = [
  { name: 'Supabase (CNIH)',    role: 'Database / Auth',     status: 'Operational' },
  { name: 'Make.com',           role: 'Automation Hub',      status: 'Operational' },
  { name: 'Telnyx',             role: 'Voice / SMS',         status: 'Operational' },
  { name: 'ElevenLabs',         role: 'Voice AI',            status: 'Operational' },
  { name: 'Xero',               role: 'Accounting',          status: 'Operational' },
  { name: 'Ghost CMS',          role: 'Content Platform',    status: 'Operational' },
  { name: 'AutoHive CRM',       role: 'CRM / Marketing',     status: 'Operational' },
  { name: 'CNC Portal',         role: 'Internal Portal',     status: 'Operational' },
]

const makeRuns = [
  { scenario: 'Invoice → Xero',             runs: 847,  last: '23 Jun 2026' },
  { scenario: 'Lead → AutoHive CRM',        runs: 312,  last: '24 Jun 2026' },
  { scenario: 'FICA Expiry Monitor',        runs: 91,   last: '24 Jun 2026' },
  { scenario: 'OHN Report → Supabase',      runs: 463,  last: '24 Jun 2026' },
  { scenario: 'WhatsApp → Sr Thandi Alert', runs: 134,  last: '24 Jun 2026' },
]

const agents = [
  { id: 'A01', name: 'SOVEREIGN',        role: 'Master Director Agent',         status: 'Active'    },
  { id: 'A02', name: 'JURY',             role: 'Governance & Compliance',        status: 'Active'    },
  { id: 'A06', name: 'MEDICUS.PROTOCOL', role: 'Clinical Standards',             status: 'Active'    },
  { id: 'A11', name: 'VAULT.LEDGER',     role: 'Finance & Xero Integration',     status: 'Active'    },
  { id: 'A14', name: 'SPARK',            role: 'Sales Intelligence',             status: 'Active'    },
  { id: 'A19', name: 'NEXUS',            role: 'Onboarding & Operations',        status: 'Active'    },
  { id: 'A21', name: 'TERRA',            role: 'Mobile Fleet Intelligence',      status: 'Building'  },
  { id: 'A22', name: 'SENTINEL',         role: 'Security & Threat Monitoring',   status: 'Building'  },
]

const agentStatusStyle: Record<string, string> = {
  Active:   'bg-green-50 text-green-700',
  Building: 'bg-yellow-50 text-yellow-700',
  Planned:  'bg-gray-100 text-gray-500',
}

export default function ItPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">IT & AI</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">Systems · Automation · Agent Roster · Support</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="🤖" value="22"    label="AI Agents"          badge="6 live"         badgeColor="#16a34a" />
        <KpiCard icon="⚡" value="1 847" label="Make.com Runs MTD"  badge="↑ 12% vs May"   badgeColor="#16a34a" />
        <KpiCard icon="🔗" value="8"     label="Systems Connected"  badge="All operational" badgeColor="#16a34a" />
        <KpiCard icon="🎫" value="4"     label="Open IT Tickets"    badge="1 urgent"        badgeColor={CNC_RED} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="SYSTEMS HEALTH" />
          <div className="grid grid-cols-2 gap-0 divide-y divide-gray-50">
            {systems.map((s, i) => (
              <div key={i} className={`px-5 py-3.5 flex items-center justify-between ${i % 2 === 0 ? '' : 'border-l border-gray-50'}`}>
                <div>
                  <p className="text-sm font-bold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.role}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="MAKE.COM RUNS MTD" />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Scenario', 'Runs', 'Last Run'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {makeRuns.map((m, i) => (
                <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-700">{m.scenario}</td>
                  <td className="px-5 py-3 text-sm font-black text-gray-900">{m.runs.toLocaleString()}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">{m.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="AGENT ROSTER — A01 TO A22" action={
            <span className="text-xs text-gray-400">Foundation Layer V05</span>
          } />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['ID', 'Agent', 'Role', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agents.map((a, i) => (
                <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-xs font-black text-gray-400">{a.id}</td>
                  <td className="px-5 py-3 text-sm font-black text-gray-900">{a.name}</td>
                  <td className="px-5 py-3 text-xs text-gray-600">{a.role}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${agentStatusStyle[a.status]}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="QUICK ACTIONS" />
          <div className="px-5 py-4 space-y-2">
            {[
              'View All 22 Agents',
              'Open Make.com Console',
              'Log IT Support Ticket',
              'Review API Keys',
              'Access Supabase Studio',
              'Check Telnyx Status',
            ].map(a => (
              <button key={a} className="w-full text-left text-xs font-bold text-gray-700 py-2 px-3 bg-gray-50 hover:bg-red-50 hover:text-red-700 transition-colors rounded-sm">
                → {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

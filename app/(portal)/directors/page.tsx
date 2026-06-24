import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'Directors · CNC Portal' }

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

const signOffQueue = [
  { item: 'Q2 Board Pack',           category: 'Governance', due: '28 Jun 2026', action: true  },
  { item: 'Risk Register Update',    category: 'Compliance', due: '30 Jun 2026', action: true  },
  { item: 'SARS ITA88 Response',     category: 'SARS',       due: '30 Jun 2026', action: false },
  { item: 'EE Plan 2026/27',         category: 'HR',         due: '15 Jul 2026', action: false },
  { item: 'Q1 Financial Statements', category: 'Finance',    due: '31 Jul 2026', action: false },
]

const initiatives = [
  { name: 'Mobile Fleet Expansion',  progress: 65, target: 'Q3 2026' },
  { name: 'Revenue R93.3M Target',   progress: 24, target: 'Dec 2026' },
  { name: 'POPIA Compliance',        progress: 88, target: 'Jul 2026' },
  { name: 'AI Agent Rollout (22)',   progress: 42, target: 'Q4 2026' },
  { name: 'ISO 45001 Certification', progress: 18, target: 'Mar 2027' },
]

export default function DirectorsPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">DIRECTORS</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">Board · Strategy · Sign-Off · Executive Overview</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="📈" value="R 4.8M"  label="YTD Revenue"        badge="+14.2% vs prior yr" badgeColor="#16a34a" />
        <KpiCard icon="🤝" value="31"       label="Active Contracts"   badge="2 up for renewal"   badgeColor="#d97706" />
        <KpiCard icon="👥" value="47"       label="Total Headcount"    badge="3 open positions"   badgeColor="#d97706" />
        <KpiCard icon="💹" value="21.3%"    label="EBITDA Margin"      badge="Target: 22%"        badgeColor="#16a34a" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="SIGN-OFF QUEUE" action={
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-700">2 action required</span>
          } />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Item', 'Category', 'Due', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {signOffQueue.map((s, i) => (
                <tr key={i} className={`cursor-pointer transition-colors ${s.action ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">{s.item}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{s.category}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">{s.due}</td>
                  <td className="px-5 py-3">
                    {s.action
                      ? <button className="text-xs font-black text-white px-3 py-1" style={{ background: CNC_RED }}>Sign Off</button>
                      : <span className="text-xs text-gray-400">Pending review</span>
                    }
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
              'View Board Pack',
              'Review Risk Register',
              'Access CIPC Filing Hub',
              'Check SARS Correspondence',
              'View Compliance Calendar',
              'Download Financial Reports',
            ].map(a => (
              <button key={a} className="w-full text-left text-xs font-bold text-gray-700 py-2 px-3 bg-gray-50 hover:bg-red-50 hover:text-red-700 transition-colors rounded-sm">
                → {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mb-8">
        <CardHeader title="STRATEGIC INITIATIVES" />
        <div className="px-6 py-5 grid grid-cols-1 gap-5">
          {initiatives.map((init, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-gray-800">{init.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Target: {init.target}</span>
                  <span className="text-sm font-black text-gray-900">{init.progress}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${init.progress}%`, background: init.progress >= 75 ? '#16a34a' : init.progress >= 40 ? CNC_RED : '#d97706' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

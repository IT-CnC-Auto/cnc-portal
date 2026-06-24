import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'Corporate Governance · CNC Portal' }

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

const complianceCalendar = [
  { event: 'VAT201 Submission',   body: 'SARS',                  due: '30 Jun 2026', daysLeft: 6,   urgent: true  },
  { event: 'EE Report',           body: 'DoEL',                  due: '15 Jul 2026', daysLeft: 21,  urgent: true  },
  { event: 'WSP/ATR Submission',  body: 'SETA',                  due: '30 Jun 2026', daysLeft: 6,   urgent: true  },
  { event: 'B-BBEE Verification', body: 'SANAS',                 due: '31 Aug 2026', daysLeft: 68,  urgent: false },
  { event: 'FICA Re-verify',      body: 'Internal',              due: '15 Sep 2026', daysLeft: 83,  urgent: false },
  { event: 'COIDA Return',        body: 'Compensation Fund',     due: '31 Mar 2027', daysLeft: 280, urgent: false },
]

const riskRegister = [
  { risk: 'POPIA data breach',        category: 'Privacy',    inherent: 'High',   residual: 'Low'    },
  { risk: 'HPCSA non-compliance',     category: 'Regulatory', inherent: 'High',   residual: 'Low'    },
  { risk: 'Key-person dependency',    category: 'Operational',inherent: 'Medium', residual: 'Medium' },
  { risk: 'Contract non-renewal',     category: 'Commercial', inherent: 'Medium', residual: 'Medium' },
  { risk: 'Cybersecurity incident',   category: 'IT',         inherent: 'Medium', residual: 'Low'    },
]

const ficaRegistry = [
  { client: 'Harmony Mining Ltd',       status: 'Expired',   expires: '01 Mar 2026', action: true  },
  { client: 'BuildRight Construction',  status: 'Valid',     expires: '15 Dec 2026', action: false },
  { client: 'Impala Platinum Holdings', status: 'Due Soon',  expires: '30 Jul 2026', action: true  },
]

const riskColor: Record<string, string> = {
  High:   'bg-red-50 text-red-700',
  Medium: 'bg-yellow-50 text-yellow-700',
  Low:    'bg-green-50 text-green-700',
}

const ficaColor: Record<string, string> = {
  Valid:    'bg-green-50 text-green-700',
  Expired:  'bg-red-50 text-red-700',
  'Due Soon': 'bg-yellow-50 text-yellow-700',
}

export default function GovernancePage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">CORPORATE GOVERNANCE</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">POPIA · FICA · Risk · Compliance Calendar</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="🛡️" value="94%"  label="POPIA Compliance"     badge="Target: 100%"     badgeColor="#d97706" />
        <KpiCard icon="📁" value="1"    label="FICA Docs Expired"    badge="Action required"  badgeColor={CNC_RED} />
        <KpiCard icon="⚠️" value="5"    label="Open Risk Items"      badge="2 high priority"  badgeColor={CNC_RED} />
        <KpiCard icon="📅" value="3"    label="Jun Compliance Events" badge="3 urgent"        badgeColor={CNC_RED} />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="COMPLIANCE CALENDAR" />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Event', 'Regulatory Body', 'Due Date', 'Days Left'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {complianceCalendar.map((c, i) => (
                <tr key={i} className={`cursor-pointer transition-colors ${c.urgent ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">{c.event}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{c.body}</td>
                  <td className="px-5 py-3 text-xs text-gray-600">{c.due}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-black px-2 py-1 rounded-full ${c.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.daysLeft}d
                    </span>
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
              'Submit POPIA Report',
              'Update Information Officer Details',
              'Log POPIA Incident',
              'Request FICA Documents',
              'Update Risk Register',
              'View FICA Registry',
              'Check B-BBEE Score',
              'Generate Compliance Report',
            ].map(a => (
              <button key={a} className="w-full text-left text-xs font-bold text-gray-700 py-2 px-3 bg-gray-50 hover:bg-red-50 hover:text-red-700 transition-colors rounded-sm">
                → {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="RISK REGISTER" />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Risk', 'Category', 'Inherent', 'Residual'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {riskRegister.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">{r.risk}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{r.category}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColor[r.inherent]}`}>{r.inherent}</span></td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColor[r.residual]}`}>{r.residual}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="FICA REGISTRY — KEY CLIENTS" action={
            <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background: CNC_RED }}>Request Docs</button>
          } />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Client', 'Status', 'Expiry', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ficaRegistry.map((f, i) => (
                <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">{f.client}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${ficaColor[f.status]}`}>{f.status}</span></td>
                  <td className="px-5 py-3 text-xs text-gray-400">{f.expires}</td>
                  <td className="px-5 py-3">
                    {f.action && (
                      <button className="text-xs font-bold text-white px-2 py-1" style={{ background: CNC_RED }}>Renew</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'Operations · CNC Portal' }

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

const clinics = [
  { name: 'Highveld Fixed Clinic',  location: 'Witbank, MP',     ohn: 'Sr T. Mthembu', nextVisit: '26 Jun 2026', status: 'Active' },
  { name: 'East Rand Fixed Clinic', location: 'Brakpan, GP',     ohn: 'Sr N. Dlamini', nextVisit: '27 Jun 2026', status: 'Active' },
  { name: 'West Rand Fixed Clinic', location: 'Krugersdorp, GP', ohn: 'Sr M. Sithole', nextVisit: '30 Jun 2026', status: 'Active' },
]

const mobileUnits = [
  { unit: 'MU-01', driver: 'D. Nkosi',    area: 'Middelburg – Mining Belt',  clients: 3, tests: 47, status: 'Deployed'    },
  { unit: 'MU-02', driver: 'P. van Wyk',  area: 'Secunda Industrial Park',   clients: 2, tests: 31, status: 'Deployed'    },
  { unit: 'MU-03', driver: 'S. Mokoena',  area: 'Rustenburg Platinum Belt',  clients: 4, tests: 62, status: 'Deployed'    },
  { unit: 'MU-04', driver: 'T. Fourie',   area: 'Richards Bay Harbour Zone', clients: 2, tests: 28, status: 'Deployed'    },
  { unit: 'MU-05', driver: 'K. Mahlangu', area: 'Vanderbijlpark Steel Zone', clients: 3, tests: 39, status: 'Deployed'    },
  { unit: 'MU-06', driver: 'L. Pieterse', area: 'Carletonville Gold Field',  clients: 2, tests: 22, status: 'Maintenance' },
  { unit: 'MU-07', driver: 'B. Sithole',  area: 'Limpopo Chrome Belt',       clients: 3, tests: 41, status: 'Deployed'    },
]

const unitStatusStyle: Record<string, string> = {
  Deployed:    'bg-green-50 text-green-700',
  Maintenance: 'bg-yellow-50 text-yellow-700',
  Inactive:    'bg-gray-100 text-gray-500',
}

export default function OperationsPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">OPERATIONS</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">Fixed Clinics · Mobile Units · Scheduling · Equipment</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="🏥" value="3"   label="Fixed Clinics"   badge="All active"     badgeColor="#16a34a" />
        <KpiCard icon="🚐" value="7"   label="Mobile Units"    badge="6 deployed"     badgeColor="#16a34a" />
        <KpiCard icon="🩺" value="270" label="Tests Today"     badge="↑ vs yesterday" badgeColor="#16a34a" />
        <KpiCard icon="📋" value="8"   label="Reports Pending" badge="3 overdue"      badgeColor={CNC_RED} />
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <CardHeader
          title="FIXED CLINICS"
          action={
            <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background: CNC_RED }}>
              + Schedule Visit
            </button>
          }
        />
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {['Clinic', 'Location', 'OHN', 'Next Visit', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clinics.map((c, i) => (
              <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-gray-800">{c.name}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{c.location}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{c.ohn}</td>
                <td className="px-5 py-3 text-xs text-gray-400">{c.nextVisit}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader
            title="MOBILE UNITS — CURRENT DEPLOYMENT"
            action={
              <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background: CNC_RED }}>
                + New Deployment
              </button>
            }
          />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Unit', 'Driver', 'Area', 'Clients', 'Tests', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mobileUnits.map((u, i) => (
                <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-gray-800">{u.unit}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{u.driver}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{u.area}</td>
                  <td className="px-5 py-3 text-sm text-center font-semibold text-gray-700">{u.clients}</td>
                  <td className="px-5 py-3 text-sm text-center font-black text-gray-900">{u.tests}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${unitStatusStyle[u.status]}`}>{u.status}</span>
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
              'Schedule Mobile Unit',
              'Log Clinic Incident',
              'Generate Shift Report',
              'Request Consumable Supplies',
              'View Equipment Register',
              'Submit IOD Form',
              'Book OH Nurse Practitioner',
              'Download Compliance Checklist',
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

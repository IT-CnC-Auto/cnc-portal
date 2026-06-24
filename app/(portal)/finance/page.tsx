import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'Finance · CNC Portal' }

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

const invoices = [
  { number: 'INV-2094', client: 'Harmony Mining Ltd',       amount: 'R 48 000', date: '05 Jun 2026', status: 'Paid'    },
  { number: 'INV-2093', client: 'BuildRight Construction',  amount: 'R 22 000', date: '04 Jun 2026', status: 'Pending' },
  { number: 'INV-2092', client: 'Impala Platinum Holdings', amount: 'R 67 500', date: '03 Jun 2026', status: 'Paid'    },
  { number: 'INV-2091', client: 'Agri-Fresh Packers',       amount: 'R 31 500', date: '02 Jun 2026', status: 'Overdue' },
  { number: 'INV-2090', client: 'SA Steel Manufacturing',   amount: 'R 17 000', date: '01 Jun 2026', status: 'Pending' },
]

const taxCalendar = [
  { item: 'VAT201 Submission',     due: '30 Jun 2026', daysLeft: 6,   urgent: true  },
  { item: 'EMP201 Monthly',        due: '07 Jul 2026', daysLeft: 13,  urgent: false },
  { item: 'Provisional Tax',       due: '31 Aug 2026', daysLeft: 68,  urgent: false },
  { item: 'EMP501 Reconciliation', due: '31 Oct 2026', daysLeft: 129, urgent: false },
]

const statusStyle: Record<string, string> = {
  Paid:    'bg-green-50 text-green-700',
  Pending: 'bg-yellow-50 text-yellow-700',
  Overdue: 'bg-red-50 text-red-700',
}

export default function FinancePage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 rounded-full" style={{ background: CNC_RED }} />
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">FINANCE</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">Invoicing · Tax · Budget · Reporting</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard icon="💰" value="R 1.23M" label="Monthly Revenue"      badge="+12.4%"          badgeColor="#16a34a" />
        <KpiCard icon="📄" value="R 186K"  label="Outstanding Invoices" badge="3 overdue"        badgeColor={CNC_RED} />
        <KpiCard icon="📉" value="R 412K"  label="MTD Expenses"         badge="-2.1% vs budget"  badgeColor="#16a34a" />
        <KpiCard icon="🏦" value="R 847K"  label="Cash Position"        badge="Healthy"          badgeColor="#16a34a" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader
            title="RECENT INVOICES"
            action={
              <button className="text-xs font-bold uppercase tracking-wide text-white px-3 py-1.5" style={{ background: CNC_RED }}>
                + New Invoice
              </button>
            }
          />
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Invoice', 'Client', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv, i) => (
                <tr key={i} className="hover:bg-red-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-gray-800">{inv.number}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{inv.client}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">{inv.amount}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">{inv.date}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle[inv.status]}`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader title="TAX CALENDAR" />
          <div className="divide-y divide-gray-50">
            {taxCalendar.map((t, i) => (
              <div key={i} className="px-5 py-4 hover:bg-red-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{t.item}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Due: {t.due}</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${t.urgent ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                    {t.daysLeft}d
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, (180 - t.daysLeft) / 180 * 100)}%`, background: t.urgent ? CNC_RED : '#86efac' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-4 rounded-full" style={{ background: CNC_RED }} />
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">QUICK ACTIONS</h3>
            </div>
            <div className="space-y-2">
              {['Generate VAT201', 'Run Payroll', 'Export Management Accounts', 'Download IRP5s'].map(a => (
                <button key={a} className="w-full text-left text-xs font-bold text-gray-700 py-2 px-3 bg-gray-50 hover:bg-red-50 hover:text-red-700 transition-colors rounded-sm">
                  → {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { DollarSign, FileText, Receipt, TrendingUp, PieChart, AlertTriangle, Calculator } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'

export const metadata: Metadata = { title: 'Finance' }

const financeStats = [
  { title: 'Monthly Revenue', value: 'R 1.23M', change: '+12.4%', changePositive: true, icon: DollarSign, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  { title: 'Outstanding Invoices', value: 'R 284K', change: '14 unpaid', changePositive: false, icon: FileText, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  { title: 'VAT Liability (Apr)', value: 'R 56.2K', icon: Receipt, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { title: 'Invoices This Month', value: '342', change: '+28', changePositive: true, icon: TrendingUp, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
]

const actions = [
  { label: 'Generate Invoice', icon: FileText, desc: 'SK-060 · Per-test, package, mobile, tender', color: 'green' },
  { label: 'VAT Returns', icon: Receipt, desc: 'SK-064 · VAT201 monthly submission', color: 'blue' },
  { label: 'Financial Reports', icon: TrendingUp, desc: 'SK-063 · Management accounts, P&L, cash flow', color: 'purple' },
  { label: 'Budget Tracker', icon: PieChart, desc: 'SK-062 · Variance analysis, traffic-light', color: 'orange' },
  { label: 'Tax Compliance', icon: Calculator, desc: 'SK-064 · EMP201, IRP5, IT14, SARS calendar', color: 'indigo' },
  { label: 'Commission Calc', icon: DollarSign, desc: 'SK-113 · Tiered commissions, clawbacks', color: 'red' },
]

const colorMap: Record<string, { bg: string; icon: string }> = {
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
  red: { bg: 'bg-cnc-red/10', icon: 'text-cnc-red' },
}

const recentInvoices = [
  { ref: 'INV-2094', client: 'Harmony Mining Ltd', amount: 'R 84,320', date: '02/06/2026', status: 'sent' },
  { ref: 'INV-2093', client: 'Impala Platinum', amount: 'R 127,450', date: '01/06/2026', status: 'paid' },
  { ref: 'INV-2092', client: 'Murray & Roberts', amount: 'R 43,200', date: '31/05/2026', status: 'paid' },
  { ref: 'INV-2091', client: 'Anglo American', amount: 'R 218,900', date: '30/05/2026', status: 'overdue' },
]

const invoiceStatus: Record<string, string> = {
  sent: 'bg-blue-50 text-blue-700',
  paid: 'bg-green-50 text-green-700',
  overdue: 'bg-cnc-red/10 text-cnc-red',
}

export default function FinancePage() {
  return (
    <>
      <Header title="Finance" subtitle="Invoicing · SARS compliance · King IV Principle 11" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {financeStats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* SARS Alert */}
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">VAT201 due 30/06/2026</span> · EMP201 due 07/06/2026 · 
            Provisional tax (IRP6) due 31/08/2026
          </p>
        </div>

        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Finance Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map(({ label, icon: Icon, desc, color }) => {
              const c = colorMap[color]
              return (
                <button
                  key={label}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-semibold text-cnc-black">{label}</p>
                    <p className="text-xs text-cnc-gray-400 mt-0.5">{desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Recent Invoices */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Recent Invoices
          </h3>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cnc-gray-50">
                  {['Reference', 'Client', 'Amount (ZAR)', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv, i) => (
                  <tr key={i} className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono font-medium text-cnc-black">{inv.ref}</td>
                    <td className="px-5 py-3 text-sm text-cnc-black">{inv.client}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-cnc-black">{inv.amount}</td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-400">{inv.date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${invoiceStatus[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-cnc-gray-50 border border-cnc-gray-200 rounded-xl p-4 text-sm text-cnc-gray-500">
          <p className="font-semibold text-cnc-gray-700 mb-1">Module in development</p>
          <p>Full invoice generation (SK-060), Xero integration, management accounts (SK-063), and automated SARS submission calendar (SK-064) are being built.</p>
        </div>
      </main>
    </>
  )
}

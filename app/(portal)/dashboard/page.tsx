import type { Metadata } from 'next'
import {
  HeartPulse,
  Users,
  DollarSign,
  TrendingUp,
  ClipboardCheck,
  AlertCircle,
  Activity,
  Settings,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'

export const metadata: Metadata = { title: 'Dashboard' }

const kpis = [
  {
    title: 'Medical Tests This Month',
    value: '5,842',
    change: '+8.2%',
    changePositive: true,
    icon: HeartPulse,
    iconBg: 'bg-cnc-red/10',
    iconColor: 'text-cnc-red',
  },
  {
    title: 'Active Clients',
    value: '124',
    change: '+3 new',
    changePositive: true,
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Monthly Revenue',
    value: 'R 1.23M',
    change: '+12.4%',
    changePositive: true,
    icon: DollarSign,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    title: 'Open Sales Pipeline',
    value: 'R 380K',
    change: '-4 deals',
    changePositive: false,
    icon: TrendingUp,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    title: 'Staff Headcount',
    value: '47',
    change: '+2 this month',
    changePositive: true,
    icon: Users,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Pending Approvals',
    value: '12',
    change: '3 urgent',
    changePositive: false,
    icon: ClipboardCheck,
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
]

const recentActivity = [
  {
    action: 'Invoice #INV-2094 issued to Harmony Mining',
    module: 'Finance',
    time: '2 min ago',
    status: 'completed',
  },
  {
    action: 'New client onboarded: Impala Platinum Holdings',
    module: 'Sales',
    time: '18 min ago',
    status: 'completed',
  },
  {
    action: 'Leave request: Nurse T. Mokoena (3 days)',
    module: 'Staff',
    time: '1 hr ago',
    status: 'pending',
  },
  {
    action: 'Mobile unit deployed: Rustenburg Site 4',
    module: 'Operations',
    time: '2 hr ago',
    status: 'active',
  },
  {
    action: 'Spirometry SOP updated — v3.1 approved',
    module: 'Admin',
    time: '3 hr ago',
    status: 'completed',
  },
  {
    action: 'VAT201 return submitted — April 2026',
    module: 'Finance',
    time: '5 hr ago',
    status: 'completed',
  },
]

const statusStyles: Record<string, string> = {
  completed: 'bg-green-50 text-green-700',
  pending: 'bg-yellow-50 text-yellow-700',
  active: 'bg-blue-50 text-blue-700',
}

const modules = [
  { href: '/staff', label: 'Staff & HR', icon: Users },
  { href: '/finance', label: 'Finance', icon: DollarSign },
  { href: '/sales', label: 'Sales & CRM', icon: TrendingUp },
  { href: '/operations', label: 'Operations', icon: Activity },
  { href: '/admin', label: 'Admin', icon: Settings },
]

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Header title="Dashboard" subtitle={today} />
      <main className="flex-1 p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-cnc-red rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <HeartPulse className="w-full h-full" />
          </div>
          <div className="relative">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
              Welcome back
            </p>
            <h2 className="text-2xl font-heading font-bold">
              Care Net Consultants Portal
            </h2>
            <p className="text-white/70 text-sm mt-1.5">
              4 fixed clinics · National mobile units · 5,000+ medical tests/month
            </p>
          </div>
        </div>

        {/* KPIs */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Key Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <StatCard key={kpi.title} {...kpi} />
            ))}
          </div>
        </section>

        {/* Module Quick Access */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {modules.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all group"
              >
                <Icon className="w-6 h-6 text-cnc-gray-300 group-hover:text-cnc-red transition-colors" />
                <span className="text-xs font-heading font-semibold text-cnc-gray-500 group-hover:text-cnc-black transition-colors text-center leading-tight">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Alerts */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-yellow-800">3 items need attention: </span>
            <span className="text-yellow-700">
              Leave approval pending · VAT201 due in 8 days · 1 SLA breach risk (Glencore site)
            </span>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Recent Activity
          </h3>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cnc-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                    Action
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide hidden sm:table-cell">
                    Module
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Time
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-sm text-cnc-black">{item.action}</td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-xs text-cnc-gray-400">{item.module}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-xs text-cnc-gray-300">{item.time}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="px-6 py-3 border-t border-cnc-gray-100 text-center">
        <p className="text-xs text-cnc-gray-300">
          Care Net Consultants (Pty) Ltd · POPIA Act 4 of 2013 · Confidential — Internal Use Only
        </p>
      </footer>
    </>
  )
}

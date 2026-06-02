import type { Metadata } from 'next'
import { Users, UserPlus, Calendar, ClipboardList, Award, Shield, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'

export const metadata: Metadata = { title: 'Staff & HR' }

const staffStats = [
  { title: 'Total Staff', value: '47', icon: Users, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { title: 'On Leave Today', value: '3', icon: Calendar, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { title: 'Open Vacancies', value: '1', icon: UserPlus, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  { title: 'EE Compliance', value: '100%', icon: Shield, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
]

const quickActions = [
  { label: 'Add Employee', icon: UserPlus, desc: 'SK-051 · BCEA-compliant onboarding', color: 'purple' },
  { label: 'Leave Requests', icon: Calendar, desc: '3 pending approvals · BCEA S20', color: 'blue' },
  { label: 'Performance Reviews', icon: ClipboardList, desc: 'SK-052 · Q2 cycle open', color: 'orange' },
  { label: 'Skills Development', icon: Award, desc: 'SK-114 · WSP/ATR tracking', color: 'green' },
  { label: 'Recruitment Pipeline', icon: TrendingUp, desc: 'SK-050 · SANC/HPCSA verified', color: 'indigo' },
  { label: 'Disciplinary Process', icon: Shield, desc: 'SK-054 · LRA Schedule 8', color: 'red' },
]

const colorMap: Record<string, { bg: string; icon: string; hover: string }> = {
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'group-hover:bg-purple-100' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', hover: 'group-hover:bg-blue-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', hover: 'group-hover:bg-orange-100' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', hover: 'group-hover:bg-green-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', hover: 'group-hover:bg-indigo-100' },
  red: { bg: 'bg-cnc-red/10', icon: 'text-cnc-red', hover: 'group-hover:bg-cnc-red/20' },
}

const staff = [
  { name: 'Thandi Mokoena', role: 'OH Nurse Practitioner', clinic: 'Johannesburg', status: 'active' },
  { name: 'Rudi van der Merwe', role: 'Audiometrist', clinic: 'Cape Town', status: 'active' },
  { name: 'Lerato Sithole', role: 'Spirometrist', clinic: 'Mobile Unit 1', status: 'on-leave' },
  { name: 'Priya Naidoo', role: 'OH Administrator', clinic: 'Durban', status: 'active' },
  { name: 'Johannes Botha', role: 'Clinical Manager', clinic: 'Head Office', status: 'active' },
]

export default function StaffPage() {
  return (
    <>
      <Header title="Staff & HR" subtitle="People management · BCEA · LRA · EEA compliant" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {staffStats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* Quick Actions */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            HR Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map(({ label, icon: Icon, desc, color }) => {
              const c = colorMap[color]
              return (
                <button
                  key={label}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all text-left group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg} ${c.hover} transition-colors`}
                  >
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

        {/* Staff Directory */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Staff Directory (Sample)
          </h3>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cnc-gray-50">
                  {['Name', 'Role', 'Clinic / Unit', 'Status'].map((h) => (
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
                {staff.map((s, i) => (
                  <tr
                    key={i}
                    className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-cnc-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-cnc-red text-xs font-bold">
                            {s.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-cnc-black">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500">{s.role}</td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500">{s.clinic}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          s.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {s.status}
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
          <p>
            Full staff management, leave tracking, recruitment pipeline (SK-050), BCEA compliance,
            EE reporting (SK-115), and BEE scorecard (SK-116) are being built in the next sprint.
          </p>
        </div>
      </main>
    </>
  )
}

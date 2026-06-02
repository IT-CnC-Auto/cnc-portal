import type { Metadata } from 'next'
import { Activity, Truck, CalendarDays, ShieldCheck, Package, MapPin, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'

export const metadata: Metadata = { title: 'Operations' }

const opsStats = [
  { title: 'Tests Today', value: '284', change: '+12 vs yesterday', changePositive: true, icon: Activity, iconBg: 'bg-cnc-red/10', iconColor: 'text-cnc-red' },
  { title: 'Active Mobile Units', value: '3 / 5', icon: Truck, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { title: 'Scheduled This Week', value: '1,402', change: '94% capacity', changePositive: true, icon: CalendarDays, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  { title: 'SLA Compliance', value: '98.2%', change: '↑0.4%', changePositive: true, icon: ShieldCheck, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
]

const clinics = [
  { name: 'Johannesburg Clinic', location: 'Sandton, GP', testsToday: 84, capacity: 100, status: 'operational' },
  { name: 'Cape Town Clinic', location: 'Bellville, WC', testsToday: 67, capacity: 80, status: 'operational' },
  { name: 'Durban Clinic', location: 'Westville, KZN', testsToday: 71, capacity: 90, status: 'operational' },
  { name: 'Pretoria Clinic', location: 'Centurion, GP', testsToday: 62, capacity: 75, status: 'operational' },
]

const mobileUnits = [
  { unit: 'Mobile Unit 1', location: 'Rustenburg, NW', client: 'Anglo Platinum', tests: 'Day 2 of 3', status: 'deployed' },
  { unit: 'Mobile Unit 2', location: 'Witbank, MP', client: 'Exxaro Resources', tests: 'Day 1 of 2', status: 'deployed' },
  { unit: 'Mobile Unit 3', location: 'Richards Bay, KZN', client: 'Richards Bay Minerals', tests: 'Day 3 of 4', status: 'deployed' },
]

const actions = [
  { label: 'Clinic Scheduling', icon: CalendarDays, desc: 'SK-082 · Appointment slots, queue management' },
  { label: 'Mobile Unit Dispatch', icon: Truck, desc: 'SK-082 · Route optimisation, deployment planning' },
  { label: 'Quality Assurance', icon: ShieldCheck, desc: 'SK-081 · ISO 45001, accreditation checks' },
  { label: 'Inventory Management', icon: Package, desc: 'SK-084 · Consumables, equipment, reorder alerts' },
]

export default function OperationsPage() {
  return (
    <>
      <Header title="Operations" subtitle="4 fixed clinics · National mobile units · OHS Act 85/1993" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {opsStats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* Actions */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Operations Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {actions.map(({ label, icon: Icon, desc }) => (
              <button
                key={label}
                className="flex flex-col items-start gap-3 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-cnc-red/10 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600 group-hover:text-cnc-red transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-cnc-black">{label}</p>
                  <p className="text-xs text-cnc-gray-400 mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Clinics */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Fixed Clinics — Live Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clinics.map((clinic) => {
              const pct = Math.round((clinic.testsToday / clinic.capacity) * 100)
              return (
                <div key={clinic.name} className="bg-white rounded-xl border border-cnc-gray-100 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 bg-cnc-red/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-cnc-red" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      {clinic.status}
                    </span>
                  </div>
                  <p className="text-sm font-heading font-bold text-cnc-black">{clinic.name}</p>
                  <p className="text-xs text-cnc-gray-400 mb-3">{clinic.location}</p>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-cnc-gray-500">Tests today</span>
                    <span className="font-semibold text-cnc-black">{clinic.testsToday} / {clinic.capacity}</span>
                  </div>
                  <div className="w-full bg-cnc-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-cnc-red h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-cnc-gray-400 mt-1">{pct}% capacity</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Mobile Units */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Mobile Units — Current Deployments
          </h3>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cnc-gray-50">
                  {['Unit', 'Location', 'Client', 'Progress', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mobileUnits.map((u, i) => (
                  <tr key={i} className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-cnc-gray-300" />
                        <span className="text-sm font-medium text-cnc-black">{u.unit}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500">{u.location}</td>
                    <td className="px-5 py-3 text-sm text-cnc-black">{u.client}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-cnc-gray-500">
                        <Clock className="w-3 h-3" />
                        {u.tests}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {u.status}
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
          <p>Full CNIH/MyClinicOnline integration, real-time test tracking, mobile unit GPS dispatch, and OHS Act compliance checklists are being built.</p>
        </div>
      </main>
    </>
  )
}

import type { Metadata } from 'next'
import { Settings, Shield, Users, Database, FileText, Bell, Lock, Eye } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'

export const metadata: Metadata = { title: 'Admin' }

const adminStats = [
  { title: 'Portal Users', value: '14', icon: Users, iconBg: 'bg-cnc-gray-100', iconColor: 'text-cnc-gray-600' },
  { title: 'Active Roles', value: '6', icon: Lock, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { title: 'Audit Log Entries', value: '12,840', icon: Eye, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { title: 'POPIA Compliance', value: '100%', icon: Shield, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
]

const systemActions = [
  { label: 'User Management', icon: Users, desc: 'Portal roles, permissions, and access levels', color: 'gray' },
  { label: 'Security & Access', icon: Shield, desc: 'SK-074 · AES-256 · TLS 1.3 · MFA', color: 'purple' },
  { label: 'Audit Trail', icon: FileText, desc: 'SK-032 · Every action logged with SAST timestamp', color: 'blue' },
  { label: 'POPIA Compliance', icon: Lock, desc: 'SK-030 · Data subject rights · Breach protocols', color: 'green' },
  { label: 'Integrations', icon: Database, desc: 'Supabase · AutoHive · Make.com · ElevenLabs', color: 'indigo' },
  { label: 'Notifications', icon: Bell, desc: 'Alerts, escalations, SARS deadlines, SLA warnings', color: 'orange' },
  { label: 'System Settings', icon: Settings, desc: 'Brand config, legal footer, SK numbering', color: 'gray' },
  { label: 'View Audit Log', icon: Eye, desc: 'SK-032 · Full tamper-evident audit trail', color: 'blue' },
]

const colorMap: Record<string, { bg: string; icon: string }> = {
  gray: { bg: 'bg-cnc-gray-100', icon: 'text-cnc-gray-500' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500' },
  red: { bg: 'bg-cnc-red/10', icon: 'text-cnc-red' },
}

const roles = [
  { name: 'System Administrator', users: 2, access: 'Full system access', level: 'critical' },
  { name: 'Finance Manager', users: 3, access: 'Finance module + reports', level: 'high' },
  { name: 'HR Manager', users: 2, access: 'Staff & HR module', level: 'high' },
  { name: 'Sales Manager', users: 4, access: 'Sales & CRM module', level: 'medium' },
  { name: 'Operations Manager', users: 2, access: 'Operations module', level: 'medium' },
  { name: 'Read Only', users: 1, access: 'Dashboard & reports only', level: 'low' },
]

const levelColors: Record<string, string> = {
  critical: 'bg-cnc-red/10 text-cnc-red',
  high: 'bg-orange-50 text-orange-700',
  medium: 'bg-blue-50 text-blue-700',
  low: 'bg-cnc-gray-100 text-cnc-gray-500',
}

export default function AdminPage() {
  return (
    <>
      <Header title="Admin" subtitle="System settings · POPIA · King IV · Role-based access" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            System Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {systemActions.map(({ label, icon: Icon, desc, color }) => {
              const c = colorMap[color]
              return (
                <button
                  key={label}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-cnc-gray-100 hover:border-cnc-red hover:shadow-cnc-sm transition-all text-left group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${c.bg}`}>
                    <Icon className={`w-4 h-4 ${c.icon}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-heading font-semibold text-cnc-black">{label}</p>
                    <p className="text-xs text-cnc-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Roles */}
        <section>
          <h3 className="text-xs font-heading font-semibold text-cnc-gray-400 uppercase tracking-widest mb-3">
            Portal Roles
          </h3>
          <div className="bg-white rounded-xl border border-cnc-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cnc-gray-50">
                  {['Role', 'Users', 'Access Scope', 'Level'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-cnc-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role, i) => (
                  <tr key={i} className="border-b border-cnc-gray-50 last:border-0 hover:bg-cnc-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-cnc-black">{role.name}</td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500">{role.users}</td>
                    <td className="px-5 py-3 text-sm text-cnc-gray-500">{role.access}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColors[role.level]}`}>
                        {role.level}
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
          <p>Full RBAC with Supabase RLS, audit trail (SK-032), POPIA compliance dashboard (SK-030), data breach notification workflows, and system-wide settings are being built.</p>
        </div>
      </main>
    </>
  )
}

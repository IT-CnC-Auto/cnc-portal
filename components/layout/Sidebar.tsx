'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  HeartPulse,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & KPIs',
  },
  {
    href: '/staff',
    label: 'Staff & HR',
    icon: Users,
    description: 'People management',
  },
  {
    href: '/finance',
    label: 'Finance',
    icon: DollarSign,
    description: 'Invoicing & reporting',
  },
  {
    href: '/sales',
    label: 'Sales & CRM',
    icon: TrendingUp,
    description: 'Pipeline management',
  },
  {
    href: '/operations',
    label: 'Operations',
    icon: Activity,
    description: 'Clinics & dispatch',
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: Settings,
    description: 'Settings & access',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-cnc-black flex flex-col z-40 select-none">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.08]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-cnc-red rounded-xl flex items-center justify-center flex-shrink-0 shadow-cnc-red group-hover:bg-cnc-red-dark transition-colors">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-heading font-bold text-sm leading-tight">
              Care Net
            </p>
            <p className="text-white/40 text-xs leading-tight">Consultants Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1">
          Modules
        </p>
        {navItems.map(({ href, label, icon: Icon, description }) => {
          const isActive =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-cnc-red text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'
                }`}
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-white/60" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 border-t border-white/[0.08] pt-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-0.5 rounded-xl">
          <div className="w-8 h-8 bg-cnc-red/20 rounded-full flex items-center justify-center flex-shrink-0 border border-cnc-red/30">
            <span className="text-cnc-red text-xs font-heading font-bold">CN</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">Portal Admin</p>
            <p className="text-white/30 text-[11px] truncate">
              carenetconsultants.co.za
            </p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/[0.06] transition-all w-full group">
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-cnc-red transition-colors" />
          Sign Out
        </button>
      </div>

      {/* POPIA brand bar */}
      <div className="px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
        <p className="text-[10px] text-white/20 leading-relaxed">
          POPIA Act 4 of 2013 · Confidential
        </p>
      </div>
    </aside>
  )
}

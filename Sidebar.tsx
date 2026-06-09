'use client'

import { useState } from 'react'
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
  ChevronRight,
  ChevronDown,
  User,
  Sun,
  Moon,
  Monitor,
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

const CNC_LOGO =
  'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'

// NOTE: 'auto' follows the device. Wiring this to actually switch the app
// theme is a follow-up for the back-end owner — for now it sets local UI state.
type ThemeMode = 'light' | 'dark' | 'auto'

export function Sidebar() {
  const pathname = usePathname()
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('light')

  const themeButtons: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { mode: 'light', label: 'Light', Icon: Sun },
    { mode: 'dark', label: 'Dark', Icon: Moon },
    { mode: 'auto', label: 'Auto', Icon: Monitor },
  ]

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-cnc-black flex flex-col z-40 select-none">
      {/* Logo — full-width white strip matching the topbar height */}
      <div className="h-16 bg-white border-b border-cnc-gray-100 flex items-center justify-center px-4 overflow-hidden">
        <Link href="/dashboard" className="flex items-center justify-center w-full h-full py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CNC_LOGO}
            alt="Care Net Consultants"
            className="h-full w-auto max-w-[170px] object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1">
          Modules
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
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
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/60" />}
            </Link>
          )
        })}
      </nav>

      {/* My Profile — collapsible dropdown holding Settings → Appearance */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-all w-full group"
        >
          <User className="w-[18px] h-[18px] flex-shrink-0 text-white/40 group-hover:text-white/80 transition-colors" />
          <span className="flex-1 text-left">My profile</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${
              profileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-200 ${
            profileOpen ? 'max-h-48' : 'max-h-0'
          }`}
        >
          <div className="px-3 pt-2 pb-1">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">
              Settings
            </p>
            <p className="text-[11px] text-white/40 mb-2">Appearance</p>
            <div className="flex border border-white/10 rounded-lg overflow-hidden bg-white/[0.04]">
              {themeButtons.map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  title={label}
                  onClick={() => setTheme(mode)}
                  className={`flex-1 h-9 flex items-center justify-center transition-colors ${
                    theme === mode
                      ? 'bg-cnc-red text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-[15px] h-[15px]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User section */}
      <div className="px-3 pb-4 border-t border-white/[0.08] pt-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-0.5 rounded-xl">
          <div className="w-8 h-8 bg-cnc-red/20 rounded-full flex items-center justify-center flex-shrink-0 border border-cnc-red/30">
            <span className="text-cnc-red text-xs font-heading font-bold">CN</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">Portal Admin</p>
            <p className="text-white/30 text-[11px] truncate">carenetconsultants.co.za</p>
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

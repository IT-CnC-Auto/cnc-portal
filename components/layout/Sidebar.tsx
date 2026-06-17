'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const CNC_LOGO =
  'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'

// ---------- Inline SVG icons (matching Cassandra's icon library) ----------
const Icons = {
  home: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>
    </svg>
  ),
  directors: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>
    </svg>
  ),
  operations: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
      <path d="M19 12a7 7 0 00-.1-1.1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.9-1.1L14.5 2h-5l-.3 2.7a7 7 0 00-1.9 1.1l-2.4-1-2 3.4 2 1.6A7 7 0 005 12a7 7 0 00.1 1.1l-2 1.6 2 3.4 2.4-1c.6.5 1.2.8 1.9 1.1L9.5 22h5l.3-2.7c.7-.3 1.3-.6 1.9-1.1l2.4 1 2-3.4-2-1.6c.1-.4.1-.7.1-1.1z"/>
    </svg>
  ),
  finance: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  sales: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8M21 7v6h-6"/>
    </svg>
  ),
  governance: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M5 7h14M7 7l-3 7a4 4 0 008 0L9 7M17 7l-3 7a4 4 0 008 0l-3-7"/>
    </svg>
  ),
  hr: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>
    </svg>
  ),
  it: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z"/>
    </svg>
  ),
  marketing: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l18-5v12L3 14v-3zM3 11v3M11.6 16.8a3 3 0 11-5.8-1.6"/>
    </svg>
  ),
  admin: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0112 0v1"/>
      <path d="M19 11l2 2-4 4-2-2"/>
    </svg>
  ),
  user: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0112 0v1"/>
    </svg>
  ),
  signout: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  lock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
    </svg>
  ),
  chevronDown: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
}

// ---------- Nav structure ----------
const WORKSPACE = [
  { label: 'Home', icon: 'home', href: '/dashboard', live: true },
]

const DEPARTMENTS = [
  { label: 'Directors',           icon: 'directors',   href: '/directors',   live: false },
  { label: 'Operations',          icon: 'operations',  href: '/operations',  live: true  },
  { label: 'Finance',             icon: 'finance',     href: '/finance',     live: true  },
  { label: 'Sales',               icon: 'sales',       href: '/sales',       live: true  },
  { label: 'Corporate Governance',icon: 'governance',  href: '/governance',  live: false },
  { label: 'HR & People',         icon: 'hr',          href: '/staff',       live: true  },
  { label: 'IT & AI',             icon: 'it',          href: '/it',          live: false },
  { label: 'Marketing',           icon: 'marketing',   href: '/marketing',   live: false },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function nameFromEmail(email: string) {
  return email
    .split('@')[0]
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme]   = useState<'light' | 'dark' | 'auto'>('light')
  const [user, setUser]     = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const displayName = user ? (user.user_metadata?.full_name ?? nameFromEmail(user.email ?? '')) : ''
  const initials    = displayName ? getInitials(displayName) : '?'
  const role        = user?.user_metadata?.role ?? 'Staff'

  function NavItem({
    label, icon, href, live, section,
  }: { label: string; icon: string; href: string; live: boolean; section?: string }) {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))
    if (!live) {
      return (
        <div className="flex items-center gap-3 px-2.5 py-[9px] rounded-md text-[13px] font-medium text-[#666] cursor-not-allowed select-none">
          <span className="w-[17px] h-[17px] flex items-center justify-center flex-none opacity-70">
            {Icons[icon as keyof typeof Icons]}
          </span>
          <span className="flex-1">{label}</span>
          <span className="opacity-40">{Icons.lock}</span>
        </div>
      )
    }
    return (
      <Link
        href={href}
        className={`relative flex items-center gap-3 px-2.5 py-[9px] rounded-md text-[13px] font-medium transition-colors duration-100 ${
          isActive
            ? 'bg-[#1F1F1F] text-white'
            : 'text-[#ccc] hover:bg-[#161616] hover:text-white'
        }`}
      >
        {isActive && (
          <span className="absolute left-[-14px] top-[6px] bottom-[6px] w-[3px] bg-[#ED1B24] rounded-r-[3px]" />
        )}
        <span className={`w-[17px] h-[17px] flex items-center justify-center flex-none transition-opacity ${isActive ? 'opacity-100' : 'opacity-[0.85]'}`}>
          {Icons[icon as keyof typeof Icons]}
        </span>
        <span className="flex-1">{label}</span>
      </Link>
    )
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[248px] bg-black flex flex-col z-40 select-none">
      {/* Brand bar — white strip, same height as topbar */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center h-[62px] bg-white border-b border-[#D2D2D2] px-4 overflow-hidden flex-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CNC_LOGO}
          alt="Care Net Consultants"
          className="h-full w-auto max-w-[180px] object-contain py-2"
        />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3.5 py-0 overflow-y-auto">
        {/* Workspace */}
        <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-[#666] px-2 pt-3.5 pb-1.5">
          Workspace
        </p>
        {WORKSPACE.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        {/* Departments */}
        <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-[#666] px-2 pt-3.5 pb-1.5">
          Departments
        </p>
        {DEPARTMENTS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        {/* Admin — separate at bottom of nav */}
        <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-[#666] px-2 pt-3.5 pb-1.5">
          System
        </p>
        <NavItem label="Admin" icon="admin" href="/admin" live={true} />
      </nav>

      {/* My Profile — collapsible */}
      <div className="px-3.5 pb-2">
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="flex items-center gap-3 px-2.5 py-[9px] rounded-md text-[13px] font-medium text-[#ccc] hover:bg-[#161616] hover:text-white transition-colors w-full"
        >
          <span className="w-[17px] h-[17px] flex items-center justify-center flex-none opacity-[0.85]">
            {Icons.user}
          </span>
          <span className="flex-1 text-left">My profile</span>
          <span className={`text-[#888] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}>
            {Icons.chevronDown}
          </span>
        </button>

        <div className={`overflow-hidden transition-all duration-200 ${profileOpen ? 'max-h-40' : 'max-h-0'}`}>
          <div className="px-2.5 pt-2 pb-1">
            <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-[#666] mb-2">Settings</p>
            <p className="text-[11px] text-[#888] mb-2">Appearance</p>
            <div className="flex border border-[#333] rounded-lg overflow-hidden bg-[#161616]">
              {(['light', 'dark', 'auto'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`flex-1 h-[34px] text-[15px] transition-colors ${
                    theme === mode ? 'bg-[#ED1B24] text-white' : 'text-[#aaa] hover:text-white'
                  }`}
                >
                  {mode === 'light' ? '☀' : mode === 'dark' ? '☾' : '⊙'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="px-3.5 pb-2">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-2.5 py-[9px] rounded-md text-[13px] font-medium text-[#ccc] hover:bg-[#161616] hover:text-white transition-colors w-full"
        >
          <span className="w-[17px] h-[17px] flex items-center justify-center flex-none opacity-[0.85]">
            {Icons.signout}
          </span>
          <span>Sign out</span>
        </button>
      </div>

      {/* User strip */}
      <div className="flex items-center gap-2.5 px-5 py-2.5 border-t border-[#222] mt-2">
        <div className="w-[34px] h-[34px] rounded-full bg-[#ED1B24] flex items-center justify-center font-bold text-[13px] text-white flex-none">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-white leading-tight truncate">{displayName || '—'}</p>
          <p className="text-[11px] text-[#888] truncate">{role}</p>
        </div>
      </div>
    </aside>
  )
}

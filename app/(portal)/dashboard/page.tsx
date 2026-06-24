'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const PATTERN_STRIP =
  'https://pub-05e130c201dd463a8accbcd12eb02d77.r2.dev/wp-content/uploads/2025/05/CNC-Website-Page-break-Africa-Pattern-faded-2000x100px-1.1.png'

const DEPTS = [
  { id: 'directors',  label: 'Directors',           color: '#001489', desc: 'Executive overview, board packs, sign-off queue.',   href: '/directors',  live: true },
  { id: 'operations', label: 'Operations',           color: '#007703', desc: 'Clinics, mobile units, scheduling, equipment.',      href: '/operations', live: true },
  { id: 'finance',    label: 'Finance',              color: '#007703', desc: 'Revenue, invoices, VAT201, cash position.',          href: '/finance',    live: true },
  { id: 'sales',      label: 'Sales',                color: '#ED1B24', desc: 'Pipeline, opportunities, win rate, targets.',        href: '/sales',      live: true },
  { id: 'governance', label: 'Corporate Governance', color: '#787878', desc: 'POPIA, FICA, compliance calendar, risk.',            href: '/governance', live: true },
  { id: 'hr',         label: 'HR & People',          color: '#ED1B24', desc: 'Recruitment, headcount, leave, training.',          href: '/staff',      live: true },
  { id: 'it',         label: 'IT & AI',              color: '#001489', desc: 'Systems, integrations, automations, agents.',       href: '/it',         live: true },
  { id: 'marketing',  label: 'Marketing',            color: '#FFB81C', desc: 'CNC Studio — assets, channels, campaigns.',         href: '/marketing',  live: true },
]

const ICON_PATHS: Record<string, string> = {
  directors:  '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>',
  operations: '<path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19 12a7 7 0 00-.1-1.1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.9-1.1L14.5 2h-5l-.3 2.7a7 7 0 00-1.9 1.1l-2.4-1-2 3.4 2 1.6A7 7 0 005 12a7 7 0 00.1 1.1l-2 1.6 2 3.4 2.4-1c.6.5 1.2.8 1.9 1.1L9.5 22h5l.3-2.7c.7-.3 1.3-.6 1.9-1.1l2.4 1 2-3.4-2-1.6c.1-.4.1-.7.1-1.1z"/>',
  finance:    '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  sales:      '<path d="M3 17l6-6 4 4 8-8M21 7v6h-6"/>',
  governance: '<path d="M12 3v18M5 7h14M7 7l-3 7a4 4 0 008 0L9 7M17 7l-3 7a4 4 0 008 0l-3-7"/>',
  hr:         '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
  it:         '<path d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z"/>',
  marketing:  '<path d="M3 11l18-5v12L3 14v-3zM3 11v3M11.6 16.8a3 3 0 11-5.8-1.6"/>',
}

function hexRgba(hex: string, alpha: number) {
  const n = hex.replace('#', '')
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function nameFromEmail(email: string) {
  return email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('')
  const [greeting,  setGreeting]  = useState('Good morning')
  const [dateDay,   setDateDay]   = useState('')
  const [dateStr,   setDateStr]   = useState('')

  useEffect(() => {
    const now  = new Date()
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    const h    = now.getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
    setDateDay(days[now.getDay()])
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    setDateStr(`${dd}/${mm}/${now.getFullYear()}`)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const full = data.user.user_metadata?.full_name ?? nameFromEmail(data.user.email ?? '')
        setFirstName(full.split(' ')[0] || 'there')
      }
    })
  }, [])

  return (
    <>
      {/* African pattern strip — breaks out of layout's p-6 to go full-width */}
      <div
        className="-mx-6 -mt-6 mb-7 h-[50px] border-b border-[#E2E2E2]"
        style={{
          backgroundImage:    `url('${PATTERN_STRIP}')`,
          backgroundRepeat:   'repeat-x',
          backgroundPosition: 'center',
          backgroundSize:     'auto 100%',
          opacity:             0.95,
        }}
      />

      {/* Greeting banner */}
      <div className="relative bg-black rounded-xl px-8 py-7 mb-7 flex items-center justify-between gap-5 overflow-hidden">
        <div className="relative z-10">
          <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#ED1B24] mb-2">
            {greeting}
          </p>
          <h1 className="font-heading font-black text-white leading-none mb-3 text-[46px]">
            Welcome back, {firstName || '…'}.
          </h1>
          <p className="text-[14px] text-[#bbbbbb] max-w-[440px]">
            Pick a department to open its workspace. Live rooms are ready now; others are on the way.
          </p>
        </div>

        <div className="relative z-10 text-right flex-none">
          <span className="block font-heading font-black text-[30px] tracking-wide text-white/90 leading-tight">
            {dateDay}
          </span>
          <span className="block font-heading text-[18px] tracking-[0.1em] text-white/50 mt-0.5">
            {dateStr}
          </span>
        </div>
      </div>

      {/* Department grid */}
      <div
        className="grid gap-[18px]"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))' }}
      >
        {DEPTS.map((dept) => {
          const inner = (
            <>
              {/* Icon wrap */}
              <div
                className="relative w-12 h-12 rounded-[11px] flex items-center justify-center mb-4 overflow-hidden"
                style={{ background: hexRgba(dept.color, 0.12), color: dept.color }}
              >
                <svg
                  width="22" height="22" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                  className="relative z-10"
                >
                  <g dangerouslySetInnerHTML={{ __html: ICON_PATHS[dept.id] }} />
                </svg>
                {/* Diagonal corner accent */}
                <span
                  className="absolute right-[-6px] bottom-[-6px] w-[26px] h-[26px] opacity-[0.18]"
                  style={{ backgroundImage: 'linear-gradient(135deg, transparent 50%, currentColor 50%)' }}
                />
              </div>

              <h3 className="font-heading font-black text-[21px] tracking-[0.04em] mb-1.5 text-black">
                {dept.label}
              </h3>
              <p className="text-[12.5px] text-[#555555] leading-relaxed min-h-[38px]">
                {dept.desc}
              </p>

              <div className={`mt-3.5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.04em] uppercase ${dept.live ? 'text-[#007703]' : 'text-[#787878]'}`}>
                <span className={`w-[7px] h-[7px] rounded-full flex-none ${dept.live ? 'bg-[#007703]' : 'bg-[#FFB81C]'}`} />
                {dept.live ? 'Live' : 'Coming soon'}
              </div>
            </>
          )

          if (!dept.live) {
            return (
              <div key={dept.id}
                className="bg-white border border-[#E2E2E2] rounded-xl p-[22px] opacity-55 cursor-not-allowed relative overflow-hidden">
                {inner}
              </div>
            )
          }

          return (
            <Link key={dept.id} href={dept.href}
              className="bg-white border border-[#E2E2E2] rounded-xl p-[22px] relative overflow-hidden block transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:border-transparent">
              {inner}
            </Link>
          )
        })}
      </div>
    </>
  )
}

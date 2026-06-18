'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CNC_LOGO = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'
const PATTERN  = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/Individual%20Patterns/1.svg'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [ssoLoading, setSsoLoading] = useState(false)

  async function handleMicrosoftSSO() {
  setError('')
  setSsoLoading(true)
  const supabase = createClient()
  const { error: authError } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile',
      redirectTo: `${window.location.origin}/callback`,
    },
  })
  if (authError) {
    setError(authError.message)
    setSsoLoading(false)
  }
}

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">

      {/* ── Left panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex bg-cnc-black text-white relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-cnc-red" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PATTERN} alt="" className="absolute top-8 left-8 w-28 opacity-90 z-10 pointer-events-none" />
        
        {/* Spacer — keeps hero vertically centred */}
        <div className="h-12" />
        
        <div className="relative z-10">
          <h1 className="font-heading font-black uppercase leading-none text-[44px] mb-4">
            One front door.<br />
            <span className="text-cnc-red">Every department.</span>
          </h1>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            The Care Net Consultants internal portal. Sign in once to reach your
            team&apos;s tools, dashboards, and resources in one place.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/30 leading-relaxed">
          Care Net Consultants (Pty) Ltd · Since 2012<br />
          Your Partner in Workplace Health ·{' '}
          <span className="text-cnc-red">I am because we are.</span>
        </p>
      </div>

      {/* ── Right panel ──────────────────────────────────────── */}
      <div className="flex items-center justify-center bg-white p-10 relative min-h-screen lg:min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CNC_LOGO} alt="Care Net Consultants"
          className="absolute top-8 right-8 h-12 w-auto max-w-[220px] object-contain hidden lg:block" />

        <div className="w-full max-w-[360px]">
          <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-cnc-gray-400 mb-2">
            Internal Portal
          </p>
          <h2 className="font-heading font-black uppercase text-[38px] leading-tight text-cnc-black mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-cnc-gray-500 mb-7">
            Sign in with your Care Net account.
          </p>

          {/* Microsoft SSO button */}
          <button
            type="button"
            onClick={handleMicrosoftSSO}
            disabled={ssoLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-cnc-gray-200 rounded-lg bg-white text-cnc-black text-sm font-semibold hover:border-cnc-gray-400 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Microsoft colour glyph */}
            <span className="grid grid-cols-2 gap-[2px] w-5">
              <span className="w-[9px] h-[9px] bg-[#F25022] block" />
              <span className="w-[9px] h-[9px] bg-[#7FBA00] block" />
              <span className="w-[9px] h-[9px] bg-[#00A4EF] block" />
              <span className="w-[9px] h-[9px] bg-[#FFB900] block" />
            </span>
            Sign in with Microsoft
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 text-xs text-cnc-gray-400">
            <span className="flex-1 h-px bg-cnc-gray-100" />
            <span>or use your email</span>
            <span className="flex-1 h-px bg-cnc-gray-100" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cnc-black mb-1.5">
                Email address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
                placeholder="you@carenetconsultants.co.za"
                className="w-full px-3.5 py-3 border border-cnc-gray-200 rounded-lg text-sm font-sans text-cnc-black placeholder-cnc-gray-300 focus:outline-none focus:border-cnc-red focus:ring-2 focus:ring-cnc-red/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cnc-black mb-1.5">
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3.5 py-3 border border-cnc-gray-200 rounded-lg text-sm font-sans text-cnc-black placeholder-cnc-gray-300 focus:outline-none focus:border-cnc-red focus:ring-2 focus:ring-cnc-red/20 transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-cnc-red hover:bg-cnc-red-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-bold text-sm tracking-wide rounded-lg transition-colors shadow-cnc-red"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          {/* Forgot password row */}
          <div className="flex items-center justify-between mt-5 text-xs text-cnc-gray-400">
            <span>Forgot password?</span>
            <a href="/forgot-password" className="font-semibold text-cnc-red hover:underline">
              Reset
            </a>
          </div>

          {/* POPIA */}
          <div className="mt-6 pt-5 border-t border-cnc-gray-100 flex gap-2.5 text-[11.5px] leading-relaxed text-cnc-gray-400">
            <span className="flex-shrink-0">🔒</span>
            <span>
              This is a private system for authorised Care Net Consultants staff.
              Access is logged and monitored. Personal information is processed in
              line with POPIA.{' '}
              <a href="#" className="text-cnc-red font-semibold hover:underline">
                View privacy policy
              </a>.
            </span>
          </div>

          <p className="text-center text-xs text-cnc-gray-400 mt-4">
            Need access?{' '}
            <a href="mailto:it@carenetconsultants.co.za" className="text-cnc-red font-semibold hover:underline">
              Contact IT
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

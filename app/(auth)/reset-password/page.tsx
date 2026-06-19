'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CNC_LOGO = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'
const PATTERN  = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/Individual%20Patterns/1.svg'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (password !== confirm) { setError('Passwords do not match.'); return }
  if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
  setError('')
  setLoading(true)
  const res = await fetch('/api/auth/update-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const data = await res.json()
  setLoading(false)
  if (!res.ok) { setError(data.error ?? 'Failed to update password.'); return }
  router.push('/login')
}

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">

      {/* ── Left panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex bg-cnc-black text-white relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-cnc-red" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PATTERN} alt="" className="absolute top-8 left-8 w-28 opacity-90 z-10 pointer-events-none" />

        <div className="h-12" />

        <div className="relative z-10">
          <h1 className="font-heading font-black uppercase leading-none text-[44px] mb-4">
            Almost there.<br />
            <span className="text-cnc-red">New password.</span>
          </h1>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            Choose a strong password to protect your Care Net Consultants
            account. You&apos;ll be signed in automatically once it&apos;s set.
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
            Password reset
          </p>
          <h2 className="font-heading font-black uppercase text-[38px] leading-tight text-cnc-black mb-1">
            Set new password
          </h2>
          <p className="text-sm text-cnc-gray-500 mb-7">
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cnc-black mb-1.5">
                New password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8} autoComplete="new-password"
                placeholder="Min. 8 characters"
                className="w-full px-3.5 py-3 border border-cnc-gray-200 rounded-lg text-sm font-sans text-cnc-black placeholder-cnc-gray-300 focus:outline-none focus:border-cnc-red focus:ring-2 focus:ring-cnc-red/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cnc-black mb-1.5">
                Confirm new password
              </label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                required autoComplete="new-password"
                placeholder="Repeat your new password"
                className="w-full px-3.5 py-3 border border-cnc-gray-200 rounded-lg text-sm font-sans text-cnc-black placeholder-cnc-gray-300 focus:outline-none focus:border-cnc-red focus:ring-2 focus:ring-cnc-red/20 transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-cnc-red hover:bg-cnc-red-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-bold text-sm tracking-wide rounded-lg transition-colors shadow-cnc-red"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-cnc-gray-100 flex gap-2.5 text-[11.5px] leading-relaxed text-cnc-gray-400">
            <span className="flex-shrink-0">🔒</span>
            <span>
              Password changes are logged for security. If you did not request
              this reset, contact IT immediately at{' '}
              <a href="mailto:it@carenetconsultants.co.za" className="text-cnc-red font-semibold hover:underline">
                it@carenetconsultants.co.za
              </a>.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CNC_LOGO = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'
const PATTERN  = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/Individual%20Patterns/1.svg'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback?next=/reset-password`,
    })
    setLoading(false)
    if (resetError) { setError(resetError.message ?? 'Failed to send reset email. Please try again.'); return }
    setSent(true)
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
            Locked out?<br />
            <span className="text-cnc-red">We&apos;ve got you.</span>
          </h1>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            Enter your Care Net email address and we&apos;ll send a secure reset
            link straight to your inbox.
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
          {sent ? (
            <>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-6">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-cnc-gray-400 mb-2">
                Password reset
              </p>
              <h2 className="font-heading font-black uppercase text-[38px] leading-tight text-cnc-black mb-1">
                Check your email
              </h2>
              <p className="text-sm text-cnc-gray-500 mb-7 leading-relaxed">
                We&apos;ve sent a reset link to{' '}
                <strong className="text-cnc-black">{email}</strong>.
                The link expires in 1 hour.
              </p>
              <p className="text-sm text-cnc-gray-400">
                Didn&apos;t receive it?{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-cnc-red font-semibold hover:underline"
                >
                  Try again
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-cnc-gray-400 mb-2">
                Password reset
              </p>
              <h2 className="font-heading font-black uppercase text-[38px] leading-tight text-cnc-black mb-1">
                Forgot password?
              </h2>
              <p className="text-sm text-cnc-gray-500 mb-7">
                Enter your email and we&apos;ll send you a reset link.
              </p>

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

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3.5 bg-cnc-red hover:bg-cnc-red-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-bold text-sm tracking-wide rounded-lg transition-colors shadow-cnc-red"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}

          <div className="flex items-center justify-between mt-5 text-xs text-cnc-gray-400">
            <span>Remember your password?</span>
            <Link href="/login" className="font-semibold text-cnc-red hover:underline">
              Back to sign in
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-cnc-gray-100 flex gap-2.5 text-[11.5px] leading-relaxed text-cnc-gray-400">
            <span className="flex-shrink-0">🔒</span>
            <span>
              Reset links are single-use and expire after 1 hour. If you did not
              request this, no action is needed.{' '}
              <a href="mailto:it@carenetconsultants.co.za" className="text-cnc-red font-semibold hover:underline">
                Contact IT
              </a>{' '}if you have concerns.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

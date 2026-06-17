'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CNC_LOGO = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'

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
    if (resetError) { setError(resetError.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cnc-gray-50 px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CNC_LOGO} alt="Care Net Consultants" className="h-14 w-auto mx-auto mb-4" />
        </div>

        <div className="bg-white rounded-2xl shadow-cnc-md border border-cnc-gray-100 p-8">
          {sent ? (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-heading font-black text-cnc-black uppercase text-center mb-2">
                Check your email
              </h2>
              <p className="text-sm text-cnc-gray-500 text-center leading-relaxed mb-6">
                We&apos;ve sent a password reset link to <strong className="text-cnc-black">{email}</strong>.
                The link expires in 1 hour.
              </p>
              <p className="text-xs text-cnc-gray-400 text-center">
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
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-cnc-gray-400 mb-2">
                Password reset
              </p>
              <h2 className="text-2xl font-heading font-black text-cnc-black uppercase mb-1">
                Forgot password?
              </h2>
              <p className="text-sm text-cnc-gray-500 mb-6">
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
                    className="w-full px-3.5 py-3 border border-cnc-gray-200 rounded-lg text-sm text-cnc-black placeholder-cnc-gray-300 focus:outline-none focus:border-cnc-red focus:ring-2 focus:ring-cnc-red/20 transition-colors"
                  />
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 bg-cnc-red hover:bg-cnc-red-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-bold text-sm rounded-lg shadow-cnc-red transition-colors"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-cnc-gray-400 mt-6">
          <Link href="/login" className="text-cnc-red font-semibold hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

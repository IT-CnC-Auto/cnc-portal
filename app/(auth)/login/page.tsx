'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Honour the ?next= param the middleware set, default to /dashboard
    const next = new URLSearchParams(window.location.search).get('next') ?? '/dashboard'
    router.push(next)
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cnc-red rounded-2xl mb-4 shadow-cnc-red">
          <span className="text-white font-heading font-bold text-2xl tracking-tight">CN</span>
        </div>
        <h1 className="text-2xl font-heading font-bold text-cnc-black">Care Net Portal</h1>
        <p className="text-cnc-gray-500 text-sm mt-1">Care Net Consultants (Pty) Ltd</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-cnc-md border border-cnc-gray-100 p-8">
        <h2 className="text-lg font-heading font-semibold text-cnc-black mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cnc-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg border border-cnc-gray-300 text-cnc-black placeholder-cnc-gray-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cnc-red focus:border-transparent"
              placeholder="you@carenetconsultants.co.za"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-cnc-gray-700">
                Password
              </label>
              <a href="#" className="text-xs text-cnc-red hover:text-cnc-red-dark font-medium transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-lg border border-cnc-gray-300 text-cnc-black placeholder-cnc-gray-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cnc-red focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-cnc-red hover:bg-cnc-red-dark text-white font-heading font-semibold text-sm rounded-lg shadow-cnc-red transition-colors duration-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cnc-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs text-cnc-gray-400 bg-white px-3">
            Authorised personnel only
          </div>
        </div>

        <p className="text-xs text-cnc-gray-400 text-center">
          Need access?{' '}
          <a href="mailto:it@carenetconsultants.co.za" className="text-cnc-red hover:underline">
            Contact IT
          </a>
        </p>
      </div>

      <p className="text-center text-xs text-cnc-gray-400 mt-6 leading-relaxed px-4">
        This system is protected under POPIA Act 4 of 2013.
        <br />
        All access is logged and audited. Unauthorised access is a criminal offence.
        <br /><br />
        © {new Date().getFullYear()} Care Net Consultants (Pty) Ltd
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CNC_LOGO = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'

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
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) { setError(updateError.message); return }
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cnc-gray-50 px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CNC_LOGO} alt="Care Net Consultants" className="h-14 w-auto mx-auto mb-4" />
        </div>

        <div className="bg-white rounded-2xl shadow-cnc-md border border-cnc-gray-100 p-8">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-cnc-gray-400 mb-2">
            Password reset
          </p>
          <h2 className="text-2xl font-heading font-black text-cnc-black uppercase mb-1">
            Set new password
          </h2>
          <p className="text-sm text-cnc-gray-500 mb-6">
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
                className="w-full px-3.5 py-3 border border-cnc-gray-200 rounded-lg text-sm text-cnc-black placeholder-cnc-gray-300 focus:outline-none focus:border-cnc-red focus:ring-2 focus:ring-cnc-red/20 transition-colors"
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
                className="w-full px-3.5 py-3 border border-cnc-gray-200 rounded-lg text-sm text-cnc-black placeholder-cnc-gray-300 focus:outline-none focus:border-cnc-red focus:ring-2 focus:ring-cnc-red/20 transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-cnc-red hover:bg-cnc-red-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-bold text-sm rounded-lg shadow-cnc-red transition-colors"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        <div className="border-t border-cnc-gray-100 mt-6 pt-4">
          <p className="text-xs text-cnc-gray-400 flex gap-2 leading-relaxed">
            <span>🔒</span>
            <span>Password changes are logged for security. If you did not request this reset, contact IT immediately at it@carenetconsultants.co.za.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OTPInput } from '@/components/OTPInput'

const CNC_LOGO = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'
const PATTERN  = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/Individual%20Patterns/1.svg'

export default function MFAVerifyContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()
  const next         = searchParams.get('next') ?? '/'

  const [factorId,  setFactorId]  = useState('')
  const [code,      setCode]      = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [preparing, setPreparing] = useState(true)
  const [hint,      setHint]      = useState('')

  useEffect(() => {
    async function prepare() {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error || !data?.totp?.length) { router.replace('/mfa/enroll'); return }
      setFactorId(data.totp[0].id)
      setPreparing(false)
    }
    prepare()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) { setError('Enter all 6 digits.'); return }
    setError(''); setLoading(true)

    const { data: challengeData, error: challengeErr } =
      await supabase.auth.mfa.challenge({ factorId })
    if (challengeErr) { setError(challengeErr.message); setLoading(false); return }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId, challengeId: challengeData.id, code,
    })
    if (verifyErr) { setError('Incorrect code. Check your authenticator and try again.'); setCode(''); setLoading(false); return }
    router.refresh()
    router.push(next)
  }

  function handleCodeNotWorking() {
    setCode(''); setError('')
    setHint('TOTP codes refresh every 30 seconds — wait for the next code in your authenticator app.')
    setTimeout(() => setHint(''), 5000)
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
            Secure access.<br />
            <span className="text-cnc-red">Every time.</span>
          </h1>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            Two-step verification keeps your Care Net account and the personal
            information inside it safe — as required under POPIA.
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

        {preparing ? (
          <p className="text-cnc-gray-400 text-sm">Loading…</p>
        ) : (
          <div className="w-full max-w-[360px]">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-cnc-gray-400 mb-2">
              Two-step verification
            </p>
            <h2 className="font-heading font-black uppercase text-[38px] leading-tight text-cnc-black mb-1">
              Confirm it&apos;s you
            </h2>
            <p className="text-sm text-cnc-gray-500 mb-7">
              Enter the 6-digit code from your authenticator app.
            </p>

            <form onSubmit={handleVerify}>
              <OTPInput value={code} onChange={setCode} />

              {error && <p className="text-sm text-red-600 font-medium text-center mb-4">{error}</p>}
              {hint  && <p className="text-sm text-cnc-gray-500 text-center mb-4">{hint}</p>}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3.5 bg-cnc-red hover:bg-cnc-red-dark text-white font-heading font-bold text-sm tracking-wide rounded-lg shadow-cnc-red transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying…' : 'Verify and sign in'}
              </button>
            </form>

            <div className="flex items-center justify-between mt-5 text-xs text-cnc-gray-400">
              <a href="/login" className="font-semibold text-cnc-red hover:underline">
                ← Back
              </a>
              <button
                type="button"
                onClick={handleCodeNotWorking}
                className="hover:text-cnc-gray-700 transition-colors"
              >
                My code isn&apos;t working
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-cnc-gray-100 flex gap-2.5 text-[11.5px] leading-relaxed text-cnc-gray-400">
              <span className="flex-shrink-0">🔒</span>
              <span>
                Two-step verification protects your account and the personal
                information held in this portal, as required under POPIA.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OTPInput } from '@/components/OTPInput'

const CNC_LOGO = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/CNC%20-%20Logo%20Re-working%20-%20red%20-%20with%20tag%20line%20-%20transparent%20-%201.1.png'
const PATTERN  = 'https://pub-d5b31319f7724cca83d8b708f94830b0.r2.dev/Individual%20Patterns/1.svg'

export default function MFAEnrollPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [step,       setStep]       = useState<'setup' | 'confirm'>('setup')
  const [qrCode,     setQrCode]     = useState('')
  const [secret,     setSecret]     = useState('')
  const [factorId,   setFactorId]   = useState('')
  const [code,       setCode]       = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [enrolling,  setEnrolling]  = useState(true)
  const [showSecret, setShowSecret] = useState(false)
  const [copied,     setCopied]     = useState(false)

  useEffect(() => {
    async function enroll() {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp', friendlyName: 'Care Net Portal',
      })
      if (error || !data) { setError(error?.message ?? 'Could not start setup.'); return }
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
      setFactorId(data.id)
      setEnrolling(false)
    }
    enroll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) { setError('Enter all 6 digits.'); return }
    setError(''); setLoading(true)

    const { error: challengeError, data: challengeData } =
      await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) { setError(challengeError.message); setLoading(false); return }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId, challengeId: challengeData.id, code,
    })
    if (verifyError) { setError('Incorrect code. Try again.'); setCode(''); setLoading(false); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('user_profiles').update({ mfa_enrolled: true }).eq('id', user.id)

    router.push('/')
  }

  function copySecret() {
    navigator.clipboard.writeText(secret)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
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
            Two steps.<br />
            <span className="text-cnc-red">Always protected.</span>
          </h1>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            Set up two-step verification to secure your Care Net account.
            It only takes a minute and keeps your data protected under POPIA.
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

        <div className="w-full max-w-[380px]">

          {step === 'setup' ? (
            <>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-cnc-gray-400 mb-2">
                Two-step verification
              </p>
              <h2 className="font-heading font-black uppercase text-[38px] leading-tight text-cnc-black mb-1">
                Set up your app
              </h2>
              <p className="text-sm text-cnc-gray-500 mb-7">
                Scan the QR code with <strong>Google Authenticator</strong>, <strong>Authy</strong>,
                or any TOTP authenticator app.
              </p>

              {enrolling ? (
                <div className="flex justify-center py-10">
                  <p className="text-cnc-gray-400 text-sm">Generating QR code…</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="p-3 border border-cnc-gray-100 rounded-xl bg-white shadow-cnc-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCode} alt="TOTP QR code" width={160} height={160} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setShowSecret(s => !s)}
                      className="text-sm text-cnc-red font-semibold hover:underline"
                    >
                      {showSecret ? '↑ Hide manual key' : "Can't scan? Enter key manually"}
                    </button>
                    {showSecret && (
                      <div className="mt-3 p-3 bg-cnc-gray-50 rounded-lg border border-cnc-gray-100">
                        <p className="text-xs text-cnc-gray-400 mb-1 font-semibold uppercase tracking-wide">
                          Setup key
                        </p>
                        <code className="text-xs font-mono break-all text-cnc-black block mb-2">
                          {secret}
                        </code>
                        <button
                          type="button"
                          onClick={copySecret}
                          className="text-xs text-cnc-red font-semibold hover:underline"
                        >
                          {copied ? '✓ Copied' : 'Copy key'}
                        </button>
                      </div>
                    )}
                  </div>

                  {error && <p className="text-sm text-red-600 font-medium text-center mb-4">{error}</p>}

                  <button
                    type="button"
                    onClick={() => { setStep('confirm'); setError('') }}
                    className="w-full py-3.5 bg-cnc-red hover:bg-cnc-red-dark text-white font-heading font-bold text-sm tracking-wide rounded-lg shadow-cnc-red transition-colors"
                  >
                    I&apos;ve scanned the code →
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-cnc-gray-400 mb-2">
                Two-step verification
              </p>
              <h2 className="font-heading font-black uppercase text-[38px] leading-tight text-cnc-black mb-1">
                Confirm it&apos;s you
              </h2>
              <p className="text-sm text-cnc-gray-500 mb-7">
                Enter the 6-digit code from your authenticator app to confirm setup.
              </p>

              <form onSubmit={handleVerify}>
                <OTPInput value={code} onChange={setCode} />

                {error && <p className="text-sm text-red-600 font-medium text-center mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full py-3.5 bg-cnc-red hover:bg-cnc-red-dark text-white font-heading font-bold text-sm tracking-wide rounded-lg shadow-cnc-red transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying…' : 'Confirm and continue'}
                </button>
              </form>

              <div className="mt-5 text-xs text-cnc-gray-400">
                <button
                  type="button"
                  onClick={() => { setStep('setup'); setCode(''); setError('') }}
                  className="font-semibold text-cnc-red hover:underline"
                >
                  ← Back
                </button>
              </div>
            </>
          )}

          <div className="mt-6 pt-5 border-t border-cnc-gray-100 flex gap-2.5 text-[11.5px] leading-relaxed text-cnc-gray-400">
            <span className="flex-shrink-0">🔒</span>
            <span>
              Two-step verification protects your account and the personal
              information held in this portal, as required under POPIA.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

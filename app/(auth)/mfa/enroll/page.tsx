'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = value.split('').concat(Array(6).fill('')).slice(0, 6)
    next[i] = char
    onChange(next.join(''))
    if (char && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      const next = value.split('').concat(Array(6).fill('')).slice(0, 6)
      if (!value[i] && i > 0) { next[i - 1] = ''; onChange(next.join('')); refs.current[i - 1]?.focus() }
      else { next[i] = ''; onChange(next.join('')) }
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) { onChange(pasted.padEnd(6, '').slice(0, 6)); refs.current[Math.min(pasted.length, 5)]?.focus() }
    e.preventDefault()
  }

  return (
    <div className="flex gap-2 justify-center my-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-14 text-center text-xl font-bold font-heading border border-cnc-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cnc-red focus:border-transparent text-cnc-black"
        />
      ))}
    </div>
  )
}

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

  const popia = (
    <div className="border-t border-cnc-gray-100 mt-6 pt-4">
      <p className="text-xs text-cnc-gray-400 flex gap-2 leading-relaxed">
        <span>🔒</span>
        <span>Two-step verification protects your account and the personal information held in this portal, as required under POPIA.</span>
      </p>
    </div>
  )

  // ── Step 1: Scan QR ───────────────────────────────────────
  if (step === 'setup') return (
    <div className="min-h-screen flex items-center justify-center bg-cnc-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-cnc-md border border-cnc-gray-100 p-8">

          <p className="text-xs font-semibold tracking-widest text-cnc-gray-400 uppercase mb-3">
            Two-step verification
          </p>
          <h1 className="text-3xl font-heading font-black text-cnc-black uppercase mb-2">
            Set up your app
          </h1>
          <p className="text-sm text-cnc-gray-500 mb-6">
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
                <div className="p-3 border border-cnc-gray-100 rounded-xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCode} alt="TOTP QR code" width={160} height={160} />
                </div>
              </div>

              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowSecret(s => !s)}
                  className="text-sm text-cnc-red font-medium hover:underline"
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
                      className="text-xs text-cnc-red font-medium hover:underline"
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
                className="w-full py-3 bg-cnc-red hover:bg-cnc-red-dark text-white font-heading font-semibold text-sm rounded-lg shadow-cnc-red transition-colors duration-200"
              >
                I've scanned the code →
              </button>
            </>
          )}

          {popia}
        </div>
      </div>
    </div>
  )

  // ── Step 2: Confirm code ──────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-cnc-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-cnc-md border border-cnc-gray-100 p-8">

          <p className="text-xs font-semibold tracking-widest text-cnc-gray-400 uppercase mb-3">
            Two-step verification
          </p>
          <h1 className="text-3xl font-heading font-black text-cnc-black uppercase mb-2">
            Confirm it's you
          </h1>
          <p className="text-sm text-cnc-gray-500">
            Enter the 6-digit code from your authenticator app to confirm setup.
          </p>

          <form onSubmit={handleVerify}>
            <OTPInput value={code} onChange={setCode} />

            {error && <p className="text-sm text-red-600 font-medium text-center mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 bg-cnc-red hover:bg-cnc-red-dark text-white font-heading font-semibold text-sm rounded-lg shadow-cnc-red transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying…' : 'Confirm and continue'}
            </button>
          </form>

          <div className="flex items-center mt-5">
            <button
              type="button"
              onClick={() => { setStep('setup'); setCode(''); setError('') }}
              className="text-sm text-cnc-red font-medium hover:underline"
            >
              ← Back
            </button>
          </div>

          {popia}
        </div>
      </div>
    </div>
  )
}

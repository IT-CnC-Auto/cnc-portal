'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
    router.push(next)
  }

  function handleResend() {
    setCode(''); setError('')
    setHint('TOTP codes refresh every 30 seconds — check your authenticator app.')
    setTimeout(() => setHint(''), 4000)
  }

  if (preparing) return (
    <div className="min-h-screen flex items-center justify-center bg-cnc-gray-50">
      <p className="text-cnc-gray-400 text-sm">Loading…</p>
    </div>
  )

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
            Enter the 6-digit code from your authenticator app.
          </p>

          <form onSubmit={handleVerify}>
            <OTPInput value={code} onChange={setCode} />

            {error && <p className="text-sm text-red-600 font-medium text-center mb-4">{error}</p>}
            {hint  && <p className="text-sm text-cnc-gray-500 text-center mb-4">{hint}</p>}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 bg-cnc-red hover:bg-cnc-red-dark text-white font-heading font-semibold text-sm rounded-lg shadow-cnc-red transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying…' : 'Verify and sign in'}
            </button>
          </form>

          <div className="flex items-center justify-between mt-5">
            <a href="/login" className="text-sm text-cnc-red font-medium hover:underline">
              ← Back
            </a>
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-cnc-gray-500 hover:text-cnc-gray-700 transition-colors"
            >
              Resend code
            </button>
          </div>

          <div className="border-t border-cnc-gray-100 mt-6 pt-4">
            <p className="text-xs text-cnc-gray-400 flex gap-2 leading-relaxed">
              <span>🔒</span>
              <span>
                Two-step verification protects your account and the personal information
                held in this portal, as required under POPIA.
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

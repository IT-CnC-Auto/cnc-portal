'use client'
// src/app/auth/mfa/enroll/page.tsx
// First-time TOTP setup for Owner and Administrator accounts.
// Supabase returns a QR code as an SVG data-URL — no external QR library needed.

import { useState, useEffect } from 'react'
import { useRouter }            from 'next/navigation'
import { createClient }         from '@/lib/supabase/client'

export default function MFAEnrollPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [qrCode,    setQrCode]    = useState('')
  const [secret,    setSecret]    = useState('')
  const [factorId,  setFactorId]  = useState('')
  const [code,      setCode]      = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [enrolling, setEnrolling] = useState(true)

  useEffect(() => {
    async function enroll() {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType:   'totp',
        friendlyName: 'Care Net Portal',
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
    if (code.length !== 6) { setError('Enter the 6-digit code from your authenticator.'); return }
    setError('')
    setLoading(true)

    // Challenge then verify in one step
    const { error: challengeError, data: challengeData } =
      await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) { setError(challengeError.message); setLoading(false); return }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    })
    if (verifyError) { setError('Incorrect code. Try again.'); setLoading(false); return }

    // Mark enrolled in profile
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_profiles').update({ mfa_enrolled: true }).eq('id', user.id)
    }

    router.push('/')
  }

  return (
    <div style={pageWrap}>
      <div style={card}>
        <div style={{ width: '32px', height: '4px', backgroundColor: '#ED1B24', marginBottom: '24px' }} />
        <h1 style={heading}>Set up two-factor authentication</h1>
        <p style={subtext}>
          Scan the QR code with Google Authenticator, Authy, or any TOTP app,
          then enter the 6-digit code to confirm.
        </p>

        {enrolling && <p style={subtext}>Generating setup code…</p>}

        {!enrolling && (
          <>
            {/* QR code — Supabase returns an SVG data URL */}
            <div style={{ margin: '24px 0', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="TOTP QR code" width={180} height={180} style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            </div>

            {/* Manual entry fallback */}
            <details style={{ marginBottom: '24px' }}>
              <summary style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>
                Can't scan? Enter key manually
              </summary>
              <code style={{ display: 'block', marginTop: '8px', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '13px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {secret}
              </code>
            </details>

            <form onSubmit={handleVerify}>
              <label style={labelStyle}>Authenticator code</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
                style={{ ...inputStyle, letterSpacing: '0.25em', textAlign: 'center', fontSize: '20px' }}
              />

              {error && <p style={errorStyle}>{error}</p>}

              <button type="submit" disabled={loading} style={{ ...btnStyle, marginTop: '16px' }}>
                {loading ? 'Verifying…' : 'Confirm and continue'}
              </button>
            </form>
          </>
        )}

        {error && enrolling && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  )
}

const pageWrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }
const card: React.CSSProperties     = { background: 'white', borderRadius: '8px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
const heading: React.CSSProperties  = { fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '20px', color: '#111827', margin: '0 0 8px' }
const subtext: React.CSSProperties  = { fontFamily: 'Arial, sans-serif', color: '#6b7280', fontSize: '14px', margin: '0 0 8px', lineHeight: '1.5' }
const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }
const inputStyle: React.CSSProperties = { display: 'block', width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }
const errorStyle: React.CSSProperties = { color: '#dc2626', fontSize: '13px', fontFamily: 'Arial, sans-serif', marginTop: '8px' }
const btnStyle: React.CSSProperties   = { width: '100%', padding: '10px', backgroundColor: '#ED1B24', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: 'Arial, sans-serif', cursor: 'pointer' }


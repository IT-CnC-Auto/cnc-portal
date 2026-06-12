'use client'
// src/app/auth/mfa/verify/page.tsx
// Presented to Owner/Administrator users after password login.
// Upgrades the session from AAL1 → AAL2 using the TOTP factor.

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MFAVerifyPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()
  const next         = searchParams.get('next') ?? '/'

  const [factorId,  setFactorId]  = useState('')
  const [code,      setCode]      = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [preparing, setPreparing] = useState(true)

  useEffect(() => {
    async function prepare() {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error || !data?.totp?.length) {
        // No factor enrolled — go set one up
        router.replace('/auth/mfa/enroll')
        return
      }
      setFactorId(data.totp[0].id)
      setPreparing(false)
    }
    prepare()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) { setError('Enter the 6-digit code from your authenticator.'); return }
    setError('')
    setLoading(true)

    const { data: challengeData, error: challengeErr } =
      await supabase.auth.mfa.challenge({ factorId })
    if (challengeErr) { setError(challengeErr.message); setLoading(false); return }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    })

    if (verifyErr) {
      setError('Incorrect code. Check your authenticator and try again.')
      setCode('')
      setLoading(false)
      return
    }

    router.push(next)
  }

  if (preparing) {
    return (
      <div style={pageWrap}>
        <p style={{ fontFamily: 'Arial, sans-serif', color: '#6b7280' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div style={pageWrap}>
      <div style={card}>
        <div style={{ width: '32px', height: '4px', backgroundColor: '#ED1B24', marginBottom: '24px' }} />
        <h1 style={heading}>Two-factor verification</h1>
        <p style={subtext}>
          Open your authenticator app and enter the 6-digit code for the Care Net Portal.
        </p>

        <form onSubmit={handleVerify} style={{ marginTop: '24px' }}>
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
            {loading ? 'Verifying…' : 'Verify and continue'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
          Lost access to your authenticator?{' '}
          <a href="mailto:it@carenetconsultants.co.za" style={{ color: '#ED1B24' }}>
            Contact IT support
          </a>
        </p>
      </div>
    </div>
  )
}

const pageWrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }
const card: React.CSSProperties     = { background: 'white', borderRadius: '8px', padding: '48px', width: '100%', maxWidth: '400px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
const heading: React.CSSProperties  = { fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '20px', color: '#111827', margin: '0 0 8px' }
const subtext: React.CSSProperties  = { fontFamily: 'Arial, sans-serif', color: '#6b7280', fontSize: '14px', margin: '0' }
const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }
const inputStyle: React.CSSProperties = { display: 'block', width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }
const errorStyle: React.CSSProperties = { color: '#dc2626', fontSize: '13px', fontFamily: 'Arial, sans-serif', marginTop: '8px' }
const btnStyle: React.CSSProperties   = { width: '100%', padding: '10px', backgroundColor: '#ED1B24', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: 'Arial, sans-serif', cursor: 'pointer' }


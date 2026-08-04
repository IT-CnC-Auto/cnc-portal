'use client'
// app/(auth)/accept-invite/page.tsx
// Landing page for the invite email link. The link carries a token_hash;
// nothing is verified until the user submits the form, so mailbox link
// scanners (e.g. Defender Safe Links) cannot consume the one-time token.
//
// The invite token is single-use, but setting the password can fail after
// the token is consumed (e.g. password rejected as too weak). The session
// created by the successful verification survives that failure, so this
// page checks for an existing session first and, when present, skips the
// token entirely and just sets the password.

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { stampActivityCookie } from '@/lib/inactivity'

function AcceptInviteForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const tokenHash    = searchParams.get('token_hash')

  const [password,     setPassword]     = useState('')
  const [confirm,      setConfirm]      = useState('')
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)

  // A session already present here means a previous attempt consumed the
  // invite token (or the page was reloaded mid-activation). Surface whose
  // session it is so the wrong account can never be changed silently.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setSessionEmail(data.user.email)
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut({ scope: 'local' })
    setSessionEmail(null)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // 1. Verify the invite token — but only when no session exists yet.
    //    A successful verification is what creates the session; once it
    //    exists, the (single-use) token must not be touched again.
    if (!sessionEmail) {
      if (!tokenHash) {
        setError('This invite link is incomplete. Please open the link from your invite email again, or ask your administrator for a new one.')
        setLoading(false)
        return
      }
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        type: 'invite',
        token_hash: tokenHash,
      })
      if (verifyError) {
        setError('This invite link is invalid or has already been used. If you started activation earlier, use "Forgot Password" on the sign-in page to set your password — otherwise ask your administrator to send a new invite.')
        setLoading(false)
        return
      }
      if (verifyData.user?.email) setSessionEmail(verifyData.user.email)
    }

    // 2. Set the password on the active session. If this fails (e.g. the
    //    password does not meet the policy), the session survives and the
    //    user can simply try a stronger password.
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    stampActivityCookie() // start the 5-hour inactivity clock
    router.push('/')
  }

  return (
    <div style={{
      minHeight:       '100vh',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      backgroundColor: '#f9fafb',
    }}>
      <div style={{
        background:   'white',
        borderRadius: '8px',
        padding:      '48px',
        width:        '100%',
        maxWidth:     '400px',
        boxShadow:    '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        {/* Brand accent */}
        <div style={{ width: '32px', height: '4px', backgroundColor: '#ED1B24', marginBottom: '24px' }} />

        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          fontSize:   '22px',
          color:      '#111827',
          margin:     '0 0 8px',
        }}>
          Welcome to the portal
        </h1>
        <p style={{ fontFamily: 'Arial, sans-serif', color: '#6b7280', fontSize: '14px', margin: '0 0 32px' }}>
          {sessionEmail ? (
            <>
              Signed in as <strong>{sessionEmail}</strong> — set a password to
              finish activating this account.{' '}
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: '#ED1B24', fontSize: '14px', fontFamily: 'Arial, sans-serif',
                  fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                }}
              >
                Not you? Sign out
              </button>
            </>
          ) : (
            'Set a password to activate your account.'
          )}
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            style={inputStyle}
          />

          <label style={{ ...labelStyle, marginTop: '16px' }}>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            placeholder="Repeat your password"
            style={{ ...inputStyle, marginBottom: error ? '12px' : '24px' }}
          />

          {error && (
            <p style={{ color: '#dc2626', fontSize: '13px', fontFamily: 'Arial, sans-serif', marginBottom: '16px' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={buttonStyle(loading)}>
            {loading ? 'Activating…' : 'Activate account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInviteForm />
    </Suspense>
  )
}

const labelStyle: React.CSSProperties = {
  display:     'block',
  fontFamily:  'Arial, sans-serif',
  fontSize:    '14px',
  fontWeight:  500,
  color:       '#374151',
  marginBottom:'4px',
}

const inputStyle: React.CSSProperties = {
  display:      'block',
  width:        '100%',
  padding:      '10px 12px',
  border:       '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize:     '14px',
  fontFamily:   'Arial, sans-serif',
  boxSizing:    'border-box',
  marginBottom: '0',
}

function buttonStyle(disabled: boolean): React.CSSProperties {
  return {
    width:           '100%',
    padding:         '10px',
    backgroundColor: disabled ? '#9ca3af' : '#ED1B24',
    color:           'white',
    border:          'none',
    borderRadius:    '6px',
    fontSize:        '14px',
    fontWeight:      600,
    fontFamily:      'Arial, sans-serif',
    cursor:          disabled ? 'not-allowed' : 'pointer',
    transition:      'background-color 0.15s',
  }
}

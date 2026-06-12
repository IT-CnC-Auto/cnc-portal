'use client'
// src/app/auth/accept-invite/page.tsx
// Landing page after a user clicks their invite email link.
// The /auth/callback route already exchanged the code for a session, so
// the user is signed in.  This page lets them set a password.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AcceptInvitePage() {
  const router  = useRouter()
  const [password, setPassword]     = useState('')
  const [confirm,  setConfirm]      = useState('')
  const [error,    setError]        = useState('')
  const [loading,  setLoading]      = useState(false)

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
    const supabase          = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

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
          Set a password to activate your account.
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


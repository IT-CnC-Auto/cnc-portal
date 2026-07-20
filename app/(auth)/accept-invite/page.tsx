'use client'
// app/(auth)/accept-invite/page.tsx
// Landing page for the invite email link. The link carries a token_hash;
// nothing is verified until the user submits the form, so mailbox link
// scanners (e.g. Defender Safe Links) cannot consume the one-time token.

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AcceptInviteForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const tokenHash    = searchParams.get('token_hash')

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

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

    // 1. Verify the invite token — this is the first moment it is consumed.
    if (tokenHash) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type: 'invite',
        token_hash: tokenHash,
      })
      if (verifyError) {
        setError('This invite link is invalid or has already been used. Please ask your administrator to send a new one.')
        setLoading(false)
        return
      }
    }

    // 2. Set the password on the session the verification just created.
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    /* … keep the existing JSX exactly as it is today … */
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInviteForm />
    </Suspense>
  )
}

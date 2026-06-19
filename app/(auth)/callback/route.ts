// src/app/auth/callback/route.ts
// Supabase redirects here after email confirmation, invite acceptance,
// magic-link, and OAuth flows.  Exchanges the PKCE code for a session
// then bounces to ?next= (default: /).

import { createServerClient } from '@supabase/ssr'
import { cookies }            from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code      = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type') as 'recovery' | 'email' | 'signup' | null
  const next      = searchParams.get('next') ?? '/'

  const safePath = next.startsWith('/') && !next.startsWith('//') ? next : '/'

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()  { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as never)
          )
        },
      },
    }
  )

  // PKCE flow (OAuth, magic link)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${safePath}`)
  }

  // Token hash flow (password recovery, email confirmation)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) return NextResponse.redirect(`${origin}${safePath}`)
  }

  return NextResponse.redirect(`${origin}/error?message=auth_callback_failed`)
}

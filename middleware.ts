// src/middleware.ts
// Runs on every request (except static assets).
//
// Rules:
//  1. Unauthenticated user hitting a protected route → /login
//  2. Authenticated user hitting /login → /
//  3. Authenticated admin/owner hitting the portal without AAL2 → MFA flow
//     (checked only on /admin/* to keep DB queries minimal)

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes where an unauthenticated user is allowed
const PUBLIC_PATHS = [
  '/login',
  '/callback',
  '/error',
  '/accept-invite',
  '/mfa/enroll',
  '/mfa/verify',
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the JWT with Supabase — safe against spoofed cookies
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  // ── 1. Not authenticated ──────────────────────────────────
  if (!user && !isPublic) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── 2. Authenticated on login page ───────────────────────
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ── 3. MFA enforcement for /admin/* ──────────────────────
  // Only fetch role + AAL for admin routes to avoid a DB hit on every request.
  if (user && pathname.startsWith('/admin')) {
    // Check role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleData && ['owner', 'administrator'].includes(roleData.role)) {
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

      if (aalData?.currentLevel !== 'aal2') {
        // Decide enroll vs verify based on next level
        const mfaPath = aalData?.nextLevel === 'aal2'
          ? `/mfa/verify?next=${pathname}`
          : `/mfa/enroll`
        return NextResponse.redirect(new URL(mfaPath, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match everything except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// src/middleware.ts
// Runs on every request (except static assets).
//
// Rules:
//  1. Unauthenticated user hitting a protected route → /login
//  2. Authenticated user idle for more than 5 hours → signed out → /login?reason=timeout
//  3. Authenticated user hitting /login → /
//  4. Authenticated admin/owner hitting the portal without AAL2 → MFA flow
//     (checked only on /admin/* to keep DB queries minimal)

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  ACTIVITY_COOKIE,
  ACTIVITY_COOKIE_MAX_AGE,
  INACTIVITY_LIMIT_MS,
} from '@/lib/inactivity'

// Routes where an unauthenticated user is allowed
const PUBLIC_PATHS = [
  '/login',
  '/callback',
  '/error',
  '/accept-invite',
  '/mfa/enroll',
  '/mfa/verify',
  '/forgot-password',
  '/reset-password',
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as never)
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

  // ── 2. Inactivity timeout (5 hours) ──────────────────────
  if (user && !isPublic) {
    const lastActivity = Number(request.cookies.get(ACTIVITY_COOKIE)?.value ?? NaN)

    if (Number.isFinite(lastActivity) && Date.now() - lastActivity > INACTIVITY_LIMIT_MS) {
      // Revoke this session server-side. Failures are ignored because the
      // auth cookies are cleared below regardless, which ends the session
      // for this browser either way.
      try { await supabase.auth.signOut({ scope: 'local' }) } catch { /* noop */ }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('reason', 'timeout')
      const redirect = NextResponse.redirect(loginUrl)
      request.cookies.getAll().forEach(({ name }) => {
        if (name.startsWith('sb-')) redirect.cookies.delete(name)
      })
      redirect.cookies.delete(ACTIVITY_COOKIE)
      return redirect
    }

    // Stamp activity on real page navigations only. Background requests
    // (RSC transitions, API polling) must not keep an idle session alive;
    // in-page activity is stamped client-side by InactivityMonitor.
    // A missing cookie starts the clock now (fresh login, or first visit
    // after this feature deployed).
    const isDocumentNavigation =
      request.headers.get('sec-fetch-dest') === 'document' ||
      (request.headers.get('accept') ?? '').includes('text/html')

    if (isDocumentNavigation) {
      response.cookies.set(ACTIVITY_COOKIE, String(Date.now()), {
        path: '/',
        maxAge: ACTIVITY_COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false, // InactivityMonitor updates this same cookie in-page
      })
    }
  }

  // ── 3. Authenticated on login page ───────────────────────
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ── 4. MFA enforcement for /admin/* ──────────────────────
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

// src/components/layout/InactivityMonitor.tsx
// Client-side half of the 5-hour inactivity timeout.
//
// The middleware catches idle sessions on the next navigation; this
// component catches them while a tab just sits open: it stamps the
// shared cnc-last-activity cookie on real user activity and checks
// once a minute (and on tab focus) whether the limit has passed.
// Renders nothing.

'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  INACTIVITY_LIMIT_MS,
  readActivityCookie,
  stampActivityCookie,
} from '@/lib/inactivity'

const CHECK_EVERY_MS = 60 * 1000     // idle check cadence
const STAMP_THROTTLE_MS = 30 * 1000  // at most one cookie write per 30s

export function InactivityMonitor() {
  const signingOut = useRef(false)

  useEffect(() => {
    async function signOutIdle() {
      if (signingOut.current) return
      signingOut.current = true
      try { await createClient().auth.signOut({ scope: 'local' }) } catch { /* noop */ }
      // Hard navigation so all client state is dropped
      window.location.assign('/login?reason=timeout')
    }

    function checkIdle() {
      const last = readActivityCookie()
      if (last !== null && Date.now() - last > INACTIVITY_LIMIT_MS) void signOutIdle()
    }

    // On mount: the middleware already vetted this navigation, so a
    // missing cookie just means a fresh session — start the clock.
    if (readActivityCookie() === null) stampActivityCookie()
    checkIdle()

    let lastStampAt = 0
    function onActivity() {
      const now = Date.now()
      if (now - lastStampAt < STAMP_THROTTLE_MS) return
      lastStampAt = now
      stampActivityCookie()
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') checkIdle()
    }

    const events: (keyof WindowEventMap)[] =
      ['pointerdown', 'keydown', 'scroll', 'mousemove', 'touchstart']
    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }))
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pageshow', checkIdle) // bfcache restores
    const timer = window.setInterval(checkIdle, CHECK_EVERY_MS)

    return () => {
      events.forEach(e => window.removeEventListener(e, onActivity))
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pageshow', checkIdle)
      window.clearInterval(timer)
    }
  }, [])

  return null
}

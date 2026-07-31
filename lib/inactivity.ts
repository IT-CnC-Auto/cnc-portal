// src/lib/inactivity.ts
// Shared inactivity-timeout settings. One place to change the limit.
//
// The cnc-last-activity cookie holds a Unix-ms timestamp of the last
// user activity. It is written both server-side (middleware, on page
// navigations) and client-side (InactivityMonitor, on in-page activity),
// so it is deliberately NOT httpOnly.

export const INACTIVITY_LIMIT_MS = 5 * 60 * 60 * 1000 // 5 hours
export const ACTIVITY_COOKIE = 'cnc-last-activity'
export const ACTIVITY_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days, in seconds

// Client-side helpers. Both no-op outside the browser.

export function stampActivityCookie() {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; secure' : ''
  document.cookie =
    `${ACTIVITY_COOKIE}=${Date.now()}; path=/; max-age=${ACTIVITY_COOKIE_MAX_AGE}; samesite=lax${secure}`
}

export function readActivityCookie(): number | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)cnc-last-activity=(\d+)/)
  const value = match ? Number(match[1]) : NaN
  return Number.isFinite(value) ? value : null
}

// src/lib/supabase/admin.ts
// Service-role client.  NEVER import this in Client Components or expose to
// the browser.  The 'server-only' package will throw a build error if you do.
//
// Lazy-initialised so the client is only created at runtime (not at build
// time), preventing "supabaseUrl is required" errors during Next.js static
// page-data collection when env vars aren't yet resolved.

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let _admin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error(
        'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.'
      )
    }

    _admin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession:   false,
      },
    })
  }
  return _admin
}

// src/lib/supabase/admin.ts
// Service-role clients.  NEVER import these in Client Components or expose to
// the browser.  The 'server-only' package will throw a build error if you do.
//
// Lazy-initialised so the clients are only created at runtime (not at build
// time), preventing "supabaseUrl is required" errors during Next.js static
// page-data collection when env vars aren't yet resolved.

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let _admin: SupabaseClient | null = null
let _crm: SupabaseClient | null = null

function buildClient(
  url: string | undefined,
  key: string | undefined,
  label: string,
): SupabaseClient {
  if (!url || !key) {
    throw new Error(
      `Missing Supabase env vars for ${label}: url and service-role key must be set.`,
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  })
}

// Primary portal project (Care Net – Internal Portal).
export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = buildClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      'portal (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)',
    )
  }
  return _admin
}

// CRM / integration project (CNC Nexus) — read-only cross-project source for
// integration_pipeline_opportunity, which was intentionally NOT migrated to the
// portal project.  Service-role, SERVER-ONLY (never reaches the browser).
export function getCrmAdmin(): SupabaseClient {
  if (!_crm) {
    _crm = buildClient(
      process.env.CRM_SUPABASE_URL,
      process.env.CRM_SUPABASE_SERVICE_ROLE_KEY,
      'CRM (CRM_SUPABASE_URL / CRM_SUPABASE_SERVICE_ROLE_KEY)',
    )
  }
  return _crm
}

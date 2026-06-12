// src/lib/supabase/admin.ts
// Service-role client.  NEVER import this in Client Components or expose to
// the browser.  The 'server-only' package will throw a build error if you do.

import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  }
)

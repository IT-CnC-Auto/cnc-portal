// lib/auth/roles.ts
// Server-side role helpers. Use in API routes, layouts, and server components.
// These read from the authenticated user's session via cookies.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { AppRole, AppDepartment } from '@/types/roles'

// Creates a server-side Supabase client scoped to the current request cookies
function getServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Returns the authenticated user's ID, or null if not logged in
export async function getAuthUserId(): Promise<string | null> {
  const supabase = getServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

// Returns the role of the authenticated user
export async function getCurrentUserRole(): Promise<AppRole | null> {
  const userId = await getAuthUserId()
  if (!userId) return null

  const supabase = getServerClient()
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()

  return (data?.role as AppRole) ?? null
}

// Returns the department of the authenticated user
export async function getCurrentUserDepartment(): Promise<AppDepartment | null> {
  const userId = await getAuthUserId()
  if (!userId) return null

  const supabase = getServerClient()
  const { data } = await supabase
    .from('user_roles')
    .select('department')
    .eq('user_id', userId)
    .single()

  return (data?.department as AppDepartment) ?? null
}

// True if the authenticated user is owner or administrator
export async function isAdminOrOwner(): Promise<boolean> {
  const role = await getCurrentUserRole()
  return role === 'owner' || role === 'administrator'
}

// True if the authenticated user is the owner
export async function isOwner(): Promise<boolean> {
  const role = await getCurrentUserRole()
  return role === 'owner'
}

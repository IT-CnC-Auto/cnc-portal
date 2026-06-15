'use server'
// src/app/(portal)/admin/members/actions.ts
// All mutations for the team management page.
// Every action re-verifies the caller is admin/owner server-side.

import { revalidatePath }   from 'next/cache'
import { createClient }     from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { InviteMemberInput, UpdateRoleInput } from '@/types/members'

// ── Guard helper ──────────────────────────────────────────────

async function assertAdminOrOwner(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated.')

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!data || !['owner', 'administrator'].includes(data.role)) {
    throw new Error('Not authorised.')
  }
  return user.id
}


// ── Invite a new member ───────────────────────────────────────

export async function inviteMember(input: InviteMemberInput) {
  try {
    const callerId = await assertAdminOrOwner()

    const { data: inviteData, error: inviteErr } =
      await getSupabaseAdmin().auth.admin.inviteUserByEmail(input.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback?next=/accept-invite`,
        data: { full_name: input.full_name },
      })

    if (inviteErr) return { error: inviteErr.message }

    const newId = inviteData.user.id

    const { error: profileErr } = await getSupabaseAdmin()
      .from('user_profiles')
      .insert({
        id:         newId,
        full_name:  input.full_name,
        email:      input.email,
        job_title:  input.job_title || null,
        is_active:  true,
        invited_by: callerId,
      })

    if (profileErr) return { error: profileErr.message }

    const { error: roleErr } = await getSupabaseAdmin()
      .from('user_roles')
      .insert({
        user_id:     newId,
        role:        input.role,
        department:  input.department ?? null,
        assigned_by: callerId,
      })

    if (roleErr) return { error: roleErr.message }

    revalidatePath('/admin/members')
    return { success: true }

  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Something went wrong.' }
  }
}


// ── Resend invite email ───────────────────────────────────────

export async function resendInvite(email: string) {
  try {
    await assertAdminOrOwner()

    const { error } = await getSupabaseAdmin().auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback?next=/accept-invite`,
    })

    if (error) return { error: error.message }
    return { success: true }

  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Something went wrong.' }
  }
}


// ── Update role / department ──────────────────────────────────

export async function updateMemberRole(input: UpdateRoleInput) {
  try {
    const callerId = await assertAdminOrOwner()

    const { error } = await getSupabaseAdmin()
      .from('user_roles')
      .update({
        role:        input.role,
        department:  input.department ?? null,
        assigned_by: callerId,
      })
      .eq('user_id', input.user_id)

    if (error) return { error: error.message }

    revalidatePath('/admin/members')
    return { success: true }

  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Something went wrong.' }
  }
}


// ── Activate / deactivate ─────────────────────────────────────

export async function setMemberActive(userId: string, isActive: boolean) {
  try {
    const callerId = await assertAdminOrOwner()

    if (userId === callerId) {
      return { error: 'You cannot deactivate your own account.' }
    }

    const { data: targetRole } = await getSupabaseAdmin()
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (targetRole?.role === 'owner') {
      return { error: 'The owner account cannot be deactivated.' }
    }

    const { error } = await getSupabaseAdmin()
      .from('user_profiles')
      .update({ is_active: isActive })
      .eq('id', userId)

    if (error) return { error: error.message }

    revalidatePath('/admin/members')
    return { success: true }

  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Something went wrong.' }
  }
}

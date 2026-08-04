'use server'
// src/app/(portal)/admin/members/actions.ts
// All mutations for the team management page.
// Every action re-verifies the caller is admin/owner server-side.

import { revalidatePath }   from 'next/cache'
import { createClient }     from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { AppRole, InviteMemberInput, UpdateRoleInput } from '@/types/members'

// ── Guard helper ──────────────────────────────────────────────

async function assertAdminOrOwner(): Promise<{ id: string; role: 'owner' | 'administrator' }> {
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
  return { id: user.id, role: data.role as 'owner' | 'administrator' }
}


// ── Invite a new member ───────────────────────────────────────

export async function inviteMember(input: InviteMemberInput) {
  try {
    const caller = await assertAdminOrOwner()

    // Only an owner may create another owner-tier account. The input type
    // already excludes 'owner', but a server action is callable outside the
    // UI, so the runtime check stays — hence the widening cast.
    if ((input.role as AppRole) === 'owner' && caller.role !== 'owner') {
      return { error: 'Only an owner can grant the owner role.' }
    }

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
        invited_by: caller.id,
      })

    if (profileErr) return { error: profileErr.message }

    const { error: roleErr } = await getSupabaseAdmin()
      .from('user_roles')
      .insert({
        user_id:     newId,
        role:        input.role,
        department:  input.department ?? null,
        assigned_by: caller.id,
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
    const caller = await assertAdminOrOwner()

    // Mirrors the deactivate/remove self-guards: prevents accidentally
    // demoting yourself out of your own tier.
    if (input.user_id === caller.id) {
      return { error: 'You cannot change your own role.' }
    }

    const { data: targetRole } = await getSupabaseAdmin()
      .from('user_roles')
      .select('role')
      .eq('user_id', input.user_id)
      .maybeSingle()

    // Owner accounts are protected from deactivation and removal; without
    // this guard an administrator could demote an owner first and then
    // remove them, bypassing that protection entirely.
    if (targetRole?.role === 'owner' && caller.role !== 'owner') {
      return { error: "Only an owner can change another owner's role." }
    }
    if ((input.role as AppRole) === 'owner' && caller.role !== 'owner') {
      return { error: 'Only an owner can grant the owner role.' }
    }

    const { error } = await getSupabaseAdmin()
      .from('user_roles')
      .update({
        role:        input.role,
        department:  input.department ?? null,
        assigned_by: caller.id,
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
    const caller = await assertAdminOrOwner()

    if (userId === caller.id) {
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


// ── Permanently remove a member ───────────────────────────────

export async function removeMember(userId: string) {
  try {
    const caller = await assertAdminOrOwner()

    if (userId === caller.id) {
      return { error: 'You cannot remove your own account.' }
    }

    const admin = getSupabaseAdmin()

    // A half-activated invite may have no user_roles row — maybeSingle
    const { data: targetRole } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle()

    if (targetRole?.role === 'owner') {
      return { error: 'The owner account cannot be removed.' }
    }

    // Detach references the target holds in other members' rows so they
    // cannot block the deletes below.
    await admin.from('user_profiles').update({ invited_by: null }).eq('invited_by', userId)
    await admin.from('user_roles').update({ assigned_by: null }).eq('assigned_by', userId)

    // Children first — user_roles and user_profiles FK-reference auth.users
    const { error: roleErr } = await admin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (roleErr) return { error: `Failed to delete role record: ${roleErr.message}` }

    const { error: profileErr } = await admin
      .from('user_profiles')
      .delete()
      .eq('id', userId)

    if (profileErr) return { error: `Failed to delete profile: ${profileErr.message}` }

    const { error: authErr } = await admin.auth.admin.deleteUser(userId)

    if (authErr) {
      return {
        error: `Profile removed but auth user deletion failed: ${authErr.message}. Delete the auth user manually in the Supabase dashboard.`,
      }
    }

    revalidatePath('/admin/members')
    return { success: true }

  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Something went wrong.' }
  }
}

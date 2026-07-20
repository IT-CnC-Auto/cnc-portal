
// ── Permanently remove a member ───────────────────────────────

export async function removeMember(userId: string) {
  try {
    const callerId = await assertAdminOrOwner()

    if (userId === callerId) {
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

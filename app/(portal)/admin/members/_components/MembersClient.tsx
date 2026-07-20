'use client'
// src/app/(portal)/admin/members/_components/MembersClient.tsx

import { useState, useTransition, useRef, useEffect } from 'react'
import type { TeamMember, AppDepartment, InviteMemberInput, UpdateRoleInput } from '@/types/members'
import { getMemberStatus, DEPARTMENT_LABELS, ROLE_LABELS, DEPARTMENTS } from '@/types/members'
import { inviteMember, resendInvite, updateMemberRole, setMemberActive, removeMember } from '../actions'

// ── Utilities ─────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  active:   { backgroundColor: '#dcfce7', color: '#166534' },
  invited:  { backgroundColor: '#fef9c3', color: '#854d0e' },
  inactive: { backgroundColor: '#f3f4f6', color: '#6b7280' },
}

const ROLE_STYLES: Record<string, React.CSSProperties> = {
  owner:             { backgroundColor: '#fee2e2', color: '#991b1b' },
  administrator:     { backgroundColor: '#ffedd5', color: '#9a3412' },
  department_member: { backgroundColor: '#f3f4f6', color: '#374151' },
}

// ── Toast ─────────────────────────────────────────────────────

interface Toast { type: 'success' | 'error'; text: string }

function ToastNotice({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      padding: '12px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      backgroundColor: toast.type === 'success' ? '#166534' : '#991b1b',
      color: 'white', fontFamily: 'Arial, sans-serif', fontSize: '14px', maxWidth: '340px',
    }}>
      {toast.text}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '8px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '16px', margin: 0, color: '#111827' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '20px', lineHeight: 1, padding: '2px' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

// ── Field helpers ─────────────────────────────────────────────

const F_LABEL: React.CSSProperties = { display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px', marginTop: '16px' }
const F_INPUT: React.CSSProperties = { display: 'block', width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }
const F_SELECT: React.CSSProperties = { ...F_INPUT, backgroundColor: 'white' }

// ── Main component ────────────────────────────────────────────

interface Props {
  members:         TeamMember[]
  currentUserId:   string
  currentUserRole: string
}

export default function MembersClient({ members, currentUserId, currentUserRole }: Props) {
  const [isPending, startTransition] = useTransition()
  const [toast,     setToast]        = useState<Toast | null>(null)
  const [openMenu,  setOpenMenu]     = useState<string | null>(null)

  // Invite modal
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState<InviteMemberInput>({
    full_name: '', email: '', job_title: '', role: 'department_member', department: null,
  })
  const [inviteError, setInviteError] = useState('')

  // Edit role modal
  const [editMember,  setEditMember]  = useState<TeamMember | null>(null)
  const [editRole,    setEditRole]    = useState<'administrator' | 'department_member'>('department_member')
  const [editDept,    setEditDept]    = useState<AppDepartment | null>(null)
  const [editError,   setEditError]   = useState('')

  // Confirm deactivate
  const [confirmMember, setConfirmMember] = useState<TeamMember | null>(null)

  // Confirm permanent removal (requires typing the member's name)
  const [removeTarget,      setRemoveTarget]      = useState<TeamMember | null>(null)
  const [removeConfirmText, setRemoveConfirmText] = useState('')

  const removeNameMatches =
    removeTarget !== null &&
    removeConfirmText.trim().toLowerCase() === removeTarget.full_name.trim().toLowerCase()

  const menuRef = useRef<HTMLDivElement>(null)

  // Close action menu when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toast_(type: Toast['type'], text: string) {
    setToast({ type, text })
  }

  // ── Invite submit ──────────────────────────────────────────

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError('')
    if (inviteForm.role === 'department_member' && !inviteForm.department) {
      setInviteError('Department is required for members.')
      return
    }
    startTransition(async () => {
      const res = await inviteMember(inviteForm)
      if (res.error) { setInviteError(res.error); return }
      setInviteOpen(false)
      setInviteForm({ full_name: '', email: '', job_title: '', role: 'department_member', department: null })
      toast_('success', `Invite sent to ${inviteForm.email}`)
    })
  }

  // ── Resend invite ──────────────────────────────────────────

  function handleResend(email: string) {
    setOpenMenu(null)
    startTransition(async () => {
      const res = await resendInvite(email)
      res.error ? toast_('error', res.error) : toast_('success', `Invite resent to ${email}`)
    })
  }

  // ── Edit role submit ───────────────────────────────────────

  async function handleEditRole(e: React.FormEvent) {
    e.preventDefault()
    if (!editMember) return
    setEditError('')
    if (editRole === 'department_member' && !editDept) {
      setEditError('Department is required for members.')
      return
    }
    const input: UpdateRoleInput = { user_id: editMember.id, role: editRole, department: editDept }
    startTransition(async () => {
      const res = await updateMemberRole(input)
      if (res.error) { setEditError(res.error); return }
      setEditMember(null)
      toast_('success', 'Role updated.')
    })
  }

  // ── Toggle active ──────────────────────────────────────────

  function handleToggleActive() {
    if (!confirmMember) return
    const next = !confirmMember.is_active
    setConfirmMember(null)
    startTransition(async () => {
      const res = await setMemberActive(confirmMember.id, next)
      res.error
        ? toast_('error', res.error)
        : toast_('success', next ? 'Account reactivated.' : 'Account deactivated.')
    })
  }

  // ── Permanently remove ─────────────────────────────────────

  function handleRemove() {
    if (!removeTarget) return
    const target = removeTarget
    setRemoveTarget(null)
    setRemoveConfirmText('')
    startTransition(async () => {
      const res = await removeMember(target.id)
      res.error
        ? toast_('error', res.error)
        : toast_('success', `${target.full_name} has been removed.`)
    })
  }

  // ── Open edit modal ────────────────────────────────────────

  function openEdit(m: TeamMember) {
    setOpenMenu(null)
    setEditMember(m)
    setEditRole(m.role === 'owner' ? 'administrator' : m.role as 'administrator' | 'department_member')
    setEditDept(m.department)
    setEditError('')
  }

  // ─────────────────────────────────────────────────────────────

  return (
    <>
      {toast && <ToastNotice toast={toast} onDismiss={() => setToast(null)} />}

      {/* ── Page header ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '22px', color: '#111827', margin: '0 0 4px' }}>
            Team
          </h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          style={{ padding: '9px 18px', backgroundColor: '#ED1B24', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}
        >
          + Invite member
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              {['Member', 'Job title', 'Role', 'Department', 'Status', 'Last sign-in', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => {
              const status = getMemberStatus(m)
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {/* Member */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Avatar */}
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ED1B24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                        {initials(m.full_name)}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                          {m.full_name}
                          {m.id === currentUserId && (
                            <span style={{ marginLeft: '6px', fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}>you</span>
                          )}
                        </div>
                        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#6b7280' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Job title */}
                  <td style={{ padding: '14px 16px', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#374151' }}>
                    {m.job_title ?? <span style={{ color: '#d1d5db' }}>—</span>}
                  </td>

                  {/* Role badge */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontFamily: 'Arial, sans-serif', fontWeight: 600, ...ROLE_STYLES[m.role] }}>
                      {ROLE_LABELS[m.role]}
                    </span>
                  </td>

                  {/* Department */}
                  <td style={{ padding: '14px 16px', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#374151' }}>
                    {m.department ? DEPARTMENT_LABELS[m.department] : <span style={{ color: '#d1d5db' }}>—</span>}
                  </td>

                  {/* Status badge */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontFamily: 'Arial, sans-serif', fontWeight: 600, ...STATUS_STYLES[status] }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>

                  {/* Last sign-in */}
                  <td style={{ padding: '14px 16px', fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {formatDate(m.last_sign_in_at)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right', position: 'relative' }}>
                    {/* Only admins/owners can act, and not on the owner account (unless you're the owner) */}
                    {(currentUserRole === 'owner' || (m.role !== 'owner')) && m.id !== currentUserId && (
                      <div style={{ position: 'relative', display: 'inline-block' }} ref={openMenu === m.id ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                          style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '18px', color: '#6b7280', lineHeight: 1 }}
                        >
                          ···
                        </button>
                        {openMenu === m.id && (
                          <div style={{ position: 'absolute', right: 0, top: '32px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, minWidth: '160px', overflow: 'hidden' }}>
                            <button style={menuItem} onClick={() => openEdit(m)}>
                              Edit role
                            </button>
                            {status === 'invited' && (
                              <button style={menuItem} onClick={() => handleResend(m.email)}>
                                Resend invite
                              </button>
                            )}
                            <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '2px 0' }} />
                            <button
                              style={{ ...menuItem, color: m.is_active ? '#dc2626' : '#16a34a' }}
                              onClick={() => { setOpenMenu(null); setConfirmMember(m) }}
                            >
                              {m.is_active ? 'Deactivate' : 'Reactivate'}
                            </button>
                            {m.role !== 'owner' && (
                              <button
                                style={{ ...menuItem, color: '#991b1b', fontWeight: 600 }}
                                onClick={() => { setOpenMenu(null); setRemoveConfirmText(''); setRemoveTarget(m) }}
                              >
                                Remove member…
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {members.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#9ca3af' }}>
            No members yet. Invite your first team member.
          </div>
        )}
      </div>

      {/* ── Invite modal ─────────────────────────────────────── */}
      {inviteOpen && (
        <Modal title="Invite team member" onClose={() => { setInviteOpen(false); setInviteError('') }}>
          <form onSubmit={handleInvite}>
            <label style={{ ...F_LABEL, marginTop: 0 }}>Full name <span style={{ color: '#ED1B24' }}>*</span></label>
            <input style={F_INPUT} type="text" required value={inviteForm.full_name}
              onChange={e => setInviteForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Thandi Nkosi" />

            <label style={F_LABEL}>Email address <span style={{ color: '#ED1B24' }}>*</span></label>
            <input style={F_INPUT} type="email" required value={inviteForm.email}
              onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} placeholder="thandi@carenetconsultants.co.za" />

            <label style={F_LABEL}>Job title</label>
            <input style={F_INPUT} type="text" value={inviteForm.job_title}
              onChange={e => setInviteForm(f => ({ ...f, job_title: e.target.value }))} placeholder="Optional" />

            <label style={F_LABEL}>Role <span style={{ color: '#ED1B24' }}>*</span></label>
            <select style={F_SELECT} value={inviteForm.role}
              onChange={e => setInviteForm(f => ({ ...f, role: e.target.value as 'administrator' | 'department_member', department: null }))}>
              <option value="department_member">Member</option>
              <option value="administrator">Administrator</option>
            </select>

            {inviteForm.role === 'department_member' && (
              <>
                <label style={F_LABEL}>Department <span style={{ color: '#ED1B24' }}>*</span></label>
                <select style={F_SELECT} value={inviteForm.department ?? ''}
                  onChange={e => setInviteForm(f => ({ ...f, department: e.target.value as AppDepartment || null }))}>
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{DEPARTMENT_LABELS[d]}</option>)}
                </select>
              </>
            )}

            {inviteForm.role === 'administrator' && (
              <>
                <label style={F_LABEL}>Department (optional)</label>
                <select style={F_SELECT} value={inviteForm.department ?? ''}
                  onChange={e => setInviteForm(f => ({ ...f, department: e.target.value as AppDepartment || null }))}>
                  <option value="">None</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{DEPARTMENT_LABELS[d]}</option>)}
                </select>
              </>
            )}

            {inviteError && <p style={{ color: '#dc2626', fontSize: '13px', fontFamily: 'Arial, sans-serif', marginTop: '12px' }}>{inviteError}</p>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => { setInviteOpen(false); setInviteError('') }}
                style={{ flex: 1, padding: '9px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', color: '#374151' }}>
                Cancel
              </button>
              <button type="submit" disabled={isPending}
                style={{ flex: 1, padding: '9px', backgroundColor: isPending ? '#9ca3af' : '#ED1B24', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: 'Arial, sans-serif', cursor: isPending ? 'not-allowed' : 'pointer' }}>
                {isPending ? 'Sending…' : 'Send invite'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit role modal ──────────────────────────────────── */}
      {editMember && (
        <Modal title={`Edit — ${editMember.full_name}`} onClose={() => setEditMember(null)}>
          <form onSubmit={handleEditRole}>
            <label style={{ ...F_LABEL, marginTop: 0 }}>Role <span style={{ color: '#ED1B24' }}>*</span></label>
            <select style={F_SELECT} value={editRole}
              onChange={e => setEditRole(e.target.value as typeof editRole)}>
              <option value="department_member">Member</option>
              <option value="administrator">Administrator</option>
            </select>

            <label style={F_LABEL}>
              Department {editRole === 'department_member' && <span style={{ color: '#ED1B24' }}>*</span>}
            </label>
            <select style={F_SELECT} value={editDept ?? ''}
              onChange={e => setEditDept(e.target.value as AppDepartment || null)}>
              <option value="">None</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{DEPARTMENT_LABELS[d]}</option>)}
            </select>

            {editError && <p style={{ color: '#dc2626', fontSize: '13px', fontFamily: 'Arial, sans-serif', marginTop: '12px' }}>{editError}</p>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => setEditMember(null)}
                style={{ flex: 1, padding: '9px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', color: '#374151' }}>
                Cancel
              </button>
              <button type="submit" disabled={isPending}
                style={{ flex: 1, padding: '9px', backgroundColor: isPending ? '#9ca3af' : '#ED1B24', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: 'Arial, sans-serif', cursor: isPending ? 'not-allowed' : 'pointer' }}>
                {isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Confirm deactivate / reactivate ─────────────────── */}
      {confirmMember && (
        <Modal
          title={confirmMember.is_active ? 'Deactivate account' : 'Reactivate account'}
          onClose={() => setConfirmMember(null)}
        >
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#374151', margin: '0 0 24px' }}>
            {confirmMember.is_active
              ? `${confirmMember.full_name} will lose portal access immediately. You can reactivate them at any time.`
              : `${confirmMember.full_name} will regain portal access.`
            }
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setConfirmMember(null)}
              style={{ flex: 1, padding: '9px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', color: '#374151' }}>
              Cancel
            </button>
            <button onClick={handleToggleActive} disabled={isPending}
              style={{ flex: 1, padding: '9px', backgroundColor: confirmMember.is_active ? '#dc2626' : '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}>
              {confirmMember.is_active ? 'Deactivate' : 'Reactivate'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Confirm permanent removal ────────────────────────── */}
      {removeTarget && (
        <Modal title="Remove member" onClose={() => { setRemoveTarget(null); setRemoveConfirmText('') }}>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#374151', margin: '0 0 8px' }}>
            This permanently deletes <strong>{removeTarget.full_name}</strong> ({removeTarget.email}) —
            their sign-in, profile, and role. It cannot be undone.
          </p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
            If they may return, use <strong>Deactivate</strong> instead. To confirm removal, type the
            member&apos;s full name below.
          </p>
          <input
            style={F_INPUT}
            type="text"
            value={removeConfirmText}
            onChange={e => setRemoveConfirmText(e.target.value)}
            placeholder={removeTarget.full_name}
          />
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => { setRemoveTarget(null); setRemoveConfirmText('') }}
              style={{ flex: 1, padding: '9px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', color: '#374151' }}>
              Cancel
            </button>
            <button onClick={handleRemove} disabled={isPending || !removeNameMatches}
              style={{ flex: 1, padding: '9px', backgroundColor: (isPending || !removeNameMatches) ? '#9ca3af' : '#991b1b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: 'Arial, sans-serif', cursor: (isPending || !removeNameMatches) ? 'not-allowed' : 'pointer' }}>
              Remove permanently
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

const menuItem: React.CSSProperties = {
  display: 'block', width: '100%', padding: '9px 16px', textAlign: 'left',
  background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
  fontFamily: 'Arial, sans-serif', color: '#374151',
}

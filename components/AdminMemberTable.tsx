'use client'

// components/AdminMemberTable.tsx
// Displays all portal members with role/department badges and action controls.
// Handles deactivate, reactivate, resend invite, and links to edit page.

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MemberRecord, AppDepartment, AppRole } from '@/types/roles'
import { DEPARTMENT_LABELS, ROLE_LABELS } from '@/types/roles'

const ROLE_COLOURS: Record<AppRole, string> = {
  owner: 'bg-red-100 text-red-800',
  administrator: 'bg-orange-100 text-orange-800',
  department_member: 'bg-gray-100 text-gray-700',
}

interface Props {
  members: MemberRecord[]
  callerIsOwner: boolean
}

export default function AdminMemberTable({ members, callerIsOwner }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null) // tracks which member is being actioned
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active')

  const visible = members.filter(m => {
    if (filter === 'active') return m.is_active
    if (filter === 'inactive') return !m.is_active
    return true
  })

  async function handleResendInvite(userId: string) {
    setLoading(userId)
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      })
      if (!res.ok) throw new Error('Resend failed')
      alert('Invite resent.')
    } catch {
      alert('Failed to resend invite.')
    } finally {
      setLoading(null)
    }
  }

  async function handleToggleActive(member: MemberRecord) {
    setLoading(member.id)
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !member.is_active }),
      })
      if (!res.ok) throw new Error('Update failed')
      router.refresh()
    } catch {
      alert('Failed to update member.')
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete(member: MemberRecord) {
    if (!callerIsOwner) return
    if (!confirm(`Permanently delete ${member.full_name}? This cannot be undone.`)) return
    setLoading(member.id)
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Delete failed')
      router.refresh()
    } catch {
      alert('Failed to delete member.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex gap-2 text-sm">
        {(['active', 'inactive', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1 border transition-colors ${
              filter === f
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Department</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No members found.
                </td>
              </tr>
            )}
            {visible.map(member => (
              <tr key={member.id} className={!member.is_active ? 'opacity-50' : ''}>
                <td className="px-4 py-3 font-medium text-black">{member.full_name}</td>
                <td className="px-4 py-3 text-gray-600">{member.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLOURS[member.role]}`}>
                    {ROLE_LABELS[member.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {member.department
                    ? DEPARTMENT_LABELS[member.department as AppDepartment]
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${member.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/members/${member.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleResendInvite(member.id)}
                      disabled={loading === member.id}
                      className="text-xs text-gray-500 hover:text-black disabled:opacity-40"
                    >
                      Resend invite
                    </button>
                    <button
                      onClick={() => handleToggleActive(member)}
                      disabled={loading === member.id}
                      className="text-xs text-orange-600 hover:text-orange-800 disabled:opacity-40"
                    >
                      {member.is_active ? 'Deactivate' : 'Reactivate'}
                    </button>
                    {callerIsOwner && (
                      <button
                        onClick={() => handleDelete(member)}
                        disabled={loading === member.id}
                        className="text-xs text-red-600 hover:text-red-800 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

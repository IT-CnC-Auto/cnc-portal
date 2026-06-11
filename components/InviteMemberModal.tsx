'use client'

// components/InviteMemberModal.tsx
// Form modal for inviting a new portal member.
// Calls POST /api/admin/invite.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AppRole, AppDepartment } from '@/types/roles'
import { ROLE_LABELS, DEPARTMENT_LABELS } from '@/types/roles'

const INVITABLE_ROLES: AppRole[] = ['administrator', 'department_member']

interface Props {
  callerIsOwner: boolean
}

export default function InviteMemberModal({ callerIsOwner }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<{
    full_name: string
    email: string
    role: AppRole
    department: AppDepartment | ''
  }>({
    full_name: '',
    email: '',
    role: 'department_member',
    department: '',
  })

  const availableRoles: AppRole[] = callerIsOwner
    ? ['owner', 'administrator', 'department_member']
    : ['department_member']

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.full_name || !form.email || !form.role) {
      setError('Name, email and role are required.')
      return
    }
    if (form.role === 'department_member' && !form.department) {
      setError('Department is required for a department member.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          role: form.role,
          department: form.department || null,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Invite failed.')
        return
      }

      // Success
      setOpen(false)
      setForm({ full_name: '', email: '', role: 'department_member', department: '' })
      router.refresh()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#ED1B24' }}
      >
        + Invite member
      </button>

      {/* Modal backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-lg font-bold text-black"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Invite a new member
              </h2>
              <button
                onClick={() => { setOpen(false); setError(null) }}
                className="text-gray-400 hover:text-black text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Jane Smith"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="jane@carenetconsultants.co.za"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {availableRoles.map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>

              {/* Department (only visible for department_member) */}
              {form.role === 'department_member' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select department</option>
                    {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              {/* POPIA notice */}
              <p className="text-xs text-gray-400">
                Personal details are stored in accordance with POPIA Act 4 of 2013.
                An invite email with a password setup link will be sent to the address above.
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setOpen(false); setError(null) }}
                  className="rounded-md px-4 py-2 text-sm text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#ED1B24' }}
                >
                  {submitting ? 'Sending…' : 'Send invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

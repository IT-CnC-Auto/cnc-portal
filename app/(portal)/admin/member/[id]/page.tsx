'use client'

// app/(portal)/admin/members/[id]/page.tsx
// Force dynamic — this page fetches live member data and cannot be statically generated.
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import type { MemberRecord, AppRole, AppDepartment } from '@/types/roles'
import { ROLE_LABELS, DEPARTMENT_LABELS } from '@/types/roles'

export default function EditMemberPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [member, setMember] = useState<MemberRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    role: 'department_member' as AppRole,
    department: '' as AppDepartment | '',
    is_active: true,
  })

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/members')
      if (!res.ok) { setLoading(false); return }
      const { members } = await res.json()
      const found: MemberRecord = members.find((m: MemberRecord) => m.id === id)
      if (found) {
        setMember(found)
        setForm({
          full_name: found.full_name,
          role: found.role,
          department: found.department ?? '',
          is_active: found.is_active,
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }))
    setError(null)
    setSuccess(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (form.role === 'department_member' && !form.department) {
      setError('Department is required for a department member.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          role: form.role,
          department: form.department || null,
          is_active: form.is_active,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Update failed.')
        return
      }
      setSuccess(true)
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>
  if (!member) return <p className="text-sm text-red-600">Member not found.</p>

  return (
    <div className="max-w-md space-y-6">
      <Link
        href="/admin/members"
        className="text-sm text-gray-500 hover:text-black"
      >
        ← Back to members
      </Link>

      <div>
        <h2
          className="text-xl font-bold text-black"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Edit member
        </h2>
        <p className="text-sm text-gray-500">{member.email}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
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
          />
        </div>

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
            {(Object.keys(ROLE_LABELS) as AppRole[]).map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>

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

        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 accent-red-600"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            Active (can log in to the portal)
          </label>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {success && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Member updated successfully.
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#ED1B24' }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <Link
            href="/admin/members"
            className="rounded-md px-4 py-2 text-sm text-gray-600 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

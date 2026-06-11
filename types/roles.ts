// types/roles.ts
// Mirrors the enums and tables defined in the Supabase migrations

export type AppRole = 'owner' | 'administrator' | 'department_member'

export type AppDepartment =
  | 'directors'
  | 'operations'
  | 'finance'
  | 'sales'
  | 'corporate_governance'
  | 'hr_and_people'
  | 'it_and_ai'
  | 'marketing'

// Display labels for use in UI dropdowns and tables
export const DEPARTMENT_LABELS: Record<AppDepartment, string> = {
  directors: 'Directors',
  operations: 'Operations',
  finance: 'Finance',
  sales: 'Sales',
  corporate_governance: 'Corporate Governance',
  hr_and_people: 'HR & People',
  it_and_ai: 'IT & AI',
  marketing: 'Marketing',
}

export const ROLE_LABELS: Record<AppRole, string> = {
  owner: 'Owner',
  administrator: 'Administrator',
  department_member: 'Department Member',
}

export interface UserProfile {
  id: string
  full_name: string
  email: string
  photo_path: string | null
  personal_details: Record<string, unknown>
  is_active: boolean
  invited_by: string | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: AppRole
  department: AppDepartment | null
  assigned_by: string | null
  assigned_at: string
  updated_at: string
}

// Joined type used in the admin member list
export interface MemberRecord {
  id: string
  full_name: string
  email: string
  photo_path: string | null
  is_active: boolean
  role: AppRole
  department: AppDepartment | null
  created_at: string
}

// Payload for the invite API route
export interface InviteMemberPayload {
  email: string
  full_name: string
  role: AppRole
  department: AppDepartment | null
}

// Payload for the update member API route
export interface UpdateMemberPayload {
  full_name?: string
  role?: AppRole
  department?: AppDepartment | null
  is_active?: boolean
}

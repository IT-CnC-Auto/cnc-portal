// src/types/members.ts

export type AppRole       = 'owner' | 'administrator' | 'department_member'
export type AppDepartment =
  | 'directors'
  | 'operations'
  | 'finance'
  | 'sales'
  | 'corporate_governance'
  | 'hr_and_people'
  | 'it_and_ai'
  | 'marketing'
export type MemberStatus = 'active' | 'invited' | 'inactive'

export const ROLE_LABELS: Record<AppRole, string> = {
  owner:             'Owner',
  administrator:     'Administrator',
  department_member: 'Member',
}

export const DEPARTMENT_LABELS: Record<AppDepartment, string> = {
  directors:            'Directors',
  operations:           'Operations',
  finance:              'Finance',
  sales:                'Sales',
  corporate_governance: 'Corporate Governance',
  hr_and_people:        'HR & People',
  it_and_ai:            'IT & AI',
  marketing:            'Marketing',
}

export const DEPARTMENTS = Object.keys(DEPARTMENT_LABELS) as AppDepartment[]

export interface TeamMember {
  id:                 string
  full_name:          string
  email:              string
  photo_path:         string | null
  job_title:          string | null
  mfa_enrolled:       boolean
  is_active:          boolean
  invited_by:         string | null
  created_at:         string
  // from user_roles join
  role:               AppRole
  department:         AppDepartment | null
  // from auth.users via admin API
  last_sign_in_at:    string | null
  email_confirmed_at: string | null
}

export function getMemberStatus(m: TeamMember): MemberStatus {
  if (!m.is_active)          return 'inactive'
  if (!m.email_confirmed_at) return 'invited'
  return 'active'
}

export interface InviteMemberInput {
  full_name:  string
  email:      string
  job_title:  string
  role:       'administrator' | 'department_member'
  department: AppDepartment | null
}

export interface UpdateRoleInput {
  user_id:    string
  role:       'administrator' | 'department_member'
  department: AppDepartment | null
}

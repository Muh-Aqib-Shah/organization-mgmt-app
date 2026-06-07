export type MemberStatus = 'active' | 'invited';
export type MemberRole = 'owner' | 'admin' | 'member';
export type OrgType = 'nonprofit' | 'school' | 'business';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  created_by: string;
  created_at: string;
  school_district: string | null;
}
export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string | null;
  email: string;     
  status: MemberStatus;
  role: MemberRole;
  invited_at: string;
  joined_at: string | null;
}
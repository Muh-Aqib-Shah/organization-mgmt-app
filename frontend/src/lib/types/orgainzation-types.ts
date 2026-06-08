export type MemberStatus = 'active' | 'invited';
export type MemberRole = 'owner' | 'admin' | 'member';
export type OrgType = 'nonprofit' | 'school' | 'business';

export interface OrganizationType {
  id: string;
  name: string;
  type: OrgType;
  created_by: string;
  created_at: string;
  school_district: string | null;
}
export interface OrganizationMemberType {
  id: string;
  organization_id: string;
  user_id: string | null;
  email: string;
  status: MemberStatus;
  role: MemberRole;
  invited_at: string;
  joined_at: string | null;
}

export type CreateOrganizationInputType = Omit<
  OrganizationType,
  'id' | 'created_by' | 'created_at'
>;

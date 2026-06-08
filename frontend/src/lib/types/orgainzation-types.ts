import z from 'zod';

export type MemberStatus = 'active' | 'invited';
export type MemberRole = 'owner' | 'admin' | 'member';
export type OrgType = 'nonprofit' | 'school' | 'business';

export interface OrganizationType {
  id: string;
  name: string;
  type: OrgType;
  created_by?: string;
  created_at: string;
  school_district?: string | null;
  member_count?: number;
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

export const organizationFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: 'Organization name must be at least 2 characters.',
  }),
  organizationType: z.enum(['school', 'nonprofit', 'business']),
  schoolDistrict: z.string().nullable().optional(),
});

export type OrganizationFormType = z.infer<typeof organizationFormSchema>;

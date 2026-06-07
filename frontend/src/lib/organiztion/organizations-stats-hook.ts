import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface OrganizationListItem {
  id: string;
  name: string;
  type: 'school' | 'nonprofit' | 'business';
  created_at: string;
  member_count: number;
}

export const getOrganizations = async (): Promise<OrganizationListItem[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select(
      `
      id,
      name,
      type,
      created_at,
      organization_members(count)
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    data?.map((org) => ({
      id: org.id,
      name: org.name,
      type: org.type,
      created_at: org.created_at,
      member_count: org.organization_members?.[0]?.count ?? 0,
    })) ?? []
  );
};

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: getOrganizations,
  });
};

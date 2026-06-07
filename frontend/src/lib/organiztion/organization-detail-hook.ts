import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

const getOrganization = async (orgId: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select(
      `
      *,
      organization_members(*)
    `,
    )
    .eq('id', orgId)
    .single();

  if (error) throw error;

  return data;
};

export const useOrganization = (orgId: string) => {
  return useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => getOrganization(orgId),
    enabled: !!orgId,
  });
};

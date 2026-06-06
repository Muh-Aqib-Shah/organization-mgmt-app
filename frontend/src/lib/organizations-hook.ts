import { useQuery } from '@tanstack/react-query';
import { getOrganizations } from './organization-stats';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: getOrganizations,
  });
};
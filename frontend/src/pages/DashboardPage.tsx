import { useAuthContext } from '@/lib/auth/auth-context';
import { useOrganizations } from '@/lib/organiztion/organizations-stats-hook';
import { MainBoard } from '@/components/dashboard/main-board';
import { OrganizationList } from '@/components/dashboard/organization-list';
import { CreateOrganizationDisplay } from '@/components/dashboard/create-organization';

export function DashboardPage() {
  const { user } = useAuthContext();

  const { data: organizations = [], isLoading, error } = useOrganizations();
  console.log(organizations);

  const totalMembers = organizations.reduce(
    (sum, org) => sum + org.member_count,
    0,
  );

  const firstName = user?.email?.split('@')[0] || 'User';
  const capitalizedName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading organizations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Failed to load organizations
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainBoard
          name={capitalizedName}
          organizations={organizations}
          totalMembers={totalMembers}
        />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <OrganizationList organizations={organizations} />

          <CreateOrganizationDisplay />
        </div>
      </main>
    </div>
  );
}

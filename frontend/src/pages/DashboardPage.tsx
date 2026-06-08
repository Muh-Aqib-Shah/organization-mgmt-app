import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Building2, Users } from 'lucide-react';
import { useAuthContext } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import mainStatsImage from '@/assets/main-stats.png';
import backSupportImage from '@/assets/back-support-image.png';
import { useOrganizations } from '@/lib/organiztion/organizations-stats-hook';
import { getOrgMeta } from '@/lib/organiztion/organization-meta';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const { data: organizations = [], isLoading, error } = useOrganizations();
  console.log(organizations);

  const totalMembers = organizations.reduce(
    (sum, org) => sum + org.member_count,
    0,
  );

  // Parse user name from email
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
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
                  Welcome back, {capitalizedName}! 👋
                </h2>
                <p className="text-slate-600 text-sm mb-8">
                  Manage your organizations or create a new one to get started.
                </p>
              </div>

              <div className="grid grid-cols-2 mt-4 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {organizations.length}
                      </p>
                      <p className="text-sm text-slate-600">Organizations</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {totalMembers}
                      </p>
                      <p className="text-sm text-slate-600">Team Members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <img
                src={mainStatsImage}
                alt="Organizations Stats"
                className="w-full h-auto max-w-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg text-start font-bold text-slate-900">
                    Your Organizations
                  </h3>
                  <p className="text-sm text-slate-600">
                    View and manage all your organizations
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-200">
                {organizations.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-slate-500">No organizations yet.</p>
                  </div>
                ) : (
                  organizations.map((org) => {
                    const meta = getOrgMeta(org.type);

                    return (
                      <div
                        key={org.id}
                        onClick={() => navigate(`/organization/${org.id}`)}
                        className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg ${meta.color} flex items-center justify-center text-xl shadow-sm`}
                          >
                            {meta.icon}
                          </div>

                          <div>
                            <p className="font-semibold text-start text-slate-900">
                              {org.name}
                            </p>

                            <p className="text-sm text-start text-slate-600">
                              {org.member_count}{' '}
                              {org.member_count === 1 ? 'member' : 'members'}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Create New Organization
                  </h3>
                </div>
                <p className="text-sm text-slate-600">
                  Start a new organization and invite your team.
                </p>
              </div>

              <div className="px-6 py-8 flex-1 flex flex-col items-center justify-center">
                <img
                  src={backSupportImage}
                  alt="Create Organization"
                  className="w-40 h-40 mb-6 object-contain"
                />
                <p className="text-center text-slate-600 mb-6 text-sm">
                  <span className="font-semibold text-slate-900">
                    Build something amazing
                  </span>
                  <br />
                  Create a new organization to collaborate with your team and
                  achieve more together.
                </p>
              </div>

              <div className="px-6 py-4 border-t border-slate-200">
                <Button
                  onClick={() => navigate('/organization/create')}
                  className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-11 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Organization
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

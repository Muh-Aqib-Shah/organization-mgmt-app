import { getOrgMeta } from '@/lib/organiztion/organization-meta';
import type { OrganizationType } from '@/lib/types/orgainzation-types';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrganizationListProps {
  organizations: OrganizationType[];
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
}) => {
  const navigate = useNavigate();

  return (
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
  );
};

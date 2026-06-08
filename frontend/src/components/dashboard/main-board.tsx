import { Building2, Users } from 'lucide-react';
import mainStatsImage from '@/assets/main-stats.png';

interface MainBoardProps {
  name: string;
  organizations: { length: number };
  totalMembers: number;
}

export const MainBoard: React.FC<MainBoardProps> = ({
  name,
  organizations,
  totalMembers,
}) => {
  return (
    <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden mb-12">
      <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              Welcome back, {name}! 👋
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
  );
};

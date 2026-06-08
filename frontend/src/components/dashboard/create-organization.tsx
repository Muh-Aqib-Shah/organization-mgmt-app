import { Plus } from 'lucide-react';
import backSupportImage from '@/assets/back-support-image.png';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export const CreateOrganizationDisplay = () => {
  const navigate = useNavigate();

  return (
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
            Create a new organization to collaborate with your team and achieve
            more together.
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
  );
};

import { ShieldCheck, Users2, Zap } from 'lucide-react';
import backSupportImage from '@/assets/backdrop.png';

export const DetailBanner = () => {
  return (
    <div className="w-full lg:w-90 shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col gap-6 lg:sticky lg:top-6">
      <div className="relative w-full aspect-4/3 bg-linear-to-br from-indigo-50 to-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] opacity-60" />
        <div className="px-6 py-8 flex-1 flex flex-col items-center justify-center">
          <img
            src={backSupportImage}
            alt="Create Organization"
            className="w-full h-full mb-6 object-contain max-h-40 lg:max-h-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 text-left">
        <div className="flex gap-3.5 items-start">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-600 stroke-2" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight">
              Secure & Private
            </h4>
            <p className="text-xs text-gray-400 font-medium leading-normal">
              Your organization data is completely encrypted, isolated, and
              safe.
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 items-start">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
            <Users2 className="w-4 h-4 text-emerald-600 stroke-2" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight">
              Invite Team Members
            </h4>
            <p className="text-xs text-gray-400 font-medium leading-normal">
              Add admins and manage precise role boundaries seamlessly.
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 items-start">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-amber-600 stroke-2" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight">
              Scalable & Flexible
            </h4>
            <p className="text-xs text-gray-400 font-medium leading-normal">
              Easily update settings, modify records, and scale structures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

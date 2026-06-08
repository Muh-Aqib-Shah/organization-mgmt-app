import { useAuthContext } from '@/lib/auth/auth-context';
import { Shield, ChevronRight } from 'lucide-react'; // Assuming lucide-react, change to your icon library if needed

export function Footer() {
  const { user, isAuthenticated } = useAuthContext();

  if (!user || !isAuthenticated) {
    return;
  }
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm max-w-5xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
          <Shield className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-green-700">
            Secure organization management
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            All member data is encrypted and secure. You can manage permissions
            and access at any time.
          </p>
        </div>
      </div>

      <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors shrink-0 self-end sm:self-center">
        Learn more
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

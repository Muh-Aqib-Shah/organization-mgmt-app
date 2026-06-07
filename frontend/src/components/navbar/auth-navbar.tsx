import { LogOut, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/lib/auth/auth-context';
import { useAuth } from '@/lib/auth/auth-hooks';
import { useNavigate } from 'react-router-dom';

export function NavBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const success = await signOut();
    if (success) navigate('/auth');
  };

  const firstName = user?.email?.split('@')[0] || 'User';
  const capitalizedName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  if (!user || !isAuthenticated) {
    return;
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            Organization Manager
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">Welcome back</p>
            <p className="text-sm font-semibold text-slate-900">
              {capitalizedName}
            </p>
          </div>
          <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {capitalizedName.charAt(0)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-slate-600 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

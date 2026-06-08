import { useNavigate } from 'react-router-dom';
import { Home, Building2 } from 'lucide-react';
import notFoundImg from '@/assets/not-found.png';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xl text-center space-y-8 animate-fade-in">
        <div className="relative flex justify-center w-full max-w-sm mx-auto">
          <img
            src={notFoundImg}
            alt="Page Not Found Illustration"
            className="w-full h-auto object-contain drop-shadow-xs"
            draggable={false}
          />
        </div>

        <div className="space-y-3 px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Oops! Page Not Found
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed font-medium">
            We can't seem to find the page you're looking for.{' '}
            <br className="hidden sm:inline" />
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto pt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto h-11 px-5 inline-flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 group shrink-0"
          >
            <Home className="w-4 h-4 text-white/90 group-hover:scale-105 transition-transform" />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/organizations')} // Agar route different hai toh update kar lein
            className="w-full sm:w-auto h-11 px-5 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 shadow-xs transition-all duration-200 group shrink-0"
          >
            <Building2 className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
            <span>View Organizations</span>
          </button>
        </div>
      </div>
    </div>
  );
}

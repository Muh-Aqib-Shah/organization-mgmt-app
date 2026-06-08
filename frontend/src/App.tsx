import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AuthProvider } from '@/lib/auth/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import './index.css';
import { OrgPage } from './pages/Organization';
import { NavBar } from './components/navbar/auth-navbar';
import { Footer } from './components/footer/footer';
import { CreateOrganization } from './pages/CreateOrganization';
import { Toaster } from '@/components/ui/sonner';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/organization/create"
              element={<CreateOrganization />}
            />
            <Route path="/organization/:orgId" element={<OrgPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="screen-loader">Opening your inbox…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}


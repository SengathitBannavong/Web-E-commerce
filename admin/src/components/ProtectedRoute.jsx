import { Navigate, Outlet } from 'react-router-dom';
import { useStoreContext } from '../contexts/StoreContext.jsx';

function ProtectedRoute() {
  const { token } = useStoreContext();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;

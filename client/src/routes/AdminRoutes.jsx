import { Navigate, Outlet } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

const AdminRoute = ({ user,isAuthenticated }) => {

  if (!user || user.role !== 'admin' || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout><Outlet /></AdminLayout>;
};

export default AdminRoute;

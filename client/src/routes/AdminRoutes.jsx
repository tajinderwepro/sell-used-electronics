// src/routes/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

// Use context or props for actual user role in production
const AdminRoute = ({ userRole,isAuthenticated }) => {

  if (userRole !== 'admin' || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <AdminLayout><Outlet /></AdminLayout>;
};

export default AdminRoute;

import { Navigate, Outlet } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';

const UserRoute = ({ userRole,isAuthenticated}) => {
  if (userRole !== 'user' || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <UserLayout><Outlet /></UserLayout>;
};

export default UserRoute;

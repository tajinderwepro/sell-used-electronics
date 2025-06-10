import { Navigate, Outlet } from 'react-router-dom';
import GeneralLayout from '../layouts/GeneralLayout';

const UserRoute = ({ user,isAuthenticated}) => {
  if (!user || user.role !== 'user' || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <GeneralLayout><Outlet /></GeneralLayout>;
};

export default UserRoute;

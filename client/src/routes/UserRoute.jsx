import { Navigate, Outlet } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';

const UserRoute = ({ userRole }) => {
  if (userRole !== 'user') {
    return <Navigate to="/" replace />;
  }
  return <UserLayout><Outlet /></UserLayout>;
};

export default UserRoute;

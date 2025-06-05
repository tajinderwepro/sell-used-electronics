import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, userRole }) => {
  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

export default AdminRoute;

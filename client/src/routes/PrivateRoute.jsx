import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role, user }) => {
  if (user.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;

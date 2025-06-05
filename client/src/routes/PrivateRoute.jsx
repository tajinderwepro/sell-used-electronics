import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role, userRole }) => {
  if (userRole !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;

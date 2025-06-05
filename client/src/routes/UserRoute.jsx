import { Navigate } from 'react-router-dom';

const UserRoute = ({ children, userRole }) => {
  if (userRole !== 'user') {
    return <Navigate to="/" />;
  }
  return children;
};

export default UserRoute;

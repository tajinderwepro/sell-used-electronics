import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/Dashbaord";
import UserList from "../pages/admin/UserList";
import AdminRoute from "./AdminRoutes";
import AdminLogin from "../pages/admin/AdminLogin";
import UserRoute from "./UserRoute";
import { useAuth } from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import Devices from "../pages/admin/Devices";
import Users from "../pages/admin/Users";
import Orders from "../pages/admin/Orders";
import Quotes from "../pages/admin/Quotes";
import Dashboard from "../pages/users/Dashboard";
function AllRoutes() {
  const auth = useAuth();
  const { logout, userRole, isAuthenticated, loading } = auth;

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute userRole={userRole} isAuthenticated={isAuthenticated} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/devices" element={<Devices />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/quotes" element={<Quotes />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<UserRoute userRole={userRole} isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/orders" element={<UserList />} />
        </Route>

        {/* Catch-All 404 Route (MUST be last) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AllRoutes;

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
import GeneralLayout from "../layouts/GeneralLayout";
import Categories from "../pages/admin/Categories";
import Brands from "../pages/admin/Brands";
import Products from "../pages/users/Products";
import LoadingIndicator from "../common/LoadingIndicator";
function AllRoutes() {
  const auth = useAuth();
  const { logout, userRole, isAuthenticated, loading } = auth;

  if (loading) return <div className="text-center p-10"><LoadingIndicator isLoading={loading} /></div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GeneralLayout><Login /></GeneralLayout>} />
        <Route path="/register" element={<GeneralLayout><Register /></GeneralLayout>} />
        <Route path="/admin/login" element={<GeneralLayout><AdminLogin /></GeneralLayout>} />
        {/* Admin Protected Routes */}
        <Route element={<AdminRoute userRole={userRole} isAuthenticated={isAuthenticated} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/devices" element={<Devices />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/quotes" element={<Quotes />} />
          <Route path="/admin/categories" element={<Categories/>} />
          <Route path="/admin/categories/brand/:categoryId" element={<Brands />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<UserRoute userRole={userRole} isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
        </Route>

        {/* Catch-All 404 Route (MUST be last) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AllRoutes;

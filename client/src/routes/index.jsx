import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/Dashbaord";
import AdminRoute from "./AdminRoutes";
import AdminLogin from "../pages/admin/AdminLogin";
import UserRoute from "./UserRoute";
import { useAuth } from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import Devices from "../pages/admin/Devices";
import Users from "../pages/admin/Users";
import Orders from "../pages/admin/Orders";
import ViewOrder from "../pages/admin/Orders/ViewOrder";
import Quotes from "../pages/admin/Quotes";
import Dashboard from "../pages/users/Dashboard";
import GeneralLayout from "../layouts/GeneralLayout";
import Categories from "../pages/admin/Categories";
import RiskManagement from "../pages/admin/RiskManagement";
import Brands from "../pages/admin/Brands";
import Products from "../pages/users/Products";
import Models from "../pages/admin/Models";
import LoadingIndicator from "../common/LoadingIndicator";
import Settings from "../pages/admin/Settings";
import ShipmentAddress from "../components/common/ShipmentAddress";
import Profile from "../pages/Profile";
import ViewDevice from "../pages/admin/Devices/viewDevice";
import ViewQuote from "../pages/admin/Quotes/ViewQuote";
import ConnectStripe from "../pages/ConnectStripe";
import OnboardingSuccess from "../pages/OnboardingSuccess";
import OnboardingRetry from "../pages/OnboardingRetry";
import StripeStatus from "../pages/users/StripeStatus";
import Payments from "../pages/admin/Payments";
import UserPayments from "../pages/users/Payments";
import UsersOrders from "../pages/users/Orders";
function AllRoutes() {
  const auth = useAuth();
  const {user, isAuthenticated, loading } = auth;
  if (loading) return <div className="text-center p-10"><LoadingIndicator isLoading={loading} /></div>;

    const commonRoutes = () => {
        return (
            <>
                <Route
                    element={
                        user && user.role == 'admin' ? <Navigate to="/admin/dashboard" /> : user && user.role == 'user' ? <Navigate to="/dashboard" /> : <Outlet />
                    }
                >
                    <Route path="/admin/login" element={<GeneralLayout><AdminLogin /></GeneralLayout>} />
                </Route>
                <Route
                    element={
                        user && user.role == 'user' ? <Navigate to="/dashboard" /> : user && user.role == 'admin' ? <Navigate to="/admin/dashboard" /> : <Outlet />
                    }
                >
                <Route path="/login" element={<GeneralLayout><Login /></GeneralLayout>} />
                </Route>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<GeneralLayout><Register /></GeneralLayout>} />
                  <Route path="*" element={<NotFound />} />
            </>
        )
    }
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {commonRoutes()}
        {/* Admin Protected Routes */}
        <Route element={<AdminRoute user={user} isAuthenticated={isAuthenticated} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/devices" element={<Categories />} />
          <Route path="/admin/devices/:deviceId" element={<ViewDevice />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/orders/:orderId" element={<ViewOrder />} />
          <Route path="/admin/quotes" element={<Quotes />} />
          <Route path="/admin/quotes/:quoteId" element={<ViewQuote />} />
          <Route path="/admin/devices/categories" element={<Categories/>} />
          <Route path="/admin/devices/categories/:categoryId/brand" element={<Brands />} />
          <Route path="/admin/devices/categories/:categoryId/:brand/:brandId" element={<Models />} />
          <Route path="/admin/categories" element={<Categories/>} />
          <Route path="/admin/risk-management" element={<RiskManagement/>} />
          <Route path="/admin/categories/:categoryId/brand" element={<Brands />} />
          <Route path="/admin/categories/:categoryId/:brand/:brandId" element={<Models />} />
          <Route path="/admin/profile" element={<Profile/>} />
          <Route path="/admin/payments" element={<Payments/>} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<UserRoute user={user} isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<UsersOrders />} />
          <Route path="/orders/:orderId" element={<UsersOrders />} />
          <Route path="/payments" element={<UserPayments />} />
          <Route path="/address" element={<ShipmentAddress/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/connect/start" element={<ConnectStripe/>} />
          <Route path="/stripe-status" element={<StripeStatus/>} />
          <Route path="/connect/complete" element={<Profile/>} />
          <Route path="/stripe/onboarding/complete" element={<OnboardingSuccess />} />
          <Route path="/stripe/onboarding/refresh" element={<OnboardingRetry />} />

        </Route>

        {/* Catch-All 404 Route (MUST be last) */}
      </Routes>
    </Router>
  );
}

export default AllRoutes;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserList from "../pages/admin/UserList";
import AdminRoute from "./AdminRoutes";
import AdminLogin from "../pages/admin/AdminLogin";
import UserRoute from "./UserRoute";

// Dummy role — replace with context or actual login logic
const userRole = "admin";

function AllRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes (Nested with AdminLayout) */}
        <Route element={<AdminRoute userRole={userRole} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList />} />
        </Route>

        <Route element={<UserRoute userRole={userRole} />}>
          <Route path="/user/profile" element={<AdminDashboard />} />
          <Route path="/user/orders" element={<UserList />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default AllRoutes;

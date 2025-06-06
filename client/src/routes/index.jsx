import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserList from "../pages/admin/UserList";
import AdminRoute from "./AdminRoutes";
import AdminLogin from "../pages/admin/AdminLogin";

const userRole = "admin"; 

function AllRoutes() {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute userRole={userRole}>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute userRole={userRole}>
              <UserList />
            </AdminRoute>
          }
        />

        {/* User Routes */}
        {/* <Route
          path="/user/profile"
          element={
            <UserRoute userRole={userRole}>
              <UserProfile />
            </UserRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default AllRoutes;

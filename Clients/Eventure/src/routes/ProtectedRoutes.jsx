import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {  // Ensure allowedRoles is always an array
  const user = JSON.parse(localStorage.getItem("user")) || {}; // Prevent null reference
  const location = useLocation(); // Get current location

  if (!user?.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

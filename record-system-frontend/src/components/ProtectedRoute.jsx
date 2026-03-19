import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ role }) => {
  const { adminUser, judgeUser, loading } = useAuth();

  if (loading) return (
    <div className="loading-screen"><div className="spinner" /></div>
  );

  if (role === "admin" && !adminUser) return <Navigate to="/login" replace />;
  if (role === "judge" && !judgeUser) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
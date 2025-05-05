import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../ui/Loader";
const ProtectedRoute = ({
  children,
  redirectTo = "/connexion",
  adminOnly = false,
  allowIfMustChangePassword = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminOnly && user.role !== "Administrateur") {
    return <Navigate to="/" replace />;
  }

  if (!allowIfMustChangePassword && user.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
};
export default ProtectedRoute;

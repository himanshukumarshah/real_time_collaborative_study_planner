import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * ProtectedRoute wrapper
 *
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
 *
 * Behavior:
 * - If auth is initializing (restoring from localStorage), show a small loader.
 * - If authenticated, render children.
 * - If not authenticated, redirect to /login and preserve the attempted location.
 */
export default function ProtectedRoute({ children, redirectTo = "/auth/login" }) {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <Loader2 size={8} className="animate-spin mr-2" />
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to={redirectTo} state={{ from: location }} replace />;
}

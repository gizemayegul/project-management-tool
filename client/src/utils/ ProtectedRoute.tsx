import React from "react";
import { Navigate } from "react-router-dom";

interface userChild {
  children: React.ReactNode;
}
export default function ProtectedRoute({ children }: userChild) {
  const isLoggedIn = localStorage.getItem("token");

  return isLoggedIn ? children : <Navigate to="/login" />;
}

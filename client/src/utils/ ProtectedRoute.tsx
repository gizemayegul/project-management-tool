import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import React from "react";

interface userChild {
  children: React.ReactNode;
}
export default function ProtectedRoute({ children }: userChild) {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) return children;
}

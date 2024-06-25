import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Loading from "../Components/Loading/Loading";

interface userChild {
  children: React.ReactNode;
}

export default function isAnon({ children }: userChild) {
  const { isLoggedIn, loading } = useContext(AuthContext);
  if (loading) return <Loading />;
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  } else {
    return children;
  }
}

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Loading from "../Components/Loading/Loading";

export default function IsAnon({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />; // Redirect to dashboard if already authenticated
  }

  return <>{children}</>; // Render the anonymous route content if not authenticated
}

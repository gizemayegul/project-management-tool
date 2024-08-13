import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Loading from "../Components/Loading/Loading";

export default function IsPrivate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (isLoggedIn) {
    return <>{children}</>;
  } else {
    return (
      <>
        <Navigate to="/dashboard" />
      </>
    );
  }
}

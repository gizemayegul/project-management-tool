import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../Components/Loading/Loading";

interface userChild {
  user: boolean | null;
  children: React.ReactElement;
}
export default function ProtectedRoute({ user, children }: userChild) {
  const [loading, setLoading] = useState(true);
  //   console.log(user, "atbegin");

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        {" "}
        <Loading />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/signup" />;
}

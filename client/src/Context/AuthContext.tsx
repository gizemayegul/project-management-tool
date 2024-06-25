import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Components/Loading/Loading";
import { AuthContextType } from "../utils/types";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  token: "",
  setToken: () => {},
  logoutUser: () => {},
  loading: true,
  userExpire: false,
});

const API_URL = import.meta.env.VITE_SERVER_URL;

function AuthProviderWrapper(props: React.PropsWithChildren<{}>) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(""); // token from login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userExpire, setUserExpire] = useState(false);
  if (token) {
    localStorage.setItem("token", token);
  }
  useEffect(() => {
    const localStoreToken = localStorage.getItem("token");
    if (localStoreToken) {
      const authenticateUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/verify`, {
            headers: { Authorization: localStoreToken },
          });
          if (response.data.isAuthenticated) {
            setUser(response.data);
            setIsLoggedIn(true);
          }
        } catch (err) {
          console.log(err);
          if (localStoreToken !== token) {
            localStorage.removeItem("token");
            setUserExpire(true);
            setUser(null);
            setToken("");
          }
        } finally {
          setLoading(false);
        }
      };
      authenticateUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
    setToken("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        token,
        setToken,
        logoutUser,
        loading,
        userExpire,
      }}
    >
      {loading ? <Loading /> : props.children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProviderWrapper };

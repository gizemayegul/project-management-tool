import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Components/Loading/Loading";
import { AuthContextType } from "../utils/types";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  logOutUser: () => {},
  isLoading: true,
  storeToken: (token: string) => {},
  authenticateUser: () => {},
  setIsLoggedIn: () => {},
});

const API_URL = import.meta.env.VITE_SERVER_URL;

function AuthProviderWrapper(props: React.PropsWithChildren<{}>) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const storeToken = (token: string): void => {
    localStorage.setItem("token", token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/api/verify`, {
          headers: { Authorization: storedToken },
        });
        const user = response.data;
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
      } catch (err) {
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };
  useEffect(() => {
    authenticateUser();
  }, []);

  const removeToken = () => {
    localStorage.removeItem("token");
  };

  const logOutUser = () => {
    removeToken();
    setUser(null);
    setIsLoading(false);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        storeToken,
        logOutUser,
        setIsLoggedIn,
        isLoading,
        authenticateUser,
      }}
    >
      {isLoading ? <Loading /> : props.children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProviderWrapper };

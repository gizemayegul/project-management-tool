import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_SERVER_URL;

function AuthProviderWrapper(props: React.PropsWithChildren<{}>) {
  const localStoreToken = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  if (localStoreToken) {
    useEffect(() => {
      const authenticateUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/verify`, {
            headers: { Authorization: localStoreToken },
          });
          if (response.data.isAuthenticated) {
            setUser(response.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      authenticateUser();
    }, []);
  }

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
}
export { AuthContext, AuthProviderWrapper };

import { createContext, useState, useEffect } from "react";
import axios, { Axios } from "axios";
import Loading from "../Components/Loading/Loading";
import { AuthContextType } from "./context";
import { toast } from "react-toastify";

export const initialValues: AuthContextType = {
  user: null,
  isLoggedIn: false,
  logOutUser: () => {},
  isLoading: true,
  storeToken: () => {},
  authenticateUser: () => {},
  setIsLoggedIn: () => {},
  token: null,
  handleSubmitFile: () => {},
  setIsLineLoading: () => {},
  isLineLoading: false,
  selectedFile: null,
  handleFileChange: () => {},
  setSelectedFile: () => {},
  handleUpdate: () => {},
  userUpdate: { name: "", email: "", password: "" },
  setUserUpdate: () => {},
  handleUserDelete: () => {},
  logOut: false,
  setLogOut: () => {},
};

const AuthContext = createContext<AuthContextType>(initialValues);

const API_URL = import.meta.env.VITE_SERVER_URL;

function AuthProviderWrapper(props: React.PropsWithChildren<{}>) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLineLoading, setIsLineLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logOut, setLogOut] = useState(false);
  const [userUpdate, setUserUpdate] = useState({
    name: "",
    email: "",
    password: "",
  });
  const notify = () => toast.success("Uploaded!");
  const notifyUpdate = () => toast.success("User information is changed!");
  const [isError, setIsError] = useState<any>();
  const notifyError = () => toast.error(isError);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const storeToken = (token: string): void => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const clearAllCaches = async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/verify`, {
          headers: { Authorization: storedToken },
        });
        const user = response.data;
        setIsLoggedIn(true);
        setUser(user);
        setUserUpdate({ name: user.name, email: user.email, password: "" });
      } catch (err) {
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      } finally {
        setIsLoading(false);
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

  const logOutUser = async () => {
    removeToken();
    setUser(null);
    setIsLoading(false);
    setIsLoggedIn(false);
  };

  const handleSubmitFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const uploadData = new FormData();
      uploadData.append("image", selectedFile as Blob);

      const response = await axios.post(`${API_URL}/upload`, uploadData, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      setUser(response.data);
      setIsLineLoading(false);
      setSelectedFile(null);
      notify();
    } catch (err: any) {
      setIsError(
        "An error occurred, please try another file type,or smaller file"
      );
      setIsLineLoading(false);
      notifyError();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/update`, userUpdate, {
        headers: { Authorization: token },
      });
      setUser(response.data);
      notifyUpdate();
    } catch (err) {
      setIsError("An error occurred, please try again");
    }
  };

  const handleUserDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${API_URL}/delete`, {
        headers: { Authorization: token },
      });
      removeToken();
      setUser(null);
      setIsLoading(false);
      setIsLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
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
        token,
        handleSubmitFile,
        isLineLoading,
        setIsLineLoading,
        selectedFile,
        handleFileChange,
        setSelectedFile,
        handleUpdate,
        handleUserDelete,
        userUpdate,
        setUserUpdate,
        logOut,
        setLogOut,
      }}
    >
      {isLoading ? <Loading /> : <>{props.children}</>}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProviderWrapper };

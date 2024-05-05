import "./App.css";
import "./index.css";
import Signup from "./Pages/Signup/Signup";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { AuthContext } from "./Context/AuthContext";
import { useContext, useEffect } from "react";
import ProtectedRoute from "./utils/ ProtectedRoute";
import NotFound from "./Pages/NotFound/NotFound";
import Profile from "./Pages/Profile/Profile";
import { useNavigate } from "react-router-dom";
import Home from "./Pages/Home/Home";

function App() {
  const { userExpire } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (userExpire) {
      navigate("/login");
    }
  }, [userExpire]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

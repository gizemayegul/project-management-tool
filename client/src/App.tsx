import "./App.css";
import "./index.css";
import Signup from "./Pages/Signup/Signup";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";
import ProtectedRoute from "./utils/ ProtectedRoute";
import NotFound from "./Pages/NotFound/NotFound";
function App() {
  const user = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

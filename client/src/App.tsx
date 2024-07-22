import "./App.css";
import "./index.css";
import { Route, Routes } from "react-router-dom";

import Signup from "./Pages/Signup/Signup";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NotFound from "./Pages/NotFound/NotFound";
import Profile from "./Pages/Profile/Profile";
import Home from "./Pages/Home/Home";
import ProjectDetail from "./Pages/ProjectDetail/ProjectDetail";
import CreateBoard from "./Pages/CreateBoard/CreateBoard";
import BoardsDetails from "./Pages/BoardsDetails/BoardsDetails";
import IsPrivate from "./utils/IsPrivate";
import IsAnon from "./utils/IsAnon";
import CreateProject from "./Pages/CreateProject/CreateProject";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
-IsPrivate;
function App() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <IsAnon>
              <Home />
            </IsAnon>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <IsPrivate>
              <Dashboard />
            </IsPrivate>
          }
        />
        <Route
          path="/profile"
          element={
            <IsPrivate>
              <Profile />
            </IsPrivate>
          }
        />
        <Route
          path="/createaproject"
          element={
            <IsPrivate>
              <CreateProject />
            </IsPrivate>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <IsPrivate>
              <ProjectDetail />
            </IsPrivate>
          }
        />
        <Route
          path="/projects/:projectId/boards/createboard"
          element={
            <IsPrivate>
              <CreateBoard />
            </IsPrivate>
          }
        />

        <Route
          path="/projects/:projectId/boards/:boardId"
          element={
            <IsPrivate>
              <BoardsDetails />
            </IsPrivate>
          }
        />
        {/* <Route path="/createboarddropdown" element={<CreateBoardDropDown />} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

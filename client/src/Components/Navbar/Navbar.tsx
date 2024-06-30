import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import taskFlow from "../../assets/images/taskFlow.png";

import CreateProjectDropDown from "../CreateProjectDropDown/CreateProjectDropDown";
import CreateBoardDropDown from "../CreateBoardDropDown/CreateBoardDropDown";
export default function Navbar() {
  const { logOutUser, isLoggedIn } = useContext(AuthContext);
  const [createProject, setCreateProject] = useState<boolean>(false);
  const [createBoard, setCreateBoard] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div>
      <div className="navbar bg-base-100">
        {isLoggedIn ? (
          <>
            <div className="navbar-start">
              <Link to="/dashboard">
                <div className="flex justify-around items-center border-2 px-2 border-indigo-600 rounded-md bg-indigo-200">
                  <img className="w-12" src={taskFlow} />
                  <h1 className="text-xl">TaskFlow</h1>
                </div>
              </Link>
            </div>
            <div className="navbar-center">
              <ul className="menu menu-horizontal px-1 ">
                <li className="m-2">
                  <details
                    className="dropdown"
                    tabIndex={0}
                    role="button"
                    {...(createProject || createBoard ? { open: false } : {})}
                  >
                    <summary>
                      <div>Create</div>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-30 w-80 p-2 shadow flex justify-between">
                      <li>
                        {CreateProjectDropDown ? (
                          <CreateProjectDropDown
                            setCreateProject={setCreateProject}
                          />
                        ) : (
                          <button
                            onClick={() => {
                              setCreateProject((prev) => !prev);
                              setCreateBoard(false);
                            }}
                          >
                            Create Project
                          </button>
                        )}
                      </li>
                      <li>
                        {createBoard ? (
                          <CreateBoardDropDown
                            setCreateBoard={setCreateBoard}
                          />
                        ) : (
                          <button
                            onClick={() => {
                              setCreateBoard((prev) => !prev);
                              setCreateProject(false);
                            }}
                          >
                            Create Board
                          </button>
                        )}
                      </li>
                    </ul>
                  </details>
                </li>
                <li className="m-2">
                  <details className="dropdown" tabIndex={0} role="button">
                    <summary>
                      <div>Projects</div>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-30 w-52 p-2 shadow">
                      <li> pro1</li>
                      <li>pro2</li>
                    </ul>
                  </details>
                </li>
                <li className="m-2">
                  <details className="dropdown" tabIndex={0} role="button">
                    <summary>
                      <div>Favs</div>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-30 w-52 p-2 shadow">
                      <li> fav1</li>
                      <li>fav2</li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>

            <div className="navbar-end ">
              <Link to="/profile">
                <button className="btn mx-2">Profile</button>
              </Link>
              <button
                className="btn hover:bg-red-500 hover:text-white"
                onClick={() => {
                  logOutUser();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-start">
              <Link to="/">
                <button className="btn btn-sm text-sm font-semibold ">
                  TaskFlow
                </button>
              </Link>
            </div>
            <div className="navbar-end">
              <Link to="/login">
                <button className="btn btn-active bg-indigo-600 btn-sm text-white text-sm mx-1 font-semibold ">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-sm mx-3 text-sm font-semibold ">
                  Signup{" "}
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

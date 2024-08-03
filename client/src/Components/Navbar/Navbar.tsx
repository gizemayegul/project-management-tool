import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import CreateProjectDropDown from "../CreateProjectDropDown/CreateProjectDropDown";
import CreateBoardDropDown from "../CreateBoardDropDown/CreateBoardDropDown";
import { BoardContext } from "../../Context/BoardContext";
import { ProjectContext } from "../../Context/ProjectContext";
import { useRef } from "react";
import { set } from "mongoose";

export default function Navbar() {
  const { logOutUser, isLoggedIn, user } = useContext(AuthContext);
  const [createProject, setCreateProject] = useState<boolean>(false);
  const [createBoard, setCreateBoard] = useState<boolean>(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const favRef = useRef<HTMLDetailsElement>(null);

  const { favBoards } = useContext(BoardContext);
  const { favoriteProjects, dropdown, setDropdown } =
    useContext(ProjectContext);

  const clickSomewhere = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdown((prev) => !prev);
    } else if (favRef.current && !favRef.current.contains(e.target as Node)) {
      setDropdown((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener("click", (e: MouseEvent) => clickSomewhere(e));

    return () => {
      window.removeEventListener("click", (e: MouseEvent) => clickSomewhere(e));
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the event from propagating to the window
    setDropdown((prev) => !prev);
  };

  return (
    <div className="navbar bg-base-100 z-50">
      {isLoggedIn ? (
        <>
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-30 mt-3 w-52 p-2 shadow ">
                <li className="m-2 z-30">
                  <Link to="/createaproject">Create Project</Link>
                </li>

                <li className="m-2">
                  <details
                    className="dropdown"
                    tabIndex={0}
                    role="button"
                    ref={favRef}
                    onClick={(e) => e.stopPropagation()}
                    {...(dropdown ? { open: false } : {})}
                  >
                    <summary
                      onClick={(e: React.MouseEvent) => {
                        toggleDropdown(e);
                        setDropdown(false);
                      }}
                    >
                      <div>Favs</div>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-30 w-52 p-2 shadow">
                      {favBoards.length === 0 &&
                        favoriteProjects.length === 0 && (
                          <div className="m-2">No favorites yet!</div>
                        )}
                      {favBoards.length > 0 &&
                        favBoards.map((fav) => (
                          <li
                            key={fav._id}
                            className=" p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                            onClick={() => {
                              navigate(
                                `/projects/${fav.projectId}/boards/${fav._id}`
                              );
                            }}
                          >
                            {fav.boardName}
                          </li>
                        ))}

                      {favoriteProjects &&
                        favoriteProjects.length > 0 &&
                        favoriteProjects.map((fav) => (
                          <li
                            key={fav._id}
                            className=" p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                            onClick={() => {
                              navigate(`/projects/${fav._id}`);
                            }}
                          >
                            {fav.projectName}
                          </li>
                        ))}
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
            <Link to="/dashboard">
              <div className="flex justify-around items-center  px-2 border-indigo-600 rounded-md">
                <button className="btn text-lg font-semibold ">
                  Dashboard
                </button>
              </div>
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 ">
              <li className="m-2">
                <details
                  ref={dropdownRef}
                  className="dropdown"
                  tabIndex={0}
                  onClick={(e) => e.stopPropagation()}
                  role="button"
                  {...(dropdown ? { open: false } : {})}
                >
                  <summary onClick={toggleDropdown}>
                    <div>Create</div>
                  </summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-30 w-80 p-2 shadow flex justify-between">
                    {!createBoard && (
                      <li>
                        {createProject ? (
                          <CreateProjectDropDown
                            setCreateProject={setCreateProject}
                            setDropdown={setDropdown}
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
                    )}

                    {!createProject && (
                      <li>
                        {createBoard ? (
                          <CreateBoardDropDown
                            setCreateBoard={setCreateBoard}
                            setDropdown={setDropdown}
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
                    )}
                  </ul>
                </details>
              </li>
              <li className="m-2">
                <details
                  className="dropdown"
                  tabIndex={0}
                  role="button"
                  ref={favRef}
                  onClick={(e) => e.stopPropagation()}
                  {...(dropdown ? { open: false } : {})}
                >
                  <summary onClick={toggleDropdown}>
                    <div>Favs</div>
                  </summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-30 w-52 p-2 shadow">
                    {favBoards.length === 0 &&
                      favoriteProjects.length === 0 && (
                        <div className="m-2">No favorites yet!</div>
                      )}
                    {favBoards.length > 0 &&
                      favBoards.map((fav) => (
                        <li
                          key={fav._id}
                          className=" p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                          onClick={() => {
                            navigate(
                              `/projects/${fav.projectId}/boards/${fav._id}`
                            );
                          }}
                        >
                          {fav.boardName}
                        </li>
                      ))}

                    {favoriteProjects &&
                      favoriteProjects.length > 0 &&
                      favoriteProjects.map((fav) => (
                        <li
                          key={fav._id}
                          className=" p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                          onClick={() => {
                            navigate(`/projects/${fav._id}`);
                          }}
                        >
                          {fav.projectName}
                        </li>
                      ))}
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          <div className="navbar-end space-x-2 items-start">
            <div
              onClick={() => {
                navigate("/profile");
              }}
            >
              <img
                className="inline-block h-8 w-18 rounded-full ring-2 ring-white border-2"
                src={user?.image}
                alt=""
              />{" "}
            </div>
            <div>
              <label className="swap swap-rotate">
                {/* this hidden checkbox controls the state */}
                <input
                  type="checkbox"
                  className="theme-controller"
                  value="dark"
                />

                {/* sun icon */}
                <svg
                  className="swap-off h-8 w-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>

                {/* moon icon */}
                <svg
                  className="swap-on h-8 w-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
              </label>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="navbar-start">
            <Link to="/">
              <button className="btn text-lg font-semibold ">TaskFlow</button>
            </Link>
          </div>
          <div className="navbar-end">
            <Link to="/login">
              <button className="btn btn-active bg-indigo-600  text-white text-sm mx-1 font-semibold ">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="btn  mx-3 text-sm font-semibold ">
                Signup{" "}
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import taskFlow from "../../assets/images/taskFlow.png";
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
            <Link to="/dashboard">
              <div className="flex justify-around items-center  px-2 border-indigo-600 rounded-md">
                <img className="w-12" src={taskFlow} />
                <h1 className="text-xl">TaskFlow</h1>
              </div>
            </Link>
          </div>
          <div className="navbar-center">
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

          <div className="navbar-end">
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

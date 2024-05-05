import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
export default function Navbar() {
  const { logoutUser, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div data-testid="navbar">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <Link
              className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
              to="/"
            >
              Home
            </Link>
            <Link
              className="bg-gray-900 text-white rounded-md px-3 py-2 ml-3 text-sm font-medium"
              to="/"
            >
              Projects
            </Link>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
              <div className="flex space-x-4">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/signup"
                      className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      aria-current="page"
                    >
                      Signup
                    </Link>
                    <Link
                      to="/login"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Login
                    </Link>{" "}
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      aria-current="page"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        navigate("/login");
                      }}
                      className="text-gray-300 hover:bg-red-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Logout
                    </button>{" "}
                  </>
                )}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
          </div>
        </div>
      </nav>
    </div>
  );
}

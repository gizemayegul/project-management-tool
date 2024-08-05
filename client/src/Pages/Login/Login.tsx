import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { apiUrl } from "../../utils/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { authenticateUser, storeToken } = useContext(AuthContext);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password,
      });
      setError("");
      storeToken(response.data.token);
      authenticateUser();
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message);
      }
    }
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Login in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={submitHandler}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <label
                htmlFor="email"
                className="  dark:text-white block text-sm font-medium leading-6 "
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setEmail(e.target.value);
                  }}
                  className="input input-bordered block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className=" dark:text-white block text-sm font-medium leading-6 "
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="  dark:text-indigo-600 font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="on d"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setPassword(e.target.value);
                  }}
                  className="input input-bordered block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login{" "}
              </button>
            </div>
          </form>
          {error && (
            <div className=" bg-red-500 p-1.5 mt-2 rounded-md text-white px-3 py-1.5 text-sm font-semibold  flex w-full justify-center">
              <h1>{error}</h1>
            </div>
          )}

          <p className="  dark:text-white mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

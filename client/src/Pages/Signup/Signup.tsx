import { useState } from "react";
import axios, { AxiosError } from "axios";

import { apiUrl } from "../../utils/config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response: any = await axios.post(`${apiUrl}/signup`, {
        email: email,
        password: password,
        name: name,
      });
      setError("");
      setSuccess(response.data.message);
      if (response.status === 200) {
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
      setIsLoading(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log(err, "errorr");
        setError(err.response?.data.message);
        setSuccess("");
        setEmail("");
        setPassword("");
        setName("");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
          Create a new account
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={submitHandler}
          >
            <label
              className="block text-sm font-medium leading-6 "
              htmlFor="name"
            >
              Name
              <input
                className="input input-bordered block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="name"
                type="text"
                value={name}
                onChange={(e: React.FormEvent<HTMLInputElement>): void =>
                  setName((e.target as HTMLInputElement).value)
                }
              />
            </label>
            <label
              className="block text-sm font-medium leading-6 "
              htmlFor="email"
            >
              Email
              <input
                className=" input input-bordered block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="email"
                type="email"
                value={email}
                onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                  setEmail((e.target as HTMLInputElement).value);
                }}
              />
            </label>
            <label
              className="block text-sm font-medium leading-6 "
              htmlFor="password"
            >
              Password
              <input
                className="input input-bordered block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="password"
                type="password"
                value={password}
                onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                  setPassword((e.target as HTMLInputElement).value);
                }}
              />
            </label>

            <button
              className="btn flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
            >
              {isLoading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                "Signup"
              )}
            </button>
          </form>
        </div>
        {error && (
          <div>
            <p className=" bg-red-500 p-1.5 mt-2 rounded-md text-white px-3 py-2 text-sm font-semibold  flex w-full justify-center">
              {error}
            </p>
          </div>
        )}
        {success && (
          <div className=" bg-lime-500 p-1.5 mt-2 rounded-md text-white px-3 py-2 text-sm font-semibold  flex w-full justify-center">
            <p>{success}</p>
          </div>
        )}
        <p className="mt-10 text-center text-sm text-gray-500">
          Do you have already an account{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

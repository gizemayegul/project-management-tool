import { useParams } from "react-router-dom";
import { useState } from "react";
import axios, { AxiosError } from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;
import { useNavigate } from "react-router-dom";
export default function CreateBoard() {
  const [boardName, setBoardName] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const localStoreToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const { projectId } = useParams();
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(boardName);
    const createBoard = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/board/${projectId}/createboard`,
          { boardName: boardName },
          {
            headers: { Authorization: localStoreToken },
          }
        );
        console.log(response.data.projects);
        navigate(`/projects/${projectId}`);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err, "errorr");
          setError(err.response?.data.message);
        }
      }
    };
    createBoard();
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a board
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={submitHandler}>
            <label htmlFor="projectname">
              Board Name
              <input
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={boardName}
                name="projectname"
                type="text"
                onChange={(e: React.ChangeEvent): void => {
                  setBoardName((e.target as HTMLInputElement).value);
                }}
              />
            </label>
            <button
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
            >
              {" "}
              Create
            </button>
            {error && (
              <div>
                <p className=" bg-red-400 p-1.5 mt-2 rounded-md text-white px-3 py-2 text-sm font-semibold  flex w-full justify-center">
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

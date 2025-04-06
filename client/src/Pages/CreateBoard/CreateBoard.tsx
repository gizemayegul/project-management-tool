import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { apiUrl } from "../../utils/config";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../../Context/ProjectContext";
import { toast } from "react-toastify";
export default function CreateBoard() {
  const [boardName, setBoardName] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const { projectId } = useParams();
  const { token } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);
  const navigate = useNavigate();
  const notify = () => toast.error(error);

  const project = projects.find((project) => project._id === projectId);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createBoard = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/${projectId}/createboard`,
          { boardName: boardName, projectName: project?.projectName },
          {
            headers: { Authorization: token },
          }
        );

        if (response.status === 200) {
          navigate(
            `/projects/${projectId}/boards/${response.data.boardInfo._id}`
          );
        }
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message);
        }
      }
    };
    createBoard();
  };
  useEffect(() => {
    if (error) {
      notify();
      setError("");
    }
  }, [error]);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Create a board
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={submitHandler}>
            <label htmlFor="boardName">
              <input
                data-testid="board-name-input"
                className=" mt-2 input input-bordered block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={boardName}
                name="boardName"
                type="text"
                onChange={(e: React.ChangeEvent): void => {
                  setBoardName((e.target as HTMLInputElement).value);
                }}
              />
            </label>
            <button
              className="btn flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
              data-testid="create-board"
            >
              {" "}
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

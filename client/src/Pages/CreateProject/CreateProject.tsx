import { useState, useContext, useEffect } from "react";
import { apiUrl } from "../../utils/config";
import axios from "axios";
import { ProjectContext } from "../../Context/ProjectContext";
import { AuthContext } from "../../Context/AuthContext";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateProject() {
  const { setProjects, setDropdown } = useContext(ProjectContext);
  const [projectName, setProjectName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const notify = () => toast.error(error);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    setCreateProject?: (createProject: boolean) => void
  ) => {
    e.preventDefault();
    const createProject = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/projects/createproject`,
          { projectName: projectName },
          {
            headers: { Authorization: token },
          }
        );

        if (response.status === 200) {
          setProjects((prev) => [...prev, response.data]);
          setDropdown((prev) => !prev);
          navigate(`/projects/${response.data._id}`);
          setProjectName("");
          if (setCreateProject) {
            setCreateProject(false);
          }
        }
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message);
        }
      }
    };
    createProject();
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
          Create a project
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              submitHandler(e);
              setProjectName("");
            }}
          >
            <label htmlFor="projectname">
              Project Name
              <input
                className="input input-bordered block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                value={projectName}
                name="projectname"
                type="text"
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
              />
            </label>
            <button
              className="btn flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
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

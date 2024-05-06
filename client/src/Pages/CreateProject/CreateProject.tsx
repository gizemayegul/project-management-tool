import { useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../../Context/ProjectContext";

export default function CreateProject() {
  const [projectName, setProjectName] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const localStoreToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setProjects } = useContext(ProjectContext);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(projectName);
    const createProject = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/projects/createproject`,
          { projectName: projectName },
          {
            headers: { Authorization: localStoreToken },
          }
        );
        console.log(response.data.projects);
        navigate("/projects");
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err, "errorr");
          setError(err.response?.data.message);
        }
      } finally {
        try {
          const response = await axios.get(`${API_URL}/projects/projects`, {
            headers: { Authorization: localStoreToken },
          });
          console.log(response.data.projects);
          setProjects(response.data.projects);
        } catch (error) {
          console.log(error);
        }
      }
    };
    createProject();

    //TODO : projects page is not updated directly maybe it is better move them inside context
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="projectname">
          Project Name
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={projectName}
            name="projectname"
            type="text"
            onChange={(e: React.ChangeEvent): void => {
              setProjectName((e.target as HTMLInputElement).value);
            }}
          />
        </label>
        <button
          className=" bg-indigo-600  text-white hover:bg-indigo-500  hover:text-white rounded-md px-3 py-2 text-sm font-medium"
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
  );
}

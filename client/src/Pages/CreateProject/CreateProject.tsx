import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const [projectName, setProjectName] = useState<string | undefined>("");
  const localStoreToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
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
      } catch (error) {
        console.log(error);
      }
    };
    createProject();
    // navigate("/projects");

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
      </form>
    </div>
  );
}

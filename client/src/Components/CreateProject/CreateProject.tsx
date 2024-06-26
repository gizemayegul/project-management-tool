import { useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { headers, apiUrl } from "../../utils/config";
import { ProjectType } from "../../utils/types";

export default function CreateProject({ setCreateProject }: ProjectType) {
  const [projectName, setProjectName] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createProject = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/createproject`,
          { projectName: projectName },
          {
            headers: headers,
          }
        );
        navigate(`/projects/${response.data.projectInfo._id}`);
        setCreateProject(false);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err, "errorr");
          setError(err.response?.data.message);
        }
      }
    };
    createProject();

    //TODO : projects page is not updated directly maybe it is better move them inside context
  };
  return (
    <div className="flex flex-col ">
      <button onClick={() => setCreateProject(false)} className="self-start">
        <ChevronLeftIcon />
      </button>

      <form onSubmit={submitHandler}>
        <label htmlFor="projectname">
          Project Name
          <input
            required
            value={projectName}
            name="projectname"
            type="text"
            className="input input-bordered input-sm w-full max-w-xs mt-2"
            onChange={(e: React.ChangeEvent): void => {
              setProjectName((e.target as HTMLInputElement).value);
            }}
          />
        </label>
        <button className="btn btn-sm w-full mt-2" type="submit">
          {" "}
          Create Project
        </button>
      </form>
    </div>
  );
}

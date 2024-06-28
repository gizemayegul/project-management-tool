import { useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { apiUrl } from "../../utils/config";
import { AuthContext } from "../../Context/AuthContext";
import { ProjectContext } from "../../Context/ProjectContext";
import { set } from "mongoose";

interface Props {
  setCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateProjectDropDown({ setCreateProject }: Props) {
  const [projectName, setProjectName] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const { token } = useContext(AuthContext);
  const { projects, setProjects } = useContext(ProjectContext);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const CreateProjectDropDown = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/projects/createproject`,
          { projectName: projectName },
          {
            headers: { Authorization: token },
          }
        );
        console.log(response.data);
        navigate(`/projects/${response.data._id}`);
        setCreateProject(false);
        setProjects((prev) => [...prev, response.data]);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err, "errorr");
          setError(err.response?.data.message);
        }
      }
    };
    CreateProjectDropDown();

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

import { useState, useContext } from "react";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CreateProjectDropDownProps } from "../../utils/types";
import { apiUrl } from "../../utils/config";
import axios from "axios";
import { ProjectContext } from "../../Context/ProjectContext";
import { AuthContext } from "../../Context/AuthContext";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
export default function CreateProjectDropDown({
  setCreateProject,
  setDropdown,
}: CreateProjectDropDownProps) {
  const { setProjects } = useContext(ProjectContext);
  const [projectName, setProjectName] = useState<string>("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

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
          setProjectName("");
          setDropdown((prev) => !prev);

          navigate(`/projects/${response.data._id}`);
          if (setCreateProject) {
            setCreateProject(false);
          }
        }
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err, "errorr");
        }
      }
    };
    createProject();
  };
  return (
    <div className="flex flex-col ">
      <div className="flex justify-between w-full">
        <button
          className="self-start"
          onClick={() => {
            setCreateProject(false);
          }}
        >
          <ChevronLeftIcon className="h-5" />
        </button>

        <h3>Create a Project</h3>
        <div
          onClick={() => {
            setDropdown((prev) => !prev);
            setCreateProject(false);
          }}
        >
          <XMarkIcon className="h-5" />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          submitHandler(e, setCreateProject);
        }}
      >
        <label htmlFor="projectname">
          Project Name
          <input
            required
            value={projectName}
            name="projectname"
            type="text"
            className="input input-bordered input-sm w-full max-w-xs mt-2"
            onChange={(e) => {
              setProjectName(e.target.value);
              console.log(projectName);
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

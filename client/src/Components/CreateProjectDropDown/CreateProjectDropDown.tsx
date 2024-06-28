import { useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { apiUrl } from "../../utils/config";
import { AuthContext } from "../../Context/AuthContext";
import { ProjectContext } from "../../Context/ProjectContext";

interface Props {
  setCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateProjectDropDown({ setCreateProject }: Props) {
  const { projectName, setProjectName, submitHandler } =
    useContext(ProjectContext);

  return (
    <div className="flex flex-col ">
      <button onClick={() => setCreateProject(false)} className="self-start">
        <ChevronLeftIcon />
      </button>

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

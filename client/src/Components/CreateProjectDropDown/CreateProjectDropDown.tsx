import { useState, useEffect, useContext } from "react";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ProjectContext } from "../../Context/ProjectContext";
import { CreateProjectDropDownProps } from "../../utils/types";
import { set } from "mongoose";

export default function CreateProjectDropDown({
  setCreateProject,
  setDropdown,
}: CreateProjectDropDownProps) {
  const { projectName, setProjectName, submitHandler } =
    useContext(ProjectContext);

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

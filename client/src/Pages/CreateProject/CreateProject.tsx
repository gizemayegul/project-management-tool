import { useState, useEffect, useContext } from "react";

import { ProjectContext } from "../../Context/ProjectContext";

export default function CreateProject() {
  const { projectName, setProjectName, submitHandler } =
    useContext(ProjectContext);

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

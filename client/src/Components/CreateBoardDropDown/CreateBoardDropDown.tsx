import React, { useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { CreateBoardDropDownProps } from "../../utils/types";
import { ProjectContext } from "../../Context/ProjectContext";
import { AuthContext } from "../../Context/AuthContext";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { set } from "mongoose";

export default function CreateBoardDropDown({
  setCreateBoard,
  setDropdown,
}: CreateBoardDropDownProps) {
  const { projects } = useContext(ProjectContext);
  const { token } = useContext(AuthContext);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const [boardName, setBoardName] = useState<string>("");
  const navigate = useNavigate();

  const project = projects.find((project) => project._id === selectedProjectId);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/${selectedProjectId}/createboard`,
        { boardName: boardName, projectName: project?.projectName },

        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        setCreateBoard(false);
        setDropdown((prev) => !prev);
        navigate(
          `projects/${selectedProjectId}/boards/${response.data.boardInfo._id}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between w-full">
        <button
          className=" hover:round-sm h-6 w-6 self-start  hover:text-white"
          onClick={() => {
            setCreateBoard(false);
          }}
        >
          <ChevronLeftIcon className="h-5" />
        </button>
        <h3>Create a Board</h3>
        <div
          onClick={() => {
            setDropdown((prev) => !prev);
            setCreateBoard(false);
          }}
        >
          <XMarkIcon className="h-5" />
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="boardName"> Board Name</label>
        <input
          className="input input-bordered input-sm w-full max-w-xs mt-2"
          required
          type="text"
          name="boardName"
          id="boardName"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <label htmlFor="projectSelect"> </label>

        <select
          className="input input-bordered input-sm w-full max-w-xs mt-2"
          required
          onChange={(e) => {
            setSelectedProject(e.target.value);
            setSelectedProjectId(
              e.currentTarget.selectedOptions[0].dataset?.id
            );
          }}
          value={selectedProject}
        >
          Select a project
          <option className=" w-full max-w-xs py-2" value="" disabled>
            Select a project
          </option>
          {projects &&
            projects.map((project) => (
              <option
                className="w-full max-w-xs py-2"
                value={project.projectName}
                key={project._id}
                data-id={project._id}
              >
                {project.projectName}
              </option>
            ))}
        </select>

        <div>
          <button className="btn btn-sm mt-2 w-full" type="submit">
            Create Board
          </button>
        </div>
      </form>
    </div>
  );
}

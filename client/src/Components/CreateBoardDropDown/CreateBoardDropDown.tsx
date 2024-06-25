import React, { useState, useContext, ReactEventHandler } from "react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import axios from "axios";
import { apiUrl, headers } from "../../utils/config";
import { useNavigate } from "react-router-dom";

import { ProjectContext } from "../../Context/ProjectContext";

type CreateBoardDropDownProps = {
  setCreateBoard: React.Dispatch<React.SetStateAction<boolean>>;
};

//TODO proplar icin interface iyi mi

export default function CreateBoardDropDown({
  setCreateBoard,
}: CreateBoardDropDownProps) {
  const { projects } = useContext(ProjectContext);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const [boardName, setBoardName] = useState<string>("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/${selectedProjectId}/createboard`,
        {
          boardName: boardName,
        },
        { headers }
      );
      console.log(response.data);
      if (response.status === 200) {
        setCreateBoard(false);
        navigate(
          `projects/${selectedProjectId}/boards/${response.data.boardInfo._id}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-400 py-10">
      <button onClick={() => setCreateBoard(false)}>
        <ChevronLeftIcon />
      </button>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="boardName">Board name</label>
        <input
          className="input input-bordered w-full max-w-xs"
          required
          type="text"
          name="boardName"
          id="boardName"
          placeholder="Board Name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <label htmlFor="projectSelect">Select a project:</label>

        <select
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
          <option className=" w-full max-w-xs" value="" disabled>
            Select a project
          </option>
          {projects &&
            projects.map((project) => (
              <option
                value={project.projectName}
                key={project._id}
                data-id={project._id}
              >
                {project.projectName}
              </option>
            ))}
        </select>
        <div>
          <button className="btn" type="submit">
            Create Board
          </button>
        </div>
      </form>
    </div>
  );
}

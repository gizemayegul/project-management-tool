import { BoardType, ProjectType, Id } from "../utils/types";

export type BoardContextType = {
  boards: BoardType[];
  favBoards: BoardType[];
  handleFavoriteBoard: (boardId: Id) => void;
  favChange: boolean | null;
};

export type ProjectContextType = {
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  dropdown: boolean;
  favChange: boolean | null;
  favoriteProjects: ProjectType[];
  projects: ProjectType[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  handleDeleteProject: (projectId: Id) => void;
  submitHandler: (
    e: React.FormEvent<HTMLFormElement>,
    setCreateProject?: (createProject: boolean) => void
  ) => void;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  handleFavoriteProject: (projectId: Id) => void;
  setFavoriteProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
};

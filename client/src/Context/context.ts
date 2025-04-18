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

  handleFavoriteProject: (projectId: Id) => void;
  setFavoriteProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  background: boolean;
  setBackGround: React.Dispatch<React.SetStateAction<boolean>>;
};
export type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logOutUser: Function; // Add logOutUser property
  setLogOut: React.Dispatch<React.SetStateAction<boolean>>;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  handleSubmitFile: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsLineLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLineLoading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  selectedFile: File | null;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
  userUpdate: User;
  setUserUpdate: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      password: string;
    }>
  >;
  handleUserDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  logOut: boolean;
};

type User = {
  email: string;
  image?: string;
  name: string;
  password: string;
  _id?: Id;
};

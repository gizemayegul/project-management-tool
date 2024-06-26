export type Id = string | number;

export type TaskType = {
  _id: Id;
  taskName: String;
  taskPriority: String;
  columnId: String;
  index: Number;
  description: String;
  status: String;
  createdAt: string;
  updatedAt: string;
};

export type ColumnType = {
  _id: Id;
  columnName: String;
  index: Number;
  boardId: Number;
  tasks: TaskType[];
  createdAt: string;
  updatedAt: string;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

export type BoardType = {
  _id: Id;
  boardName: string;
  projectId: Id;
  userId: Id;
  imageUrl: string;
  columns: string[];
  createdAt: string;
  updatedAt: string;
};
export type Project = {
  projectName: string;
  _id: number;
  updatedAt: string;
  createdAt: string;
  imageUrl: string;
};
export type AuthContextType = {
  user: any | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logOutUser: Function; // Add logOutUser property
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ProjectContextType = {
  projects: ProjectType[] | null;
  setProjects: React.Dispatch<React.SetStateAction<null | any[]>>;
};

export type ProjectType = {
  projectName: string;
  _id: Id;
  updatedAt: string;
  createdAt: string;
  imageUrl: string;
  boards: string[];
  userId: Id;
  setCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Create = {
  name: string;
  toNavigate: string;
};

export type ProjectsDetails = {
  projectDetail: object | string;
  projectName: string;
};

export type CreateBoardDropDownProps = {
  setCreateBoard: React.Dispatch<React.SetStateAction<boolean>>;
};

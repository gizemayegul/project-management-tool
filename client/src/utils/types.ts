export type Id = string | number;

export type TaskType = {
  _id: Id;
  taskName: string;
  taskPriority: string;
  columnId: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ColumnType = {
  _id: Id;
  columnName: string;
  index: Number;
  boardId: Number;
  tasks: TaskType[];
  createdAt: string;
  updatedAt: string;
};

export type ColumnProps = {
  column: ColumnType;
  tasks: TaskType[];
  setUpdateColumns: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteTask: (columnId: Id, taskId: Id) => void;
  handleColumnDelete: (columnId: Id) => void;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

export type TaskProps = {
  task: TaskType;
  columnId: Id;
  handleDeleteTask: (columnId: Id, taskId: Id) => void;
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
  projectName: string;
};

export type CardType = {
  _id: Id;
  boardName?: string;
  columns?: string[];
  projectName?: string;
  updatedAt: string;
  createdAt: string;
  imageUrl: string;
  boards?: string[];
  userId: Id;
  projectId?: Id;
};

export type AuthContextType = {
  user: any | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logOutUser: Function; // Add logOutUser property
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
};

export type ProjectContextType = {
  projects: ProjectType[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  handleDeleteProject: (projectId: Id) => void;
  submitHandler: (
    e: React.FormEvent<HTMLFormElement>,
    setCreateProject?: (createProject: boolean) => void
  ) => void;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
};

export type ProjectType = {
  projectName: string;
  _id: Id;
  updatedAt: string;
  createdAt: string;
  imageUrl: string;
  boards: string[];
  userId: Id;
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

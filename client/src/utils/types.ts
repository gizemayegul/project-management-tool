export type Id = string | number;

export type TaskType = {
  _id: Id;
  taskName: String;
  taskPriority: String;
  columnId: String;
  index: Number;
  description: String;
  status: String;
  createdAt: Date;
  updatedAt: Date;
};

//TODO datelari string yap

export type ColumnType = {
  _id: Id;
  columnName: String;
  index: Number;
  boardId: Number;
  tasks: TaskType[];
  createdAt: Date;
  updatedAt: Date;
};

export type BoardType = {
  _id: Id;
  boardName: string;
  projectId: Id;
  userId: Id;
  imageUrl: string;
  columns: string[];
  createdAt: Date;
  updatedAt: Date;
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
  loading: boolean;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  logoutUser: Function; // Add logoutUser property
  userExpire: boolean;
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
};

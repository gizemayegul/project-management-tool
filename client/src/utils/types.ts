export type Id = string | number | undefined;

export type TaskType = {
  _id: Id;
  taskName: string;
  taskPriority: string;
  columnId: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  taskDescription: string;
};

export type ColumnType = {
  _id: Id;
  columnName: string;
  index: Number;
  boardId: Number;
  tasks: TaskType[];
  createdAt: string;
  updatedAt: string;
  color: string;
};

export type ColumnProps = {
  column: ColumnType;
  tasks: TaskType[];
  setUpdateColumns: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteTask: (taskId: Id, columnIDd: Id) => void;
  handleColumnDelete: (columnId: Id) => void;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  setUpdateTask: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TaskProps = {
  task: TaskType;
  columnId: Id;
  handleDeleteTask: (columnId: Id, taskId: Id) => void;
  setUpdateTask: React.Dispatch<React.SetStateAction<boolean>>;
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
  favorite: boolean;
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
  favorite: boolean;
};

export type ProjectType = {
  projectName: string;
  _id: Id;
  updatedAt: string;
  createdAt: string;
  imageUrl: string;
  boards: string[];
  userId: Id;
  favorite: boolean;
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
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CreateProjectDropDownProps = {
  setCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

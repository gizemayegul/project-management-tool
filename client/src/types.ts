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

export type ColumnType = {
  _id: Id;
  columnName: String;
  index: Number;
  boardId: Number;
  tasks: [TaskType];
  createdAt: Date;
  updatedAt: Date;
};

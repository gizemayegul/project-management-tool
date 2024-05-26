import { useState, useEffect } from "react";
import axios from "axios";
import Task from "../Tasks/Task";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  rectSwappingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const API_URL: string = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");
type boardTaskType = {
  _id: string;
  taskName: string;
  boardId: string;
  taskPriority: string[];
  taskStatus: string;
}[];

type Props = {
  statusName: string;
  columnId: string;
  boardId: string | undefined;
  boardTasks: boardTaskType | undefined;
  setBoardTasks: React.Dispatch<React.SetStateAction<boardTaskType>>;
};
export default function Column({
  statusName,
  columnId,
  boardId,
  setBoardTasks,
  boardTasks,
}: Props) {
  const [inputTask, setInputTask] = useState<string | string[]>("");
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  //!Todo any time event change this

  const handleTaskSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/task/create/${boardId}`,
        {
          taskStatus: columnId,
          taskName: inputTask,
          index: 1,
        },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      console.log(response);
      if (response.status === 200) {
        if (Array.isArray(boardTasks)) {
          setBoardTasks((prev) => [...prev, response.data]);
        } else {
          setBoardTasks(response.data);
        }
      }
      setInputTask("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="basis-1/2 border-2">
      <div>{statusName}</div>
      {/* <SortableContext
        strategy={verticalListSortingStrategy}
        items={boardTasks?.map((task) => task._id) || []}
        id={columnId}
      > */}
      {Array.isArray(boardTasks) &&
        boardTasks.map(
          (task) =>
            task.taskStatus === columnId && (
              <div key={task._id} className="border-2 my-3">
                {" "}
                <Task taskName={task.taskName} taskId={task._id} />
              </div>
            )
        )}{" "}
      {/* </SortableContext> */}
      <form onSubmit={handleTaskSubmit}>
        <label htmlFor="AddTask">
          Add New Task
          <input
            className="border-2"
            name="AddTask"
            value={inputTask}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputTask(e.target.value);
            }}
          />
        </label>
        <button type="submit">+</button>
      </form>
    </div>
  );
}

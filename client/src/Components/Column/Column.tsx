import { useState, useEffect, Children } from "react";
import axios from "axios";
import sort from "../../assets/images/sort.png";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const API_URL: string = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");
type taskType = {
  _id: string;
  boardId: string;
  taskName: string;
  index: number;
  length: number;
  columnId: string;
  // columnName: string;
  // taskPriority: string;
}[];
type Props = {
  statusName: string;
  columnId: string;
  boardId: string | undefined;
  children: React.ReactNode;
};
export default function Column({
  statusName,
  columnId,
  boardId,
  children,
}: Props) {
  const [inputTask, setInputTask] = useState<string | string[]>("");
  const [columnTasks, setColumnTasks] = useState<taskType>([]);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: columnId,
      data: {
        type: "column",
      },
    });

  const style = { transform: CSS.Transform.toString(transform), transition };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/task/tasks/${columnId}`, {
          headers: { Authorization: localStoreToken },
        });
        setColumnTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, [localStoreToken, columnId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/task/create/${columnId}`,
        {
          taskName: inputTask,
          boardId: boardId,
          index: columnTasks.length,
          columnName: statusName,
        },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setColumnTasks([...columnTasks, response.data]);
      } else {
        setColumnTasks(response.data);
      }
      setInputTask("");
      console.log(columnTasks);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={style}
      className="flex flex-col mx-2 bg-purple-500 p-6"
    >
      Column
      <div
        className="border-2 flex justify-between  bg-red-700 text-white p-3
      "
      >
        {statusName}
        <img {...listeners} src={sort} />
      </div>
      {children}
      <form onSubmit={handleSubmit}>
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

import { useState, useEffect } from "react";
import axios from "axios";
import sort from "../../assets/images/sort.png";
import Task from "../Tasks/Task";
import React from "react";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext } from "@dnd-kit/core";

const API_URL: string = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");
type taskType = {
  _id: string;
  boardId: string;
  taskName: string;
  index: number;
  length: number;
  columnId: string;
  columnName: string;
  taskPriority: string;
}[];
type Props = {
  statusName: string;
  columnId: string;
  boardId: string | undefined;
};
export default function Column({ statusName, columnId, boardId }: Props) {
  const [inputTask, setInputTask] = useState<string | string[]>("");
  const [columnTasks, setColumnTasks] = useState<taskType>([]);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: columnId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
  }, []);

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
    <div className="flex flex-col mx-2" ref={setNodeRef} style={style}>
      <div className="border-2 flex justify-between  bg-slate-700 text-white">
        {statusName}
        <img {...attributes} {...listeners} src={sort} />
      </div>
      <DndContext onDragEnd={handleTaskEnd}>
        <SortableContext
          items={columnTasks.map((task) => ({ id: task._id }))}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks &&
            columnTasks.map((task) => (
              <Task taskId={task._id} taskName={task.taskName} key={task._id} />
            ))}
        </SortableContext>
      </DndContext>
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

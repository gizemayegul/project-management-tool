import { useState, useEffect } from "react";
import axios from "axios";
import sort from "../../assets/images/sort.png";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Task from "../Tasks/Task";
import { DragOverlay } from "@dnd-kit/core";

const API_URL = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");

type taskType = {
  _id: string;
  boardId: string;
  taskName: string;
  index: number;
  length: number;
  columnId: string;
};

type Props = {
  statusName: string;
  columnId: string;
  boardId: string | undefined;
  children: React.ReactNode;
  activeId: string | null;
};

export default function Column({
  statusName,
  columnId,
  boardId,
  children,
  activeId,
}: Props) {
  const [inputTask, setInputTask] = useState<string | string[]>("");
  const [columnTasks, setColumnTasks] = useState<taskType[]>([]);
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
      if (response.status === 200) {
        setColumnTasks([...columnTasks, response.data]);
      } else {
        setColumnTasks(response.data);
      }
      setInputTask("");
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
      <div className="border-2 flex justify-between bg-red-700 text-white p-3">
        {statusName}
        <img {...listeners} src={sort} />
      </div>
      <SortableContext
        items={columnTasks.map((task: any) => ({ id: task._id }))}
      >
        <div className="flex items-start flex-col gap-y-4">
          {columnTasks.map((task) => (
            <Task
              key={task._id}
              taskId={task._id}
              taskName={task.taskName}
              columnId={columnId}
            />
          ))}
        </div>
      </SortableContext>
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
      <DragOverlay
        dropAnimation={{
          duration: 500,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeId ? (
          <Task taskId={activeId} taskName={activeId} columnId={columnId} />
        ) : null}
      </DragOverlay>
    </div>
  );
}

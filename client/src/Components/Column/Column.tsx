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
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";

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
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: columnId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { isOver, setNodeRef: DropRef } = useDroppable({ id: columnId });

  const styleDrop = { backgroundColor: isOver ? "red" : "transparent" };

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

  const handleTaskEnd = async (event: any) => {
    console.log(event);
    const { active, over } = event;
    if (!active || !over) return;
    if (active.id === over.id) return;
    const oldIndex = columnTasks.findIndex((task) => task._id === active.id);
    const newIndex = columnTasks.findIndex((task) => task._id === over.id);
    console.log(oldIndex, newIndex);

    const newOrder = arrayMove(columnTasks, oldIndex, newIndex);
    setColumnTasks(newOrder);

    try {
      const response = await Promise.all(
        newOrder.map((task, index) =>
          axios.put(
            `${API_URL}/task/tasks/${task._id}`,
            {
              index: index,
            },
            {
              headers: { Authorization: localStoreToken },
            }
          )
        )
      );
      console.log(response.map((response) => response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskDrop = async (event: any) => {
    console.log(event);

    try {
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col mx-2" ref={setSortableRef} style={style}>
      <div className="border-2 flex justify-between  bg-slate-700 text-white">
        {statusName}
        <img {...attributes} {...listeners} src={sort} />
      </div>
      <DndContext onDragEnd={handleTaskDrop}>
        <DndContext
          onDragEnd={handleTaskEnd}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={columnTasks.map((task) => ({ id: task._id }))}
            strategy={rectSortingStrategy}
          >
            <div ref={DropRef} style={styleDrop} className="bg-slate-300">
              {columnTasks &&
                columnTasks.map((task) => (
                  <Task
                    taskId={task._id}
                    taskName={task.taskName}
                    key={task._id}
                    taskPriority={task.taskPriority}
                  />
                ))}
            </div>
          </SortableContext>
        </DndContext>
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

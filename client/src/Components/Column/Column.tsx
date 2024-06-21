import { useState, useEffect } from "react";
import axios from "axios";
import sort from "../../assets/images/sort.png";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Task from "../Tasks/Task";
import { useDroppable } from "@dnd-kit/core";

import { ColumnType, TaskType } from "../../types";
const API_URL = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");
interface Props {
  column: ColumnType;
  tasks: TaskType[];
}

export default function Column({ column, tasks }: Props) {
  const { isOver } = useDroppable({
    id: column._id,
  });
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: column._id,
    data: {
      type: "column",
      column: column,
    },
  });
  console.log(isOver);
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const columnStyle = {
    backgroundColor: isOver ? "#E0E0E0" : "white", // change color when a task is dragged over
    borderRadius: "10px",
    padding: "20px",
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      opacity-40
      border-2
      border-pink-500
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...columnStyle }}
      // style={style}
    >
      <div
        className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColor
      border-4
      flex
      items-center
      justify-between
      "
        {...listeners}
        {...attributes}
      >
        {column.columnName}
        {column._id}
      </div>
      <SortableContext items={tasks.map((task) => task._id)}>
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

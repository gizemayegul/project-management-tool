import { useState, useEffect } from "react";
import axios from "axios";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Task from "../Tasks/Task";
import { useDroppable } from "@dnd-kit/core";
import { headers, apiUrl } from "../../utils/config";
import { ColumnType } from "../../utils/types";

export default function Column({ tasks, setColumns, ...column }: ColumnType) {
  const [addNewTask, setAddNewTask] = useState<string>("");

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
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const columnStyle = {
    backgroundColor: isOver ? "#E0E0E0" : "white", // change color when a task is dragged over
    borderRadius: "10px",
    padding: "20px",
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/columns/${column._id}/createTask`,
        { taskName: addNewTask },
        { headers: headers }
      );
      if (response.status === 200) {
        setAddNewTask("");
        setColumns((prevColumns) => {
          let newColumns = [...prevColumns];
          const findTheColumn = prevColumns.findIndex(
            (col) => col._id === column._id
          );
          newColumns[findTheColumn].tasks.push(response.data);
          return newColumns;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
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
      width-full
      "
        {...listeners}
        {...attributes}
      >
        {column.columnName}
      </div>
      <SortableContext items={tasks.map((task) => task._id)}>
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
        <form onSubmit={(e) => handleAddTask(e)}>
          <input
            onChange={(e) => {
              setAddNewTask(e.target.value);
            }}
            className="border-4"
            type="text"
            value={addNewTask}
          />
          <button type="submit">Add Task</button>
        </form>
      </SortableContext>
    </div>
  );
}

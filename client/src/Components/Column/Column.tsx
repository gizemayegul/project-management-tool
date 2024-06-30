import { useState } from "react";
import axios from "axios";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Task from "../Tasks/Task";
import { useDroppable } from "@dnd-kit/core";
import { apiUrl } from "../../utils/config";
import { ColumnProps } from "../../utils/types";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

import DeleteModal from "../DeleteModal/DeleteModal";

export default function Column({
  column,
  tasks,
  setColumns,
  handleDeleteTask,
  handleColumnDelete,
}: ColumnProps) {
  const [addNewTask, setAddNewTask] = useState<string>("");
  const { token } = useContext(AuthContext);
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
    border: "2px solid #E0E0E0",
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
        { headers: { Authorization: token } }
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
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
     
      font-bold
      flex
      items-center
      justify-between
      width-full
      "
        {...listeners}
        {...attributes}
      >
        <div className="flex justify-between w-full">
          {column.columnName}
          <DeleteModal
            handleDelete={handleColumnDelete}
            id={column._id}
            modal="my_modal_8"
          />
        </div>
      </div>
      <SortableContext items={tasks.map((task) => task._id)}>
        {tasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            columnId={column._id}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
        <form
          onSubmit={(e) => {
            handleAddTask(e);
          }}
        >
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

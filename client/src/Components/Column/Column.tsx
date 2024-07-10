import { useState } from "react";
import axios from "axios";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Task from "../Tasks/Task";
import { apiUrl } from "../../utils/config";
import { ColumnProps, Id } from "../../utils/types";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Dropdown from "../Dropdown/Dropdown";
import DeleteModal from "../DeleteModal/DeleteModal";
import Edit from "../Edit/Edit";

export default function Column({
  column,
  tasks,
  setColumns,
  handleDeleteTask,
  handleColumnDelete,
  setUpdateColumns,
}: ColumnProps) {
  const [addNewTask, setAddNewTask] = useState<string>("");
  const [columnName, setColumnName] = useState<string>(column.columnName);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [color, setColor] = useState("#00000");
  const { token } = useContext(AuthContext);

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
    border: "2px solid bg-slate-500",
    backgroundColor: isDragging ? "#B0B9B9" : "#F1F2F4",
    opacity: isDragging ? 0.5 : 1,
    height: "unsets",
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

  const handleEditColumn = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/columns/${column._id}`,
        { columnName },
        { headers: { Authorization: token } }
      );

      console.log(response.data);
      if (response.status === 200) {
        setColumnName(response.data.columnName);
        setUpdateColumns(response.data.columnName);
      }
      setShowEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
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
      w-60
      "
        {...listeners}
        {...attributes}
      >
        <div className="flex justify-between w-full ">
          {showEdit ? (
            <input
              className="border-2 rounded-md border-indigo-500 h-fit"
              type="text"
              value={columnName}
              onBlur={() => {
                setShowEdit(false);
                handleEditColumn();
              }}
              onChange={(e) => {
                setColumnName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowEdit(false);
                  handleEditColumn();
                }
              }}
            />
          ) : (
            <div className="break-all w-9/12" style={{ color: color }}>
              {columnName}
            </div>
          )}

          <div>
            <Dropdown>
              <div
                className="mx-1"
                onClick={() => {
                  setShowEdit(true);
                }}
              >
                <Edit />
                Edit
              </div>
              <div>
                <input
                  onChange={(e) => {
                    setColor(e.target.value);
                  }}
                  type="color"
                  className="border-2 rounded-md h-6 w-6"
                />
                <span>Change Color</span>
              </div>
              <DeleteModal
                handleDelete={() => {
                  handleColumnDelete(column._id);
                }}
                id1={column._id}
                modal="my_modal_8"
                showDelete={true}
              />
            </Dropdown>
          </div>
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

import { useState } from "react";
import axios from "axios";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Task from "../Tasks/Task";
import { apiUrl } from "../../utils/config";
import { ColumnProps, Id } from "../../utils/types";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Dropdown from "../Dropdown/Dropdown";
import DeleteModal from "../DeleteModal/DeleteModal";
import Edit from "../Edit/Edit";
import { DragHandleIcon } from "@chakra-ui/icons";
import { PlusIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/16/solid";

export default function Column({
  column,
  tasks,
  setColumns,
  handleDeleteTask,
  handleColumnDelete,
  setUpdateColumns,
  setUpdateTask,
}: ColumnProps) {
  const [addNewTask, setAddNewTask] = useState<string>("");
  const [columnName, setColumnName] = useState<string>(column.columnName);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [color, setColor] = useState(column.color);

  const { token } = useContext(AuthContext);

  // const debounce = (func: void, wait) => {
  //   let timeout;
  //   return (...args: Arguments) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => func.apply(this, args), wait);
  //   };
  // };

  //TODO debounce implementation

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
  const style: React.CSSProperties = {
    transition: `transform 150ms cubic-bezier(0.25, 1, 0.5, 1)`,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const columnStyle = ` ${isDragging ? "opacity-30" : ""} ${
    isDragging ? "bg-base-[#B0B9B9]" : "bg-base-300"
  }
  opacity-100
  h-fit
  rounded-lg
  p-4
`;

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

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const response = await axios.put(
        `${apiUrl}/columns/${column._id}/color`,
        {
          color: e.target.value,
        },
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        setColor(response.data.color);
        setColumns((prevColumns) => {
          let newColumns = [...prevColumns];
          const findTheColumn = prevColumns.findIndex(
            (col) => col._id === column._id
          );
          newColumns[findTheColumn].color = response.data.color;
          return newColumns;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditColumn = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/columns/${column._id}`,
        { columnName },
        { headers: { Authorization: token } }
      );

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
    <div ref={setNodeRef} style={style} className={columnStyle}>
      <div
        className="
        
          text-md
        min-h-fit
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
        <div className="flex justify-between items-start w-full ">
          <div>
            <DragHandleIcon />
          </div>

          {showEdit ? (
            <input
              className=" input border-2 w-2/3 rounded-md border-indigo-500 h-fit"
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
            <div className="break-all w-9/12 mt-0.5" style={{ color: color }}>
              {columnName}
            </div>
          )}

          <div className="flex">
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
              <label htmlFor="changeColor">
                <input
                  id="changeColor"
                  name="changeColor"
                  onChange={(e) => {
                    handleColorChange(e);
                  }}
                  type="color"
                  className="color-input"
                />
                Change Color
              </label>
              <DeleteModal
                handleDelete={() => {
                  handleColumnDelete(column._id);
                }}
                id={column._id}
                modal={column._id}
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
            setUpdateTask={setUpdateTask}
          />
        ))}
        <form
          className="flex space-x-4 space-y-2 items-center"
          onSubmit={(e) => {
            handleAddTask(e);
          }}
        >
          {showAddTask ? (
            <div className="flex flex-col space-y-4">
              <input
                required
                onChange={(e) => {
                  setAddNewTask(e.target.value);
                }}
                className="input input-bordered w-full shadow-xl p-2 "
                type="text"
                value={addNewTask}
              />
              <div className="flex items-center space-x-4">
                <button
                  className="btn p-0 m-0 bg-indigo-600 text-white w-fit px-4"
                  type="submit"
                >
                  Add Task
                </button>
                <button onClick={() => setShowAddTask((prev) => !prev)}>
                  <XMarkIcon className="h-8" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex space-x-4"
              onClick={() => setShowAddTask((prev) => !prev)}
            >
              <PlusIcon className="h-5" />
              <button className="p-0 m-0" type="submit">
                <h2 className="pb-2">Add Task</h2>
              </button>
            </div>
          )}
        </form>
      </SortableContext>
    </div>
  );
}

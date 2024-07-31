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
  const [color, setColor] = useState("#00000");
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
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
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    border: "2px solid bg-slate-500",
    backgroundColor: isDragging ? "#B0B9B9" : "#F1F2F4",
    opacity: isDragging ? 0.5 : 1,
    height: "fit-content",
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
          <DragHandleIcon />

          {showEdit ? (
            <input
              className="border-2 rounded-md border-indigo-500 hsad
              -fit"
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
              <div>
                <input
                  onChange={(e) => {
                    setColor(e.target.value);
                  }}
                  type="color"
                  className="input input-bordered w-full "
                />
                <span>Change Color</span>
              </div>
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
                  className="p-0 m-0 btn bg-indigo-600 text-white w-fit px-4"
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
            <>
              <PlusIcon className="h-5" />
              <button
                onClick={() => setShowAddTask((prev) => !prev)}
                className="p-0 m-0"
                type="submit"
              >
                <h2 className="pb-2">Add Task</h2>
              </button>
            </>
          )}
        </form>
      </SortableContext>
    </div>
  );
}

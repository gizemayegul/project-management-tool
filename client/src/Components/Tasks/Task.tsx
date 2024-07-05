import { TaskProps } from "../../utils/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteModal from "../DeleteModal/DeleteModal";
import Edit from "../Edit/Edit";
import { useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import { AuthContext } from "../../Context/AuthContext";

export default function Task({ task, columnId, handleDeleteTask }: TaskProps) {
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [taskName, setTaskName] = useState(task.taskName);
  const { token } = useContext(AuthContext);
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task: task,
      column: columnId,
    },
  });
  const style = {
    transition,
    // transform: CSS.Transform.toString(transform),
  };

  const taskStyle = {
    style:
      "h-fit-content break-words break-all min-h-12 px-2 my-2 items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset cursor-grab relative w-60 bg-white shadow-xl",
    editStyle:
      "h-fit-content break-words break-all  w-60 min-h-12  transition-all scale-y-110 p-3 min-h-12 z-[70] px-2 my-2 items-center bg-slate-300 flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:border-slate-500  cursor-grab relative task tra",
    draggingStyle:
      "opacity-30 break-words break-all px-2  w-60 h-fit-content min-h-12 items-center my-2 flex text-left rounded-xl border-2 border-slate-500  cursor-grab relative",
  };

  const handleEditTask = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/columns/${columnId}/editTask/${task._id}`,
        { taskName },
        { headers: { Authorization: token } }
      );
      setEdit((prev) => !prev);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className={taskStyle.draggingStyle}>
        {" "}
        <div className="flex justify-between w-full">
          <div className="w-60 py-2 px-1">{taskName}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={edit ? taskStyle.editStyle : taskStyle.style}
      ref={setNodeRef}
      style={style}
      {...(edit ? {} : listeners)} // Apply listeners only if not in edit mode
      {...(edit ? {} : attributes)}
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
    >
      <div className="flex justify-between w-full">
        {!edit ? (
          <>
            <div className="w-fit py-2 px-1">{taskName}</div>
            <div className="flex justify-between absolute right-1 top-3 ">
              {show && (
                <>
                  <div
                    className="mx-1 bg-[#F1F2F4] px-1 rounded-md"
                    onClick={() => {
                      setEdit((prev) => !prev);
                    }}
                  >
                    <Edit />
                  </div>
                  <div className=" bg-[#F1F2F4] px-1 rounded-xl">
                    <DeleteModal
                      handleDelete={handleDeleteTask}
                      id1={columnId}
                      id={task._id}
                      modal="my_modal_10"
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="h-fit">
            <textarea
              className="w-full h-fit px-2 py-1 rounded-xl border-2 border-slate-500  cursor-grab relative"
              onChange={(e) => setTaskName(e.target.value)}
              value={taskName}
              role="textbox"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditTask();
                }
              }}
            ></textarea>
            <button className="btn btn-sm" onClick={handleEditTask}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

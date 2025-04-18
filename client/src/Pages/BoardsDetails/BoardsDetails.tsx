import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Column from "../../Components/Column/Column";
import { ColumnType, TaskType, Id } from "../../utils/types";
import { createPortal } from "react-dom";
import Task from "../../Components/Tasks/Task";
import { apiUrl } from "../../utils/config";
import { AuthContext } from "../../Context/AuthContext";
import { BoardType } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import Drawer from "../../Components/Drawer/Drawer";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Loading from "../../Components/Loading/Loading";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
  TouchSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

export default function BoardsDetails() {
  const { boardId, projectId } = useParams<{
    boardId: string;
    projectId: string;
  }>();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [addNewColumn, setAddNewColumn] = useState<string>("");
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [updateColumns, setUpdateColumns] = useState<string>("");
  const [boardDetails, setBoardDetails] = useState<BoardType>();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [show, setShow] = useState(false);
  const [boardName, setBoardName] = useState<string>("");
  const [updateTask, setUpdateTask] = useState<boolean>(false);
  const [addNewColumnShow, setAddNewColumnShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean | undefined>(
    undefined
  );

  const navigate = useNavigate();

  const { token } = useContext(AuthContext);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Add a delay for touch to avoid accidental drags
        tolerance: 10, // Increase tolerance for touch interactions
      },
    })
  );

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get(`${apiUrl}/columns/${boardId}`, {
          headers: { Authorization: token },
        });
        const responseBoard = await axios.get(
          `${apiUrl}/${projectId}/boards/${boardId}`,
          {
            headers: { Authorization: token },
          }
        );
        setBoardDetails(responseBoard.data[0]);
        setIsLoading(false);

        setColumns(response.data);
      } catch (error) {
        console.log("error happened");
      }
    };

    fetchColumns();
  }, [boardId, updateColumns, show, updateTask]);

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "task") {
      const task = event.active.data.current.task;
      const columnId = event.active.data.current.column;
      setActiveTask({ ...task, columnId });
      return;
    }
  }

  async function onDragOver(event: DragOverEvent) {
    try {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isActiveATask = active.data.current?.type === "task";
      const isOverATask = over.data.current?.type === "task";
      const isOverAColumn = over.data.current?.type === "column";

      if (!isActiveATask) return;

      if (isActiveATask && isOverATask) {
        const findColumnActive = columns.find((col) =>
          col.tasks.some((t) => t._id === activeId)
        );
        const findOverColumn = columns.find((col) =>
          col.tasks.some((t) => t._id === overId)
        );

        if (!findColumnActive || !findOverColumn) return;
        if (findColumnActive._id !== findOverColumn._id) {
          const activeIndex = findColumnActive.tasks.findIndex(
            (t) => t._id === activeId
          );

          const overIndex = findOverColumn.tasks.findIndex(
            (t) => t._id === overId
          );
          if (activeIndex === -1 || overIndex === -1) return;
          // const activeTask = findColumnActive.tasks.find(
          //   (t) => t._id === activeId
          // );
          // const overTask = findOverColumn.tasks.find((t) => t._id === overId);
          const activeColumnIndex = columns.findIndex(
            (columns) => columns._id === findColumnActive._id
          );
          const overColumnIndex = columns.findIndex(
            (columns) => columns._id === findOverColumn._id
          );
          let newColumns = [...columns];
          const [removeditem] = newColumns[activeColumnIndex].tasks.splice(
            activeIndex,
            1
          );
          newColumns[overColumnIndex].tasks.splice(overIndex, 0, removeditem);
          // newColumns[overColumnIndex].tasks.unshift(removeditem);

          setColumns(newColumns);

          await axios.put(
            `${apiUrl}/columns/tasks/updateColumns`,
            { updatedColumns: newColumns },
            {
              headers: { Authorization: token },
            }
          );
        }
        if (!findColumnActive) return;

        const activeIndex = findColumnActive.tasks.findIndex(
          (t) => t._id === activeId
        );
        const overIndex = findColumnActive.tasks.findIndex(
          (t) => t._id === overId
        );
        if (activeIndex === -1 || overIndex === -1) return;

        let newOrders = [...findColumnActive.tasks];
        newOrders = arrayMove(newOrders, activeIndex, overIndex);

        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col._id === findColumnActive._id
              ? { ...col, tasks: newOrders }
              : col
          )
        );
        await axios.put(
          `${apiUrl}/columns/${findColumnActive._id}/tasks/reorder`,
          {
            tasks: newOrders,
          },
          {
            headers: { Authorization: token },
          }
        );
      }

      // Dragging a task over a column

      if (isActiveATask && isOverAColumn) {
        const overColumn = columns.find((col) => col._id === overId);
        const activeColumn = columns.find((col) =>
          col.tasks.some((t) => t._id === activeId)
        );
        if (!overColumn || !activeColumn) return;
        const activeTask = activeColumn.tasks.find((t) => t._id === activeId);
        const activeColumnIndex = columns.findIndex(
          (columns) => columns._id === activeColumn._id
        );
        const overColumnIndex = columns.findIndex(
          (columns) => columns._id === overColumn._id
        );

        if (!overColumn || !activeColumn || !activeTask) return;
        const activeIndex = activeColumn.tasks.findIndex(
          (task) => task._id === activeId
        );
        let newColumns = [...columns];
        const [removeditem] = newColumns[activeColumnIndex].tasks.splice(
          activeIndex,
          1
        );
        newColumns[overColumnIndex].tasks.push(removeditem);
        setColumns(newColumns);
        await axios.put(
          `${apiUrl}/columns/tasks/updateColumns`,
          { updatedColumns: newColumns },
          {
            headers: { Authorization: token },
          }
        );
      }
    } catch (error) {
      console.error("Error during onDragOver:", error);
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    try {
      setActiveColumn(null);
      setActiveTask(null);

      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isActiveAColumn = active.data.current?.type === "column";
      if (!isActiveAColumn) return;

      const activeColumnIndex = columns.findIndex(
        (col) => col._id === activeId
      );
      const overColumnIndex = columns.findIndex((col) => col._id === overId);

      let newColumns = [...columns];

      newColumns = arrayMove(newColumns, activeColumnIndex, overColumnIndex);
      const updatedColumns = newColumns.map((column, index) => ({
        ...column,
        index: index,
      }));
      setColumns(updatedColumns);

      await axios.put(
        `${apiUrl}/columns/reorder`,
        { updatedColumns: updatedColumns },
        { headers: { Authorization: token } }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitColumn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addNewColumn) return;
    try {
      const response = await axios.post(
        `${apiUrl}/columns`,
        {
          columnName: addNewColumn,
          tasks: [],
          boardId: boardId,
          index: columns.length,
          projectId: projectId,
        },
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        setColumns((prevColumns) => [...prevColumns, response.data]);
        setAddNewColumn("");
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId: Id, columnId: Id) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/columns/${columnId}/deleteTask/${taskId}`,
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        const response = await axios.get(`${apiUrl}/columns/${boardId}`, {
          headers: { Authorization: token },
        });
        setColumns(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleColumnDelete = async (columnId: Id) => {
    console.log(columnId, "columnId");
    try {
      const response = await axios.delete(`${apiUrl}/columns/${columnId}`, {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        setColumns((prevColumns) => {
          return prevColumns.filter((col) => col._id !== columnId);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteBoard = async (boardId: Id) => {
    try {
      const response = await axios.delete(`${apiUrl}/boards/${boardId}`, {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        navigate("/dashboard");
      }

      setBoards((prev) => prev.filter((board) => board._id !== boardId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBoardName = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/boards/${boardId}/boardName`,
        {
          boardName: boardName,
        },
        {
          headers: { Authorization: token },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <div
        className="h-20 w-full rounded-md bg-base-300
 flex justify-between items-center px-4 mb-3 mt-3 min-h-max "
      >
        <div>
          {boardDetails && !show && <div>{boardDetails.boardName}</div>}
          {show && (
            <div className={`flex align-bottom space-x-4`}>
              <input
                className="input input-bordered w-full "
                type="text"
                value={boardName}
                onChange={(e) => {
                  setBoardName(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  setShow(false);
                  handleBoardName();
                  setIsDrawerOpen(undefined);
                }}
                className="btn sm:mx-0 bg-indigo-600  text-white hover:bg-indigo-500  hover:text-white rounded-md px-3 py-2 text-sm font-medium "
              >
                Change Name
              </button>
            </div>
          )}
        </div>
        <Drawer
          handleDelete={handledeleteBoard}
          id={boardDetails?._id ?? ""}
          showDelete={true}
          show={show}
          setShow={setShow}
          type="boards"
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </div>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
        // collisionDetection={closestCenter}
      >
        <div className="m-auto flex gap-4 overflow-x-auto min-h-screen h-screen">
          <div className="flex gap-4">
            <SortableContext
              // strategy={rectSortingStrategy}
              items={columns.map((column) => column._id)}
            >
              {columns.map((column) => (
                <Column
                  key={column._id}
                  column={column}
                  tasks={column.tasks}
                  setColumns={setColumns}
                  handleDeleteTask={handleDeleteTask}
                  handleColumnDelete={handleColumnDelete}
                  setUpdateColumns={setUpdateColumns}
                  setUpdateTask={setUpdateTask}
                />
              ))}
            </SortableContext>
            <form
              className="bg-base-300  h-fit w-60 p-4 rounded-md bg-opacity-30"
              onSubmit={(e) => handleSubmitColumn(e)}
            >
              {addNewColumnShow ? (
                <div className="flex flex-col space-y-4">
                  <input
                    required
                    onChange={(e) => {
                      setAddNewColumn(e.target.value);
                    }}
                    className="input input-bordered w-full shadow-xl p-2 "
                    type="text"
                    value={addNewColumn}
                  />
                  <div className="flex items-center space-x-4">
                    <button
                      className=" p-0 m-0 btn bg-indigo-600 text-white w-fit px-4"
                      type="submit"
                    >
                      Add Column
                    </button>
                    <button
                      onClick={() => setAddNewColumnShow((prev) => !prev)}
                    >
                      <XMarkIcon className="h-8" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex space-x-2"
                  onClick={() => setAddNewColumnShow((prev) => !prev)}
                >
                  <PlusIcon className="h-5" />
                  <button className="p-0 m-0" type="submit">
                    <h2 className="pb-2"> Add Column</h2>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <div>
                <Column
                  column={activeColumn}
                  tasks={activeColumn.tasks}
                  setColumns={setColumns}
                  handleDeleteTask={handleDeleteTask}
                  handleColumnDelete={handleColumnDelete}
                  setUpdateColumns={setUpdateColumns}
                  setUpdateTask={setUpdateTask}
                />
              </div>
            )}
            {activeTask && (
              <Task
                task={activeTask}
                columnId={activeTask.columnId}
                handleDeleteTask={handleDeleteTask}
                setUpdateTask={setUpdateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

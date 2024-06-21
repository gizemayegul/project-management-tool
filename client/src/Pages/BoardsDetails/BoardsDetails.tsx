import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Column from "../../Components/Column/Column";
import { ColumnType, TaskType } from "../../types";
import { createPortal } from "react-dom";
import Task from "../../Components/Tasks/Task";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { act } from "react-dom/test-utils";
import { set } from "mongoose";

const API_URL: string = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");

export default function BoardsDetails() {
  const { boardId } = useParams<{ boardId: string }>();

  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get(`${API_URL}/columns/${boardId}`, {
          headers: { Authorization: localStoreToken },
        });

        setColumns(response.data);
      } catch (error) {
        console.log("error happened");
      }
    };

    fetchColumns();
  }, [boardId, localStoreToken]);

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  // async function onDragOver(event: DragOverEvent) {
  //   try {
  //     const { active, over } = event;
  //     if (!over) return;

  //     const activeId = active.id;
  //     const overId = over.id;

  //     if (activeId === overId) return;

  //     const isActiveATask = active.data.current?.type === "task";
  //     const isOverATask = over.data.current?.type === "task";
  //     const isOverAColumn = over.data.current?.type === "column";

  //     if (!isActiveATask) return;

  //     // Im dropping a Task over another Task
  //     if (isActiveATask && isOverATask) {
  //       console.log(activeId);
  //       console.log(overId);

  //       const findColumnActive = columns.find((col) =>
  //         col.tasks.find((t) => t._id === activeId)
  //       );
  //       const overIndex = findColumnActive?.tasks.findIndex(
  //         (t) => t._id === overId
  //       );
  //       const activeIndex = findColumnActive?.tasks.findIndex(
  //         (t) => t._id === activeId
  //       );
  //       console.log(overIndex, "over");
  //       console.log(activeIndex, "active");

  //       console.log(findColumnActive?.tasks);

  //       let newOrders = [...findColumnActive?.tasks];
  //       newOrders = arrayMove(newOrders, activeIndex, overIndex);
  //       console.log(newOrders);
  //       console.log(columns);
  //       setColumns((prev) =>
  //         prev.map((col) =>
  //           col._id === findColumnActive._id ? { ...col, tasks: newOrders } : col
  //         )
  //       );
  //     }

  //     // Im dropping a Task over a column
  //     // if (isActiveATask && isOverAColumn) {
  //     //   try {
  //     //     const activeIndex = tasks.findIndex((t) => t._id === activeId);
  //     //     const overColumn = columns.find((col) => col._id === overId);

  //     //     // Remove the task from its current position and add it to the new column
  //     //     setTasks((tasks) => {
  //     //       const updatedTasks = [...tasks];
  //     //       const [movedTask] = updatedTasks.splice(activeIndex, 1); // Remove the task
  //     //       movedTask.columnId = String(overId);
  //     //       // Optionally, you can place the task at the end of the new column or at a specific position
  //     //       updatedTasks.push(movedTask); // Add to the end of the new column
  //     //       return updatedTasks;
  //     //     });
  //     //     console.log(overId);
  //     //     // const response = await axios.get(
  //     //     //   `${API_URL}/columns/boards/${overId}`,
  //     //     //   { headers: { Authorization: localStoreToken } }
  //     //     // );
  //     //     // console.log(response.data.tasks.length);
  //     //     // const newIndex = response.data.tasks.length;
  //     //     // const response2 = await axios.put(
  //     //     //   `${API_URL}/task/tasks/${activeId}`,
  //     //     //   {
  //     //     //     columnId: overId,
  //     //     //     columnName: overColumn?.columnName,
  //     //     //     index: newIndex,
  //     //     //   },
  //     //     //   { headers: { Authorization: localStoreToken } }
  //     //     // );
  //     //   } catch (error) {
  //     //     console.log("error", error);
  //     //   }
  //     // }
  //   } catch (error) {
  //     console.log("error");
  //   }
  // }
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
          `${API_URL}/columns/${findColumnActive._id}/tasks/reorder`,
          {
            tasks: newOrders,
          },
          {
            headers: { Authorization: localStoreToken },
          }
        );
      }

      if (isActiveATask && isOverAColumn) {
        const findTheColumn = columns.find((col) => col._id === overId);
        const oldColumn = columns.find((col) =>
          col.tasks.some((t) => t._id === activeId)
        );
        const activeTask = oldColumn?.tasks.find((t) => t._id === activeId);

        if (!findTheColumn || !activeTask || !oldColumn) return;

        setColumns((prevColumns) =>
          prevColumns.map((col) => {
            if (col._id === oldColumn._id) {
              return {
                ...col,
                tasks: col.tasks.filter((t) => t._id !== activeId),
              };
            } else if (col._id === findTheColumn._id) {
              return {
                ...col,
                tasks: [
                  ...col.tasks,
                  {
                    ...activeTask,
                    columnId: findTheColumn._id,
                    index: col.tasks.length,
                  },
                ],
              };
            } else {
              return col;
            }
          })
        );
      }

      // Send the updated columns to the backend
      const response = await axios.put(
        `${API_URL}/columns/update`,
        { columns },
        { headers: { Authorization: localStoreToken } }
      );
      console.log(response.data);
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

      console.log("DRAG END");

      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col._id === activeId
        );

        const overColumnIndex = columns.findIndex((col) => col._id === overId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
      const overColumnIndex = columns.findIndex((col) => col._id === overId);
      const activeIdIndex = columns.findIndex((col) => col._id === activeId);
      await axios.put(
        `${API_URL}/columns/${activeId}`,
        { index: overColumnIndex },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      await axios.put(
        `${API_URL}/columns/${overId}`,
        { index: activeIdIndex },
        {
          headers: { Authorization: localStoreToken },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columns.map((column) => column._id)}>
              {columns.map((column) => (
                <Column key={column._id} column={column} tasks={column.tasks} />
              ))}
            </SortableContext>
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column column={activeColumn} tasks={activeColumn.tasks} />
            )}
            {activeTask && <Task task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

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
        const overColumn = columns.find((col) => col._id === overId);
        const activeColumn = columns.find((col) =>
          col.tasks.some((t) => t._id === activeId)
        );
        const activeTask = activeColumn?.tasks.find((t) => t._id === activeId);
        const activeColumnIndex = columns.findIndex(
          (columns) => columns._id === activeColumn?._id
        );
        const overColumnIndex = columns.findIndex(
          (columns) => columns._id === overColumn?._id
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
          `${API_URL}/columns/${boardId}/updateColumns`,
          { updatedColumns: newColumns },
          {
            headers: { Authorization: localStoreToken },
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

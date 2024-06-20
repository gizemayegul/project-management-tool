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

const API_URL: string = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");

export default function BoardsDetails() {
  const { boardId } = useParams<{ boardId: string }>();
  const [tasks, setTasks] = useState<TaskType[]>([]);

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
        const response = await axios.get(
          `${API_URL}/column/columns/${boardId}`,
          {
            headers: { Authorization: localStoreToken },
          }
        );

        setColumns(response.data);
      } catch (error) {
        console.log("error happened");
      }
    };

    fetchColumns();
  }, [boardId, localStoreToken]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/task/tasks/${boardId}`, {
          headers: { Authorization: localStoreToken },
        });
        setTasks(response.data);
      } catch (error) {
        console.log("task error");
      }
    };
    fetchTasks();
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

      // Im dropping a Task over another Task
      if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t._id === activeId);
          const overIndex = tasks.findIndex((t) => t._id === overId);

          if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
            // Fix introduced after video recording
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }

          return arrayMove(tasks, activeIndex, overIndex);
        });
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overIndex = tasks.findIndex((t) => t._id === overId);
        const response = await axios.put(
          `${API_URL}/task/tasks/${activeId}`,
          { index: overIndex },
          { headers: { Authorization: localStoreToken } }
        );
        const response2 = await axios.put(
          `${API_URL}/task/tasks/${overId}`,
          { index: activeIndex },
          { headers: { Authorization: localStoreToken } }
        );
      }

      // Im dropping a Task over a column
      if (isActiveATask && isOverAColumn) {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overColumn = columns.find((col) => col._id === overId);
        console.log(overColumn?.columnName);

        setTasks((tasks) => {
          tasks[activeIndex].columnId = String(overId);
          console.log("DROPPING TASK OVER COLUMN", { activeIndex });
          return arrayMove(tasks, activeIndex, activeIndex);
        });

        const response2 = await axios.put(
          `${API_URL}/task/tasks/${activeId}`,
          { columnId: overId, columnName: overColumn?.columnName },
          { headers: { Authorization: localStoreToken } }
        );
        console.log(response2.data, "145");
      }
    } catch (error) {
      console.log("error");
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
        `${API_URL}/column/columns/${activeId}`,
        { index: overColumnIndex },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      await axios.put(
        `${API_URL}/column/columns/${overId}`,
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
        collisionDetection={closestCenter}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columns.map((column) => column._id)}>
              {columns.map((column) => (
                <Column
                  key={column._id}
                  column={column}
                  tasks={tasks.filter((task) => task.columnId === column._id)}
                />
              ))}
            </SortableContext>
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn._id
                )}
              />
            )}
            {activeTask && <Task task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

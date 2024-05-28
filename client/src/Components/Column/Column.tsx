import { useState, useEffect } from "react";
import axios from "axios";
import sort from "../../assets/images/sort.png";
import Task from "../Tasks/Task";
import React from "react";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  horizontalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  rectIntersection,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import TaskWrapper from "../TaskWrapper/TaskWrapper";

const API_URL: string = import.meta.env.VITE_SERVER_URL;
const localStoreToken = localStorage.getItem("token");
type taskType = {
  _id: string;
  boardId: string;
  taskName: string;
  index: number;
  length: number;
  columnId: string;
  columnName: string;
  taskPriority: string;
}[];
type Props = {
  statusName: string;
  columnId: string;
  boardId: string | undefined;
  // dragEnd: boolean;
  // setDragEnd: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Column({ statusName, columnId, boardId }: Props) {
  const [inputTask, setInputTask] = useState<string | string[]>("");
  const [columnTasks, setColumnTasks] = useState<taskType>([]);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );
  const [activeId, setActiveId] = useState(null);

  const { isOver, setNodeRef } = useDroppable({ id: columnId });

  const styleDrop = {
    backgroundColor: isOver ? "green" : "purple",
  };

  const {
    attributes,
    listeners,
    setNodeRef: SortRef,
    transform,
    transition,
  } = useSortable({
    id: columnId,
  });

  const styleSort = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/task/tasks/${columnId}`, {
          headers: { Authorization: localStoreToken },
        });
        setColumnTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, [localStoreToken, columnId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/task/create/${columnId}`,
        {
          taskName: inputTask,
          boardId: boardId,
          index: columnTasks.length,
          columnName: statusName,
        },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setColumnTasks([...columnTasks, response.data]);
      } else {
        setColumnTasks(response.data);
      }
      setInputTask("");
      console.log(columnTasks);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEnd = (event: any) => {
    // const { active, over } = event;
    console.log(event);
    // console.log(active, "active");
    // console.log(over, "over");
    // console.log(
    //   active.data.current.sortable.containerId,
    //   "active-container",
    //   active.data.current.sortable.index,
    //   "active-index"
    // );
    // console.log(
    //   over.data.current.sortable.containerId,
    //   "over-container",
    //   over.data.current.sortable.index,
    //   "over-index"
    // );
    // console.log(
    //   "collisions",
    //   event.collisions[0].data.droppableContainer.data.current.sortable.items
    // );
  };
  const handleEnd2 = (event: any) => {
    console.log(event);
  };
  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }

  return (
    <div
      className="flex flex-col mx-2 bg-purple-600 p-6"
      ref={SortRef}
      style={styleSort}
    >
      Column
      <div className="border-2 flex justify-between  bg-red-700 text-white">
        {statusName}
        <img src={sort} {...listeners} {...attributes} />
      </div>
      <div ref={setNodeRef} style={styleDrop} className="bg-red-900 p-6">
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleEnd}
        >
          <SortableContext
            strategy={rectSortingStrategy}
            items={columnTasks.map((task) => ({
              id: task._id,
            }))}
          >
            {columnTasks &&
              columnTasks.map((task) => (
                <DndContext
                  collisionDetection={closestCenter}
                  sensors={sensors}
                  onDragEnd={handleEnd2}
                >
                  {/* <TaskWrapper key={task._id} taskId={task._id}> */}
                  <DragOverlay
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <Task
                      taskId={task._id}
                      taskName={task.taskName}
                      key={task._id}
                      taskPriority={task.taskPriority}
                    />
                  </DragOverlay>
                  {/* </TaskWrapper> */}
                </DndContext>
              ))}
          </SortableContext>
        </DndContext>

        <form onSubmit={handleSubmit}>
          <label htmlFor="AddTask">
            Add New Task
            <input
              className="border-2"
              name="AddTask"
              value={inputTask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputTask(e.target.value);
              }}
            />
          </label>
          <button type="submit">+</button>
        </form>
      </div>
    </div>
  );
}

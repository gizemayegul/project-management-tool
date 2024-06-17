import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Column from "../../Components/Column/Column";
import Task from "../../Components/Tasks/Task";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragStartEvent,
  UniqueIdentifier,
  DragMoveEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  rectSwappingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type ColumnsType = {
  _id: string;
  boardId: string;
  columnName: string;
  index: number;
  tasks: string | string[];
  length: number;
}[];

const API_URL: string = import.meta.env.VITE_SERVER_URL;

export default function BoardsDetails() {
  const { boardId } = useParams<{ boardId: string }>();
  const [columns, setColumns] = useState<ColumnsType>([]);
  const [addColumn, setAddColumn] = useState("");
  const [activeId, setActiveId] = useState<UniqueIdentifier | null | string>(
    ""
  );
  const localStoreToken = localStorage.getItem("token");
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/column/columns/${boardId}`,
          {
            headers: { Authorization: localStoreToken },
          }
        );
        setColumns(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBoards();
  }, [boardId, localStoreToken]);

  const handleColumnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/column/columns/${boardId}`,
        {
          index: columns.length,
          columnName: addColumn,
          boardId: boardId,
        },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      if (response.status === 200) {
        setColumns((prev) => [...prev, response.data]);
        setAddColumn("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //TODO: Implement any interface
  //change the column of the task when dragging the task into
  const handleStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  };
  const handleMove = (event: DragMoveEvent) => {
    const { over, active } = event;

    if (
      active.data.current?.type === "task" &&
      over?.data.current?.type === "task" &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeColumn = columns.find((column) => column._id === active.id);

      const activeTask = columns.find((column) =>
        column.tasks.map((task) => task._id).includes(over.id)
      );
      console.log(activeTask, "activeTask");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleStart}
      onDragMove={handleMove}
    >
      <div className="flex bg-purple-800 p-6 ">
        Board
        <SortableContext
          strategy={rectSwappingStrategy}
          items={columns.map((column) => ({ id: column._id }))}
        >
          {columns.map((column) => (
            <Column
              activeId={activeId}
              key={column._id}
              statusName={column.columnName}
              columnId={column._id}
              boardId={boardId}
            ></Column>
          ))}
          <form onSubmit={handleColumnSubmit}>
            <div>
              <label htmlFor="new column">
                Add New Column
                <input
                  className="border-2"
                  name="new column"
                  type="text"
                  value={addColumn}
                  onChange={(e) => setAddColumn(e.target.value)}
                />
              </label>
            </div>
            <button className="border-2" type="submit">
              Add Column
            </button>
          </form>
        </SortableContext>
      </div>
    </DndContext>
  );
}

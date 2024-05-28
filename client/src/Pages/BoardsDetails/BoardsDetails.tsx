import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Column from "../../Components/Column/Column";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";

type initialColumnsType = {
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
  const [initialColumns, setInitialColumns] = useState<initialColumnsType>([]);
  const [addColumn, setAddColumn] = useState("");
  const [dragEnd, setDragEnd] = useState(false);
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
        setInitialColumns(response.data);
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
          index: initialColumns.length,
          columnName: addColumn,
          boardId: boardId,
        },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      if (response.status === 200) {
        setInitialColumns((prev) => [...prev, response.data]);
        setAddColumn("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //TODO: Implement any interface
  const handleOver = (event: any) => {
    const { over, active } = event;
    console.log(over, "over");
    console.log(active, "active");
  };

  return (
    <DndContext
      onDragEnd={handleOver}
      collisionDetection={closestCenter}
      sensors={sensors}
    >
      <div className="flex bg-purple-800 p-6 ">
        Board
        <SortableContext
          items={initialColumns.map((column) => ({ id: column._id }))}
        >
          {initialColumns.map((column) => (
            <Column
              key={column._id}
              statusName={column.columnName}
              columnId={column._id}
              boardId={boardId}
            />
          ))}
        </SortableContext>
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
      </div>
    </DndContext>
  );
}

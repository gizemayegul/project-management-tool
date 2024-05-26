import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Column from "../../Components/Column/Column";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
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
  const localStoreToken = localStorage.getItem("token");

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

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!active || !over) return;

    const oldIndex = initialColumns.findIndex(
      (column) => column._id === active.id
    );
    const newIndex = initialColumns.findIndex(
      (column) => column._id === over.id
    );

    if (oldIndex === newIndex) return;

    const newOrder = arrayMove(initialColumns, oldIndex, newIndex);
    setInitialColumns(newOrder);

    try {
      await Promise.all(
        newOrder.map((column, index) =>
          axios.put(
            `${API_URL}/column/columns/${column._id}`,
            { index: index },
            {
              headers: { Authorization: localStoreToken },
            }
          )
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex">
        <SortableContext
          strategy={rectSwappingStrategy}
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

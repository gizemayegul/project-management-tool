import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Column from "../../Components/Column/Column";
import Task from "../../Components/Tasks/Task";

type initialColumnsType = {
  boardColumns: {
    _id: string;
    statusName: string;
  }[];
  boardName: string;
  imageUrl: string;
  projectId: string;
};

type boardTaskType = {
  _id: string;
  taskName: string;
  boardId: string;
  taskPriority: string[];
  taskStatus: string;
}[];

const API_URL: string = import.meta.env.VITE_SERVER_URL;

export default function BoardsDetails() {
  const { boardId, projectId } = useParams<{
    boardId: string;
    projectId: string;
  }>();
  const [initialColumns, setInitialColumns] = useState<initialColumnsType>();
  const [boardTasks, setBoardTasks] = useState<boardTaskType>([]);

  const localStoreToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/board/${projectId}/boards/${boardId}`,
          {
            headers: { Authorization: localStoreToken },
          }
        );
        console.log(response.data);
        setInitialColumns(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBoards();
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/task/tasks/${boardId}`, {
          headers: { Authorization: localStoreToken },
        });
        setBoardTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="flex">
      {initialColumns &&
        Array.isArray(initialColumns.boardColumns) &&
        initialColumns.boardColumns.map((column) => (
          <div className="basis-1/2 border-2" key={column._id}>
            <Column
              statusName={column.statusName}
              columnId={column._id}
              boardId={boardId}
              setBoardTasks={setBoardTasks}
              boardTasks={boardTasks}
            />
          </div>
        ))}
    </div>
  );
}

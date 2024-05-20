import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

const API_URL: string = import.meta.env.VITE_SERVER_URL;

type Board = {
  _id: string;
  boardName: string;
  boardInitialColumns:
    | {
        statusName: string | null;
        _id: React.Key | string | null;
      }[]
    | null;
  imageUrl: string;
};

type Task = {
  taskName: string;
  _id: string | null | React.Key;
  taskStatus: string | React.Key;
}[];

export default function BoardsDetails() {
  const { boardId, projectId } = useParams<{
    boardId: string;
    projectId: string;
  }>();
  const [boards, setBoards] = useState<Board | undefined>();
  const [task, setTask] = useState<string[]>([]);
  const [taskOnColumn, setTaskOnColumn] = useState<Task | undefined>();
  const [newColumn, setNewColumn] = useState<string>("");

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

        setBoards(response.data.boards[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBoards();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
    index: number
  ) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/task/create`,
        {
          boardId: boardId,
          taskName: task[index] ?? "",
          taskStatus: id,
        },
        {
          headers: { Authorization: localStoreToken },
        }
      );
      if (response.status === 200) {
        setTaskOnColumn((prevState) => {
          if (Array.isArray(prevState)) {
            return [...prevState, response.data];
          } else {
            return [response.data];
          }
        });
      }
      setTask((prevTasks) => {
        const newTasks = [...prevTasks];
        newTasks[index] = "";
        return newTasks;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewColumn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/board/boards/${boardId}`,
        {
          statusName: newColumn,
        },
        {
          headers: { Authorization: localStoreToken },
        }
      );

      if (response.status === 200) {
        setBoards((prevState) => {
          if (Array.isArray(prevState)) {
            return [...prevState, response.data];
          } else {
            return response.data;
          }
        });
      }
      setNewColumn("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-row px-5">
        {boards &&
          boards.boardInitialColumns?.map((column, index) => (
            <div
              className="basis-1/2  flex flex-col border-2 mx-5"
              key={column._id}
            >
              {column.statusName}
              <div className="border-2">
                {Array.isArray(taskOnColumn) &&
                  taskOnColumn.map(
                    (task) =>
                      task.taskStatus === column._id && (
                        <div
                          className="border-2 py-6 mx-2 my-3
                        "
                          key={task._id}
                        >
                          {task.taskName}
                        </div>
                      )
                  )}
              </div>
              <div>
                <form
                  onSubmit={(e) => {
                    handleSubmit(e, column._id?.toString() ?? "", index);
                  }}
                >
                  <label htmlFor="task"></label>
                  <div className="flex mx-1">
                    <input
                      className="border-2 "
                      name="task"
                      required
                      value={task[index] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newTasks: string[] = [...task];
                        newTasks[index] = e.target.value;
                        setTask(newTasks);
                      }}
                    />
                    <button className="px-4" type="submit">
                      +
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        <div className="basis-1/2">
          <form className="flex flex-col" onSubmit={handleNewColumn}>
            <label className="shadow-lg border-2" htmlFor="newcolumn">
              Add Another List
            </label>
            <input
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewColumn(e.target.value);
              }}
              value={newColumn}
              name="newcolumn"
            />
            <button type="submit">+</button>
          </form>
        </div>
      </div>
    </div>
  );
}

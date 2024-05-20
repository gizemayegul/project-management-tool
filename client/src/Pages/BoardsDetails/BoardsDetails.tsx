import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;

type BoardDetail = {
  BoardDetail: object | String;
  boardName: String;
  boardInitialColumns:
    | [
        {
          statusName: String | null;
          _id: React.Key | string | null;
        }
      ]
    | null;
};

export default function BoardsDetails() {
  const { boardId, projectId } = useParams();
  console.log(projectId);
  const [boards, setBoards] = useState<BoardDetail | null>();
  const localStoreToken = localStorage.getItem("token");
  console.log(boards);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/board/${projectId}/boards/${boardId}`,
          {
            headers: { Authorization: localStoreToken },
          }
        );
        console.log(response);
        setBoards(response.data.boards[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBoards();
  }, []);
  return (
    <div>
      <div>
        {boards &&
          boards.boardInitialColumns?.map((column) => (
            <div key={column._id}>{column.statusName}</div>
          ))}
      </div>
    </div>
  );
}

import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;

export default function BoardsDetails() {
  const { boardId, projectId } = useParams();
  console.log(projectId);
  const [boards, setBoards] = useState("");
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
          boards.boardInitialColumns.map((column) => (
            <div key={column._id}>{column.statusName}</div>
          ))}
      </div>
      {boards.initi}
    </div>
  );
}

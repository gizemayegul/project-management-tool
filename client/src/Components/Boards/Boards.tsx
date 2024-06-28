import { BoardType, Id } from "../../utils/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ProjectContext } from "../../Context/ProjectContext";
import { TrashIcon } from "@heroicons/react/20/solid";

export default function Boards() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const { token } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);
  const { projectId } = useParams();

  if (!projectId) {
    useEffect(() => {
      const fetchAllBoards = async () => {
        try {
          const response = await axios.get(`${apiUrl}/boards`, {
            headers: { Authorization: token },
          });
          setBoards(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchAllBoards();
    }, [token, projects]);
  } else {
    useEffect(() => {
      const fetchBoards = async () => {
        try {
          const response = await axios.get(`${apiUrl}/${projectId}/boards`, {
            headers: { Authorization: token },
          });
          setBoards(response.data.boards);
        } catch (error) {
          console.error("Error fetching boards:", error);
        }
      };

      fetchBoards();
    }, [projectId]);
  }

  const handledeleteBoard = async (boardId: Id) => {
    try {
      await axios.delete(`${apiUrl}/boards/${boardId}`, {
        headers: { Authorization: token },
      });
      setBoards((prev) => prev.filter((board) => board._id !== boardId));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-wrap">
      {Array.isArray(boards) &&
        boards.map((board) => (
          <div
            key={board._id}
            className="card bg-base-100 image-full w-60 shadow-xl mx-3 my-3"
          >
            <figure>
              <img src={board.imageUrl} alt="Shoes" />
            </figure>
            <div className="card-body">
              <div className="card-actions justify-between">
                <Link to={`/projects/${board.projectId}/boards/${board._id}`}>
                  <div className="bg-red-300 text-black px-1 rounded-sm">
                    {board.boardName}
                  </div>
                </Link>
                /
                <Link to={`/projects/${board.projectId}`}>
                  <u>{board.projectName}</u>
                </Link>
                <div
                  onClick={() => {
                    handledeleteBoard(board._id);
                  }}
                >
                  <TrashIcon className="text-red-500 h-4 mt-1.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

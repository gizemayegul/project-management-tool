import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BoardType } from "../../utils/types";
const API_URL = import.meta.env.VITE_SERVER_URL;
export default function Boards() {
  const [boards, setBoards] = useState<BoardType[]>();
  const { projectId } = useParams();

  const localStoreToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(`${API_URL}/${projectId}/boards`, {
          headers: { Authorization: localStoreToken },
        });
        setBoards(response.data.boards);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, [projectId]);
  return (
    <div>
      <ul role="list" className="divide-y divide-gray-100">
        {boards &&
          boards.map((board) => (
            <Link
              key={board._id}
              to={`/projects/${projectId}/boards/${board._id}`}
            >
              <li className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={board.imageUrl}
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {board.boardName}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {board.updatedAt.toString()}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    {board.createdAt.toString()}
                  </p>
                </div>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
}

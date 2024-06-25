import { BoardType } from "../../utils/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl, headers } from "../../utils/config";
import { Link } from "react-router-dom";
export default function BoardsAll() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  useEffect(() => {
    const fetchAllBoards = async () => {
      try {
        const response = await axios.get(`${apiUrl}/boards`, {
          headers: headers,
        });
        setBoards(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllBoards();
  }, [headers]);
  //TODO create board button
  return (
    <div className="flex">
      <h1>Boards</h1>

      {Array.isArray(boards) &&
        boards.map((board) => (
          <div
            key={board._id}
            className="card card-compact bg-base-100 w-96 shadow-xl m-3 mt-10"
          >
            <Link to={`/projects/${board.projectId}/boards/${board._id}`}>
              <figure>
                <img src={board.imageUrl} alt="board-img" className="w-fit" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{board.boardName}</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

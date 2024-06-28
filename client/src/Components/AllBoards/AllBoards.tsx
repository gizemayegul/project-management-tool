import { BoardType } from "../../utils/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl, headers } from "../../utils/config";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
export default function AllBoards() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const { token } = useContext(AuthContext);
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
  }, [token]);
  //TODO create board button
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
              <Link to={`/projects/${board.projectId}/boards/${board._id}`}>
                <div className="card-actions justify-start">
                  <button className="btn btn-sm">{board.boardName}</button>
                </div>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

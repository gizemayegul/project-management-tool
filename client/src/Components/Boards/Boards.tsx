import { BoardType } from "../../utils/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ProjectContext } from "../../Context/ProjectContext";
import Card from "../Card/Card";
import { BoardContext } from "../../Context/BoardContext";

export default function Boards() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const { token } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);
  const { projectId } = useParams();
  const { favChange } = useContext(BoardContext);

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
    }, [token, projects, favChange]);
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
    }, [projectId, favChange]);
  }

  return (
    <>
      {boards.length == 0 && projectId ? (
        <div className="flex items-center mt-4 flex-col xs:flex-wrap xs:items-start xs:w-1/2 md-flex-wrap">
          It looks like you don't have any boards yet. Create a new board to get
          started!
        </div>
      ) : (
        <div className="flex">
          <div className="flex flex-wrap">
            {" "}
            {Array.isArray(boards) &&
              boards.map((board) => (
                <Card key={board._id} card={board} cardType="board" />
              ))}
          </div>
        </div>
      )}
    </>
  );
}

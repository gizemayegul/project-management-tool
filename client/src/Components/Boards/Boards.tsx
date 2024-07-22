import { BoardType, Id } from "../../utils/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ProjectContext } from "../../Context/ProjectContext";
import Card from "../Card/Card";
import { useNavigate } from "react-router-dom";

export default function Boards() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const { token } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);
  const { projectId } = useParams();
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-wrap">
      {Array.isArray(boards) &&
        boards.map((board) => (
          <Card key={board._id} card={board} cardType="board" />
        ))}
    </div>
  );
}

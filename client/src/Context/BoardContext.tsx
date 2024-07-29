import { createContext } from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../utils/config";
import { BoardContextType } from "./context";
import { AuthContext } from "./AuthContext";
import { BoardType } from "../utils/types";
import { Id } from "../utils/types";
import { useParams } from "react-router-dom";

const BoardContext = createContext<BoardContextType>({
  boards: [],
  favBoards: [],
  handleFavoriteBoard: () => {},
  favChange: null,
});
function BoardContextWrapper(props: React.PropsWithChildren<{}>) {
  const { token } = useContext(AuthContext);
  const [favBoards, setFavBoards] = useState<BoardType[]>([]);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [favChange, setFavChange] = useState<boolean | null>(null);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${apiUrl}/boards/favorites`, {
          headers: { Authorization: token },
        });
        setFavBoards(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavorites();
  }, [favChange]);

  const handleFavoriteBoard = async (boardId: Id) => {
    const response = await axios.put(
      `${apiUrl}/boards/${boardId}/favorite`,
      {
        boardId,
      },
      { headers: { Authorization: token } }
    );
    setFavChange(response.data.favorite);
    // console.log(response.data.favorite);
  };
  return (
    <BoardContext.Provider
      value={{
        boards: boards,
        favBoards: favBoards,
        handleFavoriteBoard,
        favChange,
      }}
    >
      {props.children}
    </BoardContext.Provider>
  );
}

export { BoardContextWrapper, BoardContext };

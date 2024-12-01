import { createContext } from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../utils/config";
import { BoardContextType } from "./context";
import { AuthContext } from "./AuthContext";
import { BoardType } from "../utils/types";
import { Id } from "../utils/types";
import Loading from "../Components/Loading/Loading";

const BoardContext = createContext<BoardContextType>({
  boards: [],
  favBoards: [],
  handleFavoriteBoard: () => {},
  favChange: null,
});
function BoardContextWrapper(props: React.PropsWithChildren<{}>) {
  const { token, isLoggedIn } = useContext(AuthContext);
  const [favBoards, setFavBoards] = useState<BoardType[]>([]);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [favChange, setFavChange] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token === null) return;
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${apiUrl}/boards/favorites`, {
          headers: { Authorization: token },
        });
        setFavBoards(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavorites();
  }, [favChange, token]);

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
      {/* {isLoggedIn && isLoading ? <Loading /> : props.children} */}
      {props.children}
    </BoardContext.Provider>
  );
}

export { BoardContextWrapper, BoardContext };

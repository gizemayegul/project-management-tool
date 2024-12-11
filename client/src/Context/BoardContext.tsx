import { createContext } from "react";
import { useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
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
  setFavBoards: () => {},
  setFavChange: () => {},
});
function BoardContextWrapper(props: React.PropsWithChildren<{}>) {
  const { token, isLoggedIn,setIsLoading,isLoading } = useContext(AuthContext);
  const [favBoards, setFavBoards] = useState<BoardType[]>([]);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [favChange, setFavChange] = useState<boolean | null>(null);
  const [error,setError]=useState<string>("");

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
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.message);
        } else {
          setError("An unexpected error occurred");
        }
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
  };
  return (
    <BoardContext.Provider
      value={{
        boards: boards,
        favBoards: favBoards,
        handleFavoriteBoard,
        favChange,
        setFavBoards,
        setFavChange,
      }}
    >
      {isLoggedIn && isLoading ? <Loading /> : props.children}
      {props.children}
    </BoardContext.Provider>
  );
}

export { BoardContextWrapper, BoardContext };

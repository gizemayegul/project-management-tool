import {
  renderHook,
  waitFor,
  act,
  customRender,
} from "../test-utils/TestComponents";
import "@testing-library/jest-dom";
import { BoardContext, BoardContextWrapper } from "./BoardContext";
import axios from "axios";
import React from "react";
import { AuthContext } from "./AuthContext";
import {
  defaultAuthOverrides,
  defaultBoardOverrides,
} from "../test-utils/helpers";

jest.mock("axios");
jest.mock("../utils/config", () => ({
  apiUrl: "http://localhost:5000", // Mocked base URL
}));

// Best handle of the mock data and etc

const favBoard = [
  {
    _id: 1,
    boardName: "Test Board",
    projectId: 1,
    userId: 1,
    imageUrl: "https://via.placeholder.com/150",
    columns: ["To Do", "In Progress", "Done"],
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-01-02T12:00:00Z",
    projectName: "Test Project",
    favorite: true,
  },
];

const mockedAxios = axios as jest.Mocked<typeof axios>;

const setup = (token: string | null) => {
  const setIsloading = jest.fn();

  const { result } = renderHook(() => React.useContext(BoardContext), {
    wrapper: ({ children }) => (
      <AuthContext.Provider
        value={{
          ...defaultAuthOverrides,
          token: token,
          setIsLoading: setIsloading,
        }}
      >
        <BoardContextWrapper>{children}</BoardContextWrapper>
      </AuthContext.Provider>
    ),
  });
  return { result, setIsloading };
};

describe("BoardContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render BoardContext with initials", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: favBoard,
    });
    const board = setup("mockToken");

    await waitFor(() => {
      expect(board.result.current.boards).toEqual([]);
      expect(board.result.current.favBoards).toEqual([]);
      expect(board.result.current.handleFavoriteBoard).toBeDefined();
      expect(board.result.current.favChange).toBeNull();
      expect(board.result.current.setFavBoards).toBeDefined();
    });
  });

  it("should set fav board", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: favBoard,
    });
    const board = setup("mockToken");

    await act(async () => {
      board.result.current.setFavBoards(favBoard);
    });

    // Wait for the hook to process the async fetch
    await waitFor(() => {
      expect(board.result.current.favBoards).toEqual(favBoard);
      expect(board.setIsloading).toHaveBeenCalledTimes(1);
    });
  });

  it("if token is null return", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: favBoard,
    });
    const board = setup(null);

    await act(async () => {
      board.result.current.setFavBoards(favBoard);
    });

    await waitFor(() => {
      expect(board.result.current.favBoards).toBeNull;
    });
  });

  it("should handle favorite board", async () => {
    const board = setup("mockToken");
    let thevalue = board.result.current.favBoards;

    mockedAxios.put.mockResolvedValueOnce({
      data: favBoard,
    });

    await act(async () => {
      board.result.current.handleFavoriteBoard("1");
    });
    await waitFor(() => {
      expect(board.result.current.favChange).not.toEqual(thevalue);
    });
  });
});

import { fireEvent, screen, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TestComponent } from "../../test-utils/TestComponent";
import CreateBoard from "./CreateBoard";
import { BoardType, ProjectType } from "../../utils/types";
import axios, { AxiosError } from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ projectId: "1" }), // Mock the projectId
}));

jest.mock("react-toastify", () => ({
  ...jest.requireActual("react-toastify"),
  toast: {
    error: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CreateBoard Component", () => {
  test("creating a board succesfully takes user to board page", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { boardInfo: { _id: "board123" } },
    });
    TestComponent(<CreateBoard />, {
      projectContextOverride: {
        projects: [{ _id: 1, projectName: "projectName" }] as ProjectType[],
      },
      authOverrides: {
        token: "test-token",
      },
    });

    var inputField = screen.getByTestId("board-name-input");
    fireEvent.change(inputField, { target: { value: "New Board Name" } });

    var createButton = screen.getByTestId("create-board");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        "/projects/1/boards/board123"
      );
    });
  });

  test("shows error toast on board creation failure", async () => {
    const errorMessage = "Error creating board";
    const axiosError = new AxiosError("Request failed");
    axiosError.response = {
      data: {
        message: "Error creating board",
        code: "BOARD_CREATION_FAILED",
        details: "Invalid board name or missing project ID",
      },
      status: 400,
      statusText: "Bad Request",
      headers: {
        "content-type": "application/json",
      },
      config: {
        url: "http://localhost:3000/1/createboard",
        method: "post",
        headers: new axios.AxiosHeaders({
          Authorization: "Bearer test-token",
        }),
      },
    };
    mockedAxios.post.mockRejectedValueOnce(axiosError);

    const { toast } = require("react-toastify");

    TestComponent(<CreateBoard />, {
      projectContextOverride: {
        projects: [{ _id: 1, projectName: "projectName" }] as ProjectType[],
      },
      authOverrides: {
        token: "test-token",
      },
    });

    fireEvent.change(screen.getByTestId("board-name-input"), {
      target: { value: "New Board Name" },
    });

    fireEvent.click(screen.getByTestId("create-board"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});

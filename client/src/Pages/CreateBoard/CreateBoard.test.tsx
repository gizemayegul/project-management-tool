import { fireEvent, screen, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TestComponent } from "../../test-utils/TestComponent";
import CreateBoard from "./CreateBoard";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { ProjectType } from "../../utils/types";

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  return {
    ...actual,
    default: {
      ...actual.default,
      post: vi.fn(),
    },
  };
});

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

const mockedUsedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
    useParams: () => ({ projectId: 1 }),
  };
});
const { mockedMethod } = vi.hoisted(() => {
  return { mockedMethod: vi.fn() };
});

vi.mock("react-toastify", async () => {
  return {
    toast: {
      error: mockedMethod,
    },
  };
});

describe("CreateBoard Component", () => {
  it("creating a board successfully takes user to board page", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        boardInfo: {
          _id: "board123",
          boardName: "New Board Name",
        },
      },
    });
    TestComponent(<CreateBoard />, {
      projectContextOverride: {
        projects: [{ _id: 1, projectName: "projectName" } as ProjectType],
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
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        "/projects/1/boards/board123"
      );
    });
  });

  it("unsuccesful board creation handles the error message", async () => {
    const error = new AxiosError(
      "Board creation failed",
      "400",
      undefined,
      null,
      {
        status: 400,
        data: { message: "Board creation failed" },
        statusText: "Bad Request",
        headers: {},
        config: {
          headers: {
            Authorization: "Bearer test-token",
          } as AxiosRequestHeaders,
        },
      }
    );

    mockedAxios.post.mockRejectedValueOnce(error);

    TestComponent(<CreateBoard />, {
      projectContextOverride: {
        projects: [{ _id: 1, projectName: "projectName" } as ProjectType],
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
      expect(mockedMethod).toHaveBeenCalledWith("Board creation failed");
    });
  });
});

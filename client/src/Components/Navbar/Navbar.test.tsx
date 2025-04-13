import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { TestComponent } from "../../test-utils/TestComponent";
import { BoardType, ProjectType } from "../../utils/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedUsedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Navbar Component", () => {
  it("renders Navbar if user is not logged in", async () => {
    TestComponent(<Navbar />, { authOverrides: { isLoggedIn: false } });
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  it("renders Navbar if user is logged in", async () => {
    TestComponent(<Navbar />);
    expect(
      screen.getByRole("button", { name: /Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /profile/i })).toBeInTheDocument();
  });

  it("handles dropdown toggle on outside click", async () => {
    const mockSetDropdown = vi.fn();
    TestComponent(<Navbar />, {
      projectContextOverride: {
        dropdown: true,
        favoriteProjects: [],
        setDropdown: mockSetDropdown,
      },
    });
    fireEvent.click(document.body);

    expect(mockSetDropdown).toHaveBeenCalledWith(false);
  });

  it("clicking create a project takes the user to createproject", async () => {
    TestComponent(<Navbar />);

    var createProject = screen.getByTestId("create-project");
    expect(createProject).toBeInTheDocument();

    fireEvent.click(createProject);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/createaproject");
  });

  it("clicking favorites takes the user favorites page", async () => {
    const favBoard = {
      _id: "abc123",
      projectId: "proj456",
    } as Partial<BoardType>;

    TestComponent(<Navbar />, {
      boardContextOverride: {
        favBoards: [favBoard] as BoardType[],
      },
    });

    var favorites = screen.getByTestId("favorites");
    expect(favorites).toBeInTheDocument();
    fireEvent.click(favorites);

    var getFavBoards = screen.queryAllByTestId("fav-boards");
    fireEvent.click(getFavBoards[0]);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/projects/${favBoard.projectId}/boards/${favBoard._id}`
    );
    var getFavBoards = screen.queryAllByTestId("fav-boards");
    fireEvent.click(getFavBoards[1]);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/projects/${favBoard.projectId}/boards/${favBoard._id}`
    );
  });

  it("clicking favorite projects takes user the project page", async () => {
    const favoriteProjects = {
      _id: 1,
      projectName: "projectName",
    } as Partial<ProjectType>;

    TestComponent(<Navbar />, {
      projectContextOverride: {
        favoriteProjects: [favoriteProjects] as ProjectType[],
      },
    });

    var favorites = screen.getByTestId("favorites");
    expect(favorites).toBeInTheDocument();
    fireEvent.click(favorites);

    var getFavProjects = screen.queryAllByTestId("fav-project");
    fireEvent.click(getFavProjects[0]);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/projects/${favoriteProjects._id}`
    );
    var getFavProjects = screen.queryAllByTestId("fav-project");
    fireEvent.click(getFavProjects[1]);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/projects/${favoriteProjects._id}`
    );
  });

  it("clicking create a project close create board", async () => {
    TestComponent(<Navbar />);
    var createProject = screen.getByTestId("set-project");
    fireEvent.click(createProject);

    var createBoard = screen.queryByTestId("set-board");
    expect(createBoard).not.toBeInTheDocument();
  });

  it("clicking create a board close create project", async () => {
    TestComponent(<Navbar />);
    var createProject = screen.getByTestId("set-board");
    fireEvent.click(createProject);

    var createBoard = screen.queryByTestId("set-project");
    expect(createBoard).not.toBeInTheDocument();
  });

  it("clicking profile takes user profile page", async () => {
    TestComponent(<Navbar />);
    var profile = screen.getByTestId("profile");
    fireEvent.click(profile);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/profile");
  });
});

import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { TestComponent } from "../../test-utils/TestComponent";
import { BoardType, ProjectType } from "../../utils/types";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Navbar Component", () => {
  test("renders Navbar if user is not logged in", async () => {
    TestComponent(<Navbar />, { authOverrides: { isLoggedIn: false } });
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  test("renders Navbar if user is logged in", async () => {
    TestComponent(<Navbar />);
    expect(
      screen.getByRole("button", { name: /Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /profile/i })).toBeInTheDocument();
  });

  test("handles dropdown toggle on outside click", async () => {
    const mockSetDropdown = jest.fn();
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

  test("clicking create a project takes the user to createproject", async () => {
    TestComponent(<Navbar />);

    var createProject = screen.getByTestId("create-project");
    expect(createProject).toBeInTheDocument();

    fireEvent.click(createProject);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/createaproject");
  });

  test("clicking favorites takes the user favorites page", async () => {
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

  test("clicking favorite projects takes user the project page", async () => {
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

  test("clicking create a project close create board", async () => {
    TestComponent(<Navbar />);
    var createProject = screen.getByTestId("set-project");
    fireEvent.click(createProject);

    var createBoard = screen.queryByTestId("set-board");
    expect(createBoard).not.toBeInTheDocument();
  });

  test("clicking create a board close create project", async () => {
    TestComponent(<Navbar />);
    var createProject = screen.getByTestId("set-board");
    fireEvent.click(createProject);

    var createBoard = screen.queryByTestId("set-project");
    expect(createBoard).not.toBeInTheDocument();
  });

  test("clicking profile takes user profile page", async () => {
    TestComponent(<Navbar />);
    var profile = screen.getByTestId("profile");
    fireEvent.click(profile);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/profile");
  });
});

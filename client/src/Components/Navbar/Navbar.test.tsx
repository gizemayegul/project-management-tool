import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext to mock it
import Navbar from "../../Components/Navbar/Navbar";
import { customRender } from "../../test-utils/TestComponents";
const setDropdown = jest.fn();
const dropdown: boolean = false;
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const setup = (isLoggedIn: boolean, noFavorites: boolean = true) => {
  return customRender(<Navbar />, {
    authOverrides: { isLoggedIn: isLoggedIn ? true : false },
    projectOverrides: {
      favoriteProjects: noFavorites
        ? [
            {
              _id: 1,
              projectName: "Test Project",
              imageUrl: "https://via.placeholder.com/150",
              boards: ["Test Board"],
              userId: 1,
              createdAt: "2023-01-01T12:00:00Z",
              updatedAt: "2023-01-02T12:00:00Z",
              favorite: true,
            },
          ]
        : [],
      dropdown: dropdown,
      setDropdown: setDropdown,
    },
    boardOverrides: {
      favBoards: noFavorites
        ? [
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
          ]
        : [],
    },
  });
};
describe("Navbar Component", () => {
  setup(false);
  it("renders Navbar if user is not logged in", () => {
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  it("renders Navbar if user is logged in", () => {
    setup(true);
    expect(
      screen.getByRole("button", { name: /Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /profile/i })).toBeInTheDocument();
  });

  it("toggles dropdown correctly when clicked", async () => {
    setup(true);

    fireEvent.click(screen.getByTestId("create-button"));
    await waitFor(() => {
      expect(setDropdown).toHaveBeenCalledWith(expect.any(Function));
      expect(screen.getByText(/create project/i)).toBeInTheDocument();
      expect(screen.getByText(/create board/i)).toBeInTheDocument();
    });
  });

  it("toggles favorites dropdown correctly when clicked", async () => {
    setup(true);

    fireEvent.click(screen.getByTestId("fav-dropdown"));
    await waitFor(() => {
      expect(setDropdown).toHaveBeenCalledWith(expect.any(Function));
      expect(screen.getAllByText(/Test Board/i)).toHaveLength(2);
      expect(screen.getAllByText(/Test Project/i)).toHaveLength(2);
    });
  });

  it("toggles dropdown correctly when clicked anywhere in page", async () => {
    setup(true);

    fireEvent.click(screen.getByText(/dashboard/i));
    await waitFor(() => {
      expect(setDropdown).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it("navigates when small screen design is on create project", async () => {
    setup(true);

    fireEvent.click(screen.getByTestId("small-screen-create-project"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/createaproject");
    });
  });

  it("navigates to favorite board page when clicked", async () => {
    setup(true);
    const favoriteButton = screen.getByTestId("fav-dropdown");
    fireEvent.click(favoriteButton);

    const favoriteBoard = screen.getByTestId("favorite-board");
    fireEvent.click(favoriteBoard);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/projects/${1}/boards/${1}`);
    });
  });
  it("navigates to favorite board page when clicked in the small screen", async () => {
    setup(true);
    const favoriteButton = screen.getByTestId("fav-dropdown");
    fireEvent.click(favoriteButton);

    const favoriteBoard = screen.getByTestId("favorite-board-small");
    fireEvent.click(favoriteBoard);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/projects/${1}/boards/${1}`);
    });
  });
  it("navigates to favorite project page when clicked", async () => {
    setup(true);
    const favoriteButton = screen.getByTestId("fav-dropdown");
    fireEvent.click(favoriteButton);

    const favoriteBoard = screen.getByTestId("favorite-project");
    fireEvent.click(favoriteBoard);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/projects/${1}`);
    });
  });

  it("navigates to favorite small project page when clicked", async () => {
    setup(true);
    const favoriteButton = screen.getByTestId("fav-dropdown");
    fireEvent.click(favoriteButton);

    const favoriteBoard = screen.getByTestId("favorite-project-small");
    fireEvent.click(favoriteBoard);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/projects/${1}`);
      expect(setDropdown).toHaveBeenCalled();
    });
  });

  it("navigates to profile page when clicked", async () => {
    setup(true);
    const profileButtton = screen.getByTestId("profile");
    fireEvent.click(profileButtton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/profile`);
    });
  });

  it("doesn't show create board when create project button is clicked", async () => {
    setup(true);

    const createButton = screen.getByTestId("create-button");

    fireEvent.click(createButton);

    const createProject = screen.getByTestId("create-project-button");
    fireEvent.click(createProject);
    await waitFor(() => {
      expect(screen.getByTestId("create-project-dropdown")).toBeInTheDocument();
      expect(setDropdown).not.toHaveBeenCalledWith(!dropdown);
    });
  });

  it("doesn't show create project when create board button is clicked", async () => {
    setup(true);

    const createButton = screen.getByTestId("create-button");

    fireEvent.click(createButton);

    const createProject = screen.getByTestId("create-board-button");
    fireEvent.click(createProject);
    await waitFor(() => {
      expect(screen.getByTestId("create-board-dropdown")).toBeInTheDocument();
      expect(setDropdown).not.toHaveBeenCalledWith(!dropdown);
    });
  });

  it("shows no favorites is found when there are no favorites", async () => {
    setup(true, false);

    const favoriteButton = screen.getByTestId("fav-dropdown");
    fireEvent.click(favoriteButton);
    await waitFor(() => {
      expect(screen.getAllByText("No favorites yet!")).toHaveLength(2);
    });
  });

  it("click random places and the dropdown should be closed", async () => {
    setup(true);

    const favoriteButton = screen.getByTestId("fav-dropdown");
    fireEvent.click(favoriteButton);
    const createButton = screen.getByTestId("create-button");
    fireEvent.click(createButton);

    fireEvent.click(document.body);
    await waitFor(() => {
      expect(setDropdown).toHaveBeenCalledWith(expect.any(Function));
    });
  });
  it("calls clickSomewhere when clicking anywhere on the page", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    setup(true); // Render the component, triggering useEffect

    // Verify that addEventListener is called with "click" and a function
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
    expect(setDropdown).toHaveBeenCalledWith(expect.any(Function));

    // Clean up the spy
    addEventListenerSpy.mockRestore();
  });

  it("removes click event listener when unmounted", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = setup(true); // Render the component
    unmount(); // Trigger component unmount

    // Verify that removeEventListener is called with "click" and a function
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );

    expect(setDropdown).toHaveBeenCalledWith(expect.any(Function));
    // Clean up the spy
    removeEventListenerSpy.mockRestore();
  });

  it("closes dropdown when clicking outside", async () => {
    setup(true);

    // Simulate clicking outside the dropdown
    fireEvent.click(document.body);

    await waitFor(() => {
      expect(setDropdown).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it("does not close dropdown when clicking inside", async () => {
    setup(true);

    fireEvent.click(screen.getByTestId("fav-dropdown"));

    await waitFor(() => {
      expect(setDropdown).not.toHaveBeenCalledWith(!dropdown);
    });
  });
});

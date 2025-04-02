import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext to mock it
import Navbar from "../../Components/Navbar/Navbar";
import {
  defaultAuthContextValue,
  defaultProjectContextValue,
} from "../../test-utils/helpers";
import { AuthContextType, ProjectContextType } from "../../Context/context";
import { BrowserRouter } from "react-router-dom";
import { ProjectContext } from "../../Context/ProjectContext";

export const renderNavbar = (
  ui: React.ReactElement,
  overrides: Partial<AuthContextType> = {},
  projectContextOverride: Partial<ProjectContextType> = {}
) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider
        value={{ ...defaultAuthContextValue, ...overrides }}
      >
        <ProjectContext.Provider
          value={{ ...defaultProjectContextValue, ...projectContextOverride }}
        >
          {ui}
        </ProjectContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};
describe("Navbar Component", () => {
  test("renders Navbar if user is not logged in", () => {
    renderNavbar(<Navbar />);
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  test("renders Navbar if user is logged in", () => {
    renderNavbar(<Navbar />, { isLoggedIn: true });
    expect(
      screen.getByRole("button", { name: /Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /profile/i })).toBeInTheDocument();
  });

  test("renders", async () => {
    const setDropdownMock = jest.fn();
    const dropdownRefMock = { current: document.createElement("div") };
    const favRefMock = { current: document.createElement("div") };
    renderNavbar(
      <Navbar />,
      { isLoggedIn: true },
      { dropdown: true, favoriteProjects: [], setDropdown: setDropdownMock }
    );
    document.body.appendChild(dropdownRefMock.current);
    document.body.appendChild(favRefMock.current);
    fireEvent.click(document.body);
    expect(setDropdownMock).toHaveBeenCalled();
    const toggleFunction = setDropdownMock.mock.calls[0][0];
    expect(toggleFunction(true)).toBe(false);
  });

  test("rendersn2", async () => {
    const setDropdownMock = jest.fn();
    const favRefMock = { current: document.createElement("div") };
    renderNavbar(
      <Navbar />,
      { isLoggedIn: true },
      { dropdown: true, favoriteProjects: [], setDropdown: setDropdownMock }
    );
    const dropdownFavClick = document.body.appendChild(favRefMock.current);
    document.body.appendChild(favRefMock.current);
    fireEvent.click(document.body);
    expect(setDropdownMock).toHaveBeenCalled();
    const toggleFunction = setDropdownMock.mock.calls[0][0];
    expect(toggleFunction(true)).toBe(false);
  });
});

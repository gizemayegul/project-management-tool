import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext to mock it
import Navbar from "../../Components/Navbar/Navbar";
import { defaultAuthContextValue } from "../../test-utils/helpers";
import { AuthContextType } from "../../Context/context";
import { BrowserRouter } from "react-router-dom";

export const renderWithAuthContext = (
  ui: React.ReactElement,
  overrides: Partial<AuthContextType> = {}
) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider
        value={{ ...defaultAuthContextValue, ...overrides }}
      >
        {ui}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};
describe("Navbar Component", () => {
  test("renders Navbar if user is not logged in", () => {
    renderWithAuthContext(<Navbar />, { isLoggedIn: false });
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  test("renders Navbar if user is logged in", () => {
    renderWithAuthContext(<Navbar />, { isLoggedIn: true });
    expect(
      screen.getByRole("button", { name: /Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /profile/i })).toBeInTheDocument();
  });
});

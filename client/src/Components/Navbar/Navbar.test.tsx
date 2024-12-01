import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext to mock it
import Navbar from "../../Components/Navbar/Navbar";
import { customRender } from "../../test-utils/TestComponents";

const setup = (isLoggedIn: boolean) => {
  return customRender(<Navbar />, {
    authOverrides: { isLoggedIn: isLoggedIn ? true : false },
  });
};
describe("Navbar Component", () => {
  setup(false);
  test("renders Navbar if user is not logged in", () => {
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  test("renders Navbar if user is logged in", () => {
    setup(true);
    expect(
      screen.getByRole("button", { name: /Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /profile/i })).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import "@testing-library/jest-dom";

describe("Navbar", () => {
  test("renders Navbar component", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const navbarElement = screen.getByTestId("navbar");
    expect(navbarElement).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const Login = screen.getByText("Login");
    expect(Login).toBeInTheDocument();
    expect(Login).toHaveAttribute("href", "/login");
    const Signup = screen.getByText("Signup");
    expect(Signup).toHaveAttribute("href", "/signup");
    expect(Signup).toBeInTheDocument();
  });
});

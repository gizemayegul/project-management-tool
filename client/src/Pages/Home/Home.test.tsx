import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../Pages/Home/Home";
import { BrowserRouter } from "react-router-dom";

describe("Home", () => {
  test("renders home page", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(
      screen.getByText("Boost your productivity by using our application")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Get started/i })
    ).toBeInTheDocument();
  });
});

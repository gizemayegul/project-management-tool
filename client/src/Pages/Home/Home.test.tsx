import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../Pages/Home/Home";
import { TestComponent } from "../../test-utils/TestComponent";
import { describe, expect, it, test } from "vitest";

describe("Home", () => {
  it("renders home page", () => {
    TestComponent(<Home />);
    expect(
      screen.getByText("Boost your productivity by using our application")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Announcing our next round of funding.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover the ultimate solution to enhance your productivity. Our application is designed to streamline your tasks, allowing you to focus on what truly matters. Experience unparalleled efficiency and achieve your goals effortlessly. Join countless others who have transformed their workflows and unleashed their full potential with our cutting-edge technology."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Get started/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Learn more/i }));
    expect(screen.getByRole("link", { name: /Read more/i }));
  });
});

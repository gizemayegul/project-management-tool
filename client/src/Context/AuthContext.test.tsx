import {
  customRender,
  fireEvent,
  render,
  screen,
} from "../test-utils/test-components";
import App from "../App";
import "@testing-library/jest-dom";

describe("App", () => {
  it("renders email information", async () => {
    customRender(<App />); // Use custom render
    expect(screen.getByTestId(/loading-spinner/i)).toBeInTheDocument();
  });
});

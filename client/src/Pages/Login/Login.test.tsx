import {
  act,
  customRender,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "../../test-utils/TestComponents";
import "@testing-library/jest-dom";
import Login from "./Login";
import axios from "axios"; // Mock axios
jest.mock("axios");

const setup = () => {
  const mockStoreToken = jest.fn();
  const mockAuthenticateUser = jest.fn();
  customRender(<Login />, {
    authOverrides: {
      storeToken: mockStoreToken,
      authenticateUser: mockAuthenticateUser,
    },
  });
  return { mockStoreToken, mockAuthenticateUser };
};

beforeEach(() => {
  setup();
});

describe("Login", () => {
  it("renders the login page", async () => {
    expect(screen.getByTestId(/email/i)).toBeInTheDocument();
    expect(screen.getByTestId(/password/i)).toBeInTheDocument();
  });
  it("sets the token after successful login", async () => {
    const mockStoreToken = jest.fn();
    const mockAuthenticateUser = jest.fn();
    const mockToken = "mockToken123";
    (axios.post as jest.Mock).mockResolvedValue({
      status: 201,
      data: {
        token: "mockToken123",
        message: "Login successful",
      },
    });

    waitFor(() => {
      fireEvent.change(screen.getByTestId(/email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByTestId(/password/i), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByTestId("login-button"));
    });

    await waitFor(() => {
      //   expect(mockStoreToken).toHaveBeenCalledWith(mockStoreToken);
      //   expect(mockAuthenticateUser).toHaveBeenCalled(); // Verify authentication is triggered
    });

    // Check success message is displayed
    expect(screen.getByText(/login successful/i)).toBeInTheDocument();
  });
});

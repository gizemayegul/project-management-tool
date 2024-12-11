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
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
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
  jest.clearAllMocks();
});

describe("Login", () => {
  it("should render", async () => {
    const { mockStoreToken, mockAuthenticateUser } = setup();

    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: { token: "fakeToken", message: "Login successful!" },
    });
    await act(async () => {
      fireEvent.change(screen.getByTestId("email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByTestId("password"), {
        target: { value: "testpassword" },
      });
      fireEvent.submit(screen.getByText("Login"));
    });
    await waitFor(() => {
      expect(mockStoreToken).toHaveBeenCalledWith("fakeToken");
      expect(mockAuthenticateUser).toHaveBeenCalled();
      expect(screen.getByText("Login successful!")).toBeInTheDocument();
    });
  });
  it("should render error message on failed login with server error", async () => {
    const { mockStoreToken, mockAuthenticateUser } = setup();
    mockedAxios.post.mockRejectedValue({
      response: {
        data: { message: "Something went wrong" },
      },
    });
    await act(async () => {
      fireEvent.change(screen.getByTestId("email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByTestId("password"), {
        target: { value: "testpassword" },
      });
      fireEvent.submit(screen.getByText("Login"));
    });
    await waitFor(() => {
      expect(mockStoreToken).not.toHaveBeenCalled();
      expect(mockAuthenticateUser).not.toHaveBeenCalled();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});

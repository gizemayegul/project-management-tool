import {
  act,
  customRender,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "../test-utils/TestComponents";
import "@testing-library/jest-dom";
import { AuthContext, AuthProviderWrapper } from "./AuthContext";
import React from "react";

describe("AuthContext", () => {
  const { result } = renderHook(() => React.useContext(AuthContext), {
    wrapper: AuthProviderWrapper,
  });
  it("should logout user", async () => {
    // Mock User
    act(() => {
      result.current.setUser({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
      });
      result.current.setIsLoggedIn(true);
    });
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        data: {}, // Mock data store
        getItem: jest.fn((key) => window.localStorage.data[key] || null),
        setItem: jest.fn(
          (key, value) => (window.localStorage.data[key] = value)
        ),
        removeItem: jest.fn((key) => delete window.localStorage.data[key]),
        clear: jest.fn(() => (window.localStorage.data = {})), // Clear mock data
      },
      writable: true,
    });

    //act
    await act(async () => {
      result.current.logOutUser();
    });
    // Assert
    await waitFor(() => {
      expect(result.current.user).toBe(null); // User should be null
      expect(result.current.isLoggedIn).toBe(false); // Logged out
      expect(localStorage.getItem("token")).toBe(null); // Ensure token is removed
    });
  });
});

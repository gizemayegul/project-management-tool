import { act, renderHook, waitFor } from "../test-utils/TestComponents";
import "@testing-library/jest-dom";
import { AuthContext, AuthProviderWrapper } from "./AuthContext";
import axios from "axios";
import React from "react";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
  });

  it("sets initial states correctly", async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProviderWrapper,
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.isLineLoading).toBe(false);
      expect(result.current.logOut).toBe(false);
      expect(result.current.userUpdate).toEqual({
        name: "",
        email: "",
        password: "",
      });
    });
  });

  it("authenticates user with invalid token", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") return "mockToken";
      return null;
    });
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProviderWrapper,
    });

    await act(async () => {
      mockedAxios.get.mockRejectedValue(new Error("Invalid token"));
    });

    await act(async () => {
      result.current.authenticateUser();
    });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it("doesn't authenticate if there is no token", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") return null;
      return null;
    });
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProviderWrapper,
    });

    await act(async () => {
      result.current.authenticateUser();
    });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it("authenticates user with valid token", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") return "mockToken";
      return null;
    });
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProviderWrapper,
    });
    const user = {
      name: "John Doe",
      email: "",
    };
    await act(async () => {
      mockedAxios.get.mockResolvedValue({
        data: user,
      });
    });

    await act(async () => {
      result.current.authenticateUser();
    });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toEqual(user);
      expect(result.current.userUpdate).toEqual({
        name: user.name,
        email: user.email,
        password: "",
      });
    });
  });

  it("logs out the user when logOutUser is called", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") return "mockToken";
      return null;
    });
    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProviderWrapper,
    });

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    act(() => {
      result.current?.logOutUser();
    });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith("token");
    });
  });

 

});
 
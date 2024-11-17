import { AuthContextType } from "../Context/context";

export const defaultAuthContextValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  logOutUser: jest.fn(),
  isLoading: true,
  storeToken: jest.fn(),
  authenticateUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
  token: null,
  handleSubmitFile: jest.fn(),
  setIsLineLoading: jest.fn(),
  isLineLoading: false,
  selectedFile: null,
  handleFileChange: jest.fn(),
  setSelectedFile: jest.fn(),
  handleUpdate: jest.fn(),
  userUpdate: { name: "", email: "", password: "" },
  setUserUpdate: jest.fn(),
  handleUserDelete: jest.fn(),
  logOut: false,
  setLogOut: jest.fn(),
};

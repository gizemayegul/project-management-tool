import { AuthContextType, ProjectContextType } from "../Context/context";

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

export const defaultProjectContextValue: ProjectContextType = {
  setDropdown: jest.fn(),
  dropdown: true,
  favChange: true,
  favoriteProjects: [],
  projects: [],
  setProjects: jest.fn(),
  handleDeleteProject: jest.fn(),
  handleFavoriteProject: jest.fn(),
  setFavoriteProjects: jest.fn(),
  background: true,
  setBackGround: jest.fn(),
};

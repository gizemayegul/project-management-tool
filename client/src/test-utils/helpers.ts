import { randomUUID } from "crypto";
import {
  AuthContextType,
  BoardContextType,
  ProjectContextType,
} from "../Context/context";

export const defaultAuthOverrides: AuthContextType = {
  user: null,
  isLoggedIn: false,
  logOutUser: jest.fn(),
  isLoading: true,
  storeToken: jest.fn(),
  authenticateUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
  token: "token123",
  handleSubmitFile: jest.fn(),
  setIsLineLoading: jest.fn(),
  isLineLoading: false,
  selectedFile: null,
  handleFileChange: jest.fn(),
  setSelectedFile: jest.fn(),
  handleUpdate: jest.fn(),
  userUpdate: {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password123",
  },
  setUserUpdate: jest.fn(),
  handleUserDelete: jest.fn(),
  logOut: false,
  setLogOut: jest.fn(),
  setUser: jest.fn(),
};

export const defaultBoardOverrides: BoardContextType = {
  boards: [
    {
      _id: "mockBoardId1",
      boardName: "Mock Board 1",
      projectId: "mockProjectId1",
      userId: "mockUserId1",
      imageUrl: "https://via.placeholder.com/150",
      columns: ["To Do", "In Progress", "Done"],
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-02T12:00:00Z",
      projectName: "Mock Project 1",
      favorite: true,
    },
    {
      _id: "mockBoardId2",
      boardName: "Mock Board 2",
      projectId: "mockProjectId2",
      userId: "mockUserId2",
      imageUrl: "https://via.placeholder.com/150",
      columns: ["Backlog", "Design", "Development", "Testing"],
      createdAt: "2023-02-01T12:00:00Z",
      updatedAt: "2023-02-02T12:00:00Z",
      projectName: "Mock Project 2",
      favorite: false,
    },
    {
      _id: "mockBoardId3",
      boardName: "Mock Board 3",
      projectId: "mockProjectId3",
      userId: "mockUserId3",
      imageUrl: "https://via.placeholder.com/150",
      columns: ["Ideas", "Planning"],
      createdAt: "2023-03-01T12:00:00Z",
      updatedAt: "2023-03-02T12:00:00Z",
      projectName: "Mock Project 3",
      favorite: true,
    },
  ],
  favBoards: [
    {
      _id: "mockBoardId1",
      boardName: "Mock Board 1",
      projectId: "mockProjectId1",
      userId: "mockUserId1",
      imageUrl: "https://via.placeholder.com/150",
      columns: ["To Do", "In Progress", "Done"],
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-02T12:00:00Z",
      projectName: "Mock Project 1",
      favorite: true,
    },
  ],
  handleFavoriteBoard: jest.fn(),
  favChange: true,
};

export const defaultProjectOverides: ProjectContextType = {
  projects: [
    {
      _id: "project1",
      projectName: "Project Alpha",
      favorite: true,
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-02T12:00:00Z",
      imageUrl: "imageUrl 1",
      boards: ["board 1", "board2"],
      userId: randomUUID.toString(),
    },
    {
      _id: "project2",
      projectName: "Project Beto",
      favorite: false,
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-02T12:00:00Z",
      imageUrl: "imageUrl 1",
      boards: ["board 1", "board2"],
      userId: randomUUID.toString(),
    },
  ], // Mock projects list
  setProjects: jest.fn(), // Mock function for setting projects
  handleDeleteProject: jest.fn(), // Mock function for deleting a project
  handleFavoriteProject: jest.fn(), // Mock function for toggling favorite status
  setFavoriteProjects: jest.fn(), // Mock function for setting favorite projects
  favoriteProjects: [
    {
      _id: "project1",
      projectName: "Project Alpha",
      favorite: true,
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-02T12:00:00Z",
      imageUrl: "imageUrl 1",
      boards: ["board 1", "board2"],
      userId: randomUUID.toString(),
    },
  ], // Mock favorite projects list
  favChange: true, // Mock function for favorite change event
  dropdown: false, // Mock dropdown state
  setDropdown: jest.fn(), // Mock function for toggling dropdown state
  background: false, // Mock background state
  setBackGround: jest.fn(), // Mock function for setting background state
};

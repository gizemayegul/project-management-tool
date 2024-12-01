import {
  ProjectContext,
  ProjectContextWrapper,
} from "../Context/ProjectContext";
import { AuthContext } from "../Context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { BoardContext, BoardContextWrapper } from "../Context/BoardContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import {
  defaultAuthOverrides,
  defaultBoardOverrides,
  defaultProjectOverides,
} from "./helpers";
import {
  AuthContextType,
  BoardContextType,
  ProjectContextType,
} from "../Context/context";

const queryClient = new QueryClient();

const AllProviders = ({
  children,
  authOverrides = {},
  boardOverrides = {},
  projectOverrides = {},
}: {
  children: React.ReactNode;
  authOverrides?: Partial<AuthContextType>;
  boardOverrides?: Partial<BoardContextType>;
  projectOverrides?: Partial<ProjectContextType>;
}) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ ...defaultAuthOverrides, ...authOverrides }}>
      <Router>
        <ProjectContext.Provider
          value={{ ...defaultProjectOverides, ...projectOverrides }}
        >
          <BoardContext.Provider
            value={{ ...defaultBoardOverrides, ...boardOverrides }}
          >
            {children}
          </BoardContext.Provider>
        </ProjectContext.Provider>
      </Router>
    </AuthContext.Provider>
  </QueryClientProvider>
);

const customRender = (
  ui: React.ReactElement,
  {
    authOverrides = {},
    boardOverrides = {},
    projectOverrides = {},
    ...options
  }: RenderOptions & {
    authOverrides?: Partial<AuthContextType>;
    boardOverrides?: Partial<BoardContextType>;
    projectOverrides?: Partial<ProjectContextType>;
  } = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllProviders
        authOverrides={authOverrides}
        boardOverrides={boardOverrides}
        projectOverrides={projectOverrides}
      >
        {children}
      </AllProviders>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { customRender };

import {
  AuthContextType,
  BoardContextType,
  ProjectContextType,
} from "../Context/context";
import { ProjectType } from "../utils/types";
import { AuthContext } from "../Context/AuthContext";
import { ProjectContext } from "../Context/ProjectContext";
import { render } from "@testing-library/react";
import { BoardContext } from "../Context/BoardContext";
import { BrowserRouter as Router } from "react-router-dom";
import { initialValues } from "../Context/AuthContext";
import { initialValues as boardInitialValues } from "../Context/BoardContext";
import { initialValues as projectInitialValues } from "../Context/ProjectContext";

type TestComponentOptions = {
  authOverrides?: Partial<AuthContextType>;
  projectContextOverride?: Partial<ProjectContextType>;
  boardContextOverride?: Partial<BoardContextType>;
};
export const TestComponent = (
  ui: React.ReactElement,
  {
    authOverrides = {},
    projectContextOverride = {},
    boardContextOverride = {},
  }: TestComponentOptions = {}
) => {
  return render(
    <AuthContext.Provider
      value={
        {
          ...initialValues,
          isLoggedIn: true,
          ...authOverrides,
        } as AuthContextType
      }
    >
      <Router>
        <ProjectContext.Provider
          value={
            {
              ...projectInitialValues,
              ...projectContextOverride,
            } as ProjectContextType
          }
        >
          <BoardContext.Provider
            value={
              {
                ...boardInitialValues,
                ...boardContextOverride,
              } as BoardContextType
            }
          >
            {ui}
          </BoardContext.Provider>
        </ProjectContext.Provider>
      </Router>
    </AuthContext.Provider>
  );
};

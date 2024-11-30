import { ProjectContextWrapper } from "../Context/ProjectContext";
import { AuthProviderWrapper } from "../Context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { BoardContextWrapper } from "../Context/BoardContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RenderOptions } from "@testing-library/react";
import { render, screen } from "@testing-library/react";

const queryClient = new QueryClient();

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProviderWrapper>
      <Router>
        <ProjectContextWrapper>
          <BoardContextWrapper>{children}</BoardContextWrapper>
        </ProjectContextWrapper>
      </Router>
    </AuthProviderWrapper>
  </QueryClientProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });
export * from "@testing-library/react";
export { customRender };

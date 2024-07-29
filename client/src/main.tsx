import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BoardContextWrapper } from "./Context/BoardContext.tsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./Context/AuthContext.tsx";
import { ProjectContextWrapper } from "./Context/ProjectContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProviderWrapper>
      <Router>
        <ProjectContextWrapper>
          <BoardContextWrapper>
            <App />
          </BoardContextWrapper>
        </ProjectContextWrapper>
      </Router>
    </AuthProviderWrapper>
  </React.StrictMode>
);

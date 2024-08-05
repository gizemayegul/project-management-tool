import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BoardContextWrapper } from "./Context/BoardContext";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./Context/AuthContext";
import { ProjectContextWrapper } from "./Context/ProjectContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProviderWrapper>
      <Router>
        <ProjectContextWrapper>
          <BoardContextWrapper>
            <App></App>
          </BoardContextWrapper>
        </ProjectContextWrapper>
      </Router>
    </AuthProviderWrapper>
  </React.StrictMode>
);

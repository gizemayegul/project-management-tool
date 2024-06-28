import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ProjectContextType, Id, ProjectType } from "../utils/types";
import { apiUrl } from "../utils/config";

import axios from "axios";

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  setProjects: () => {},
  handleDeleteProject: (projectId: Id) => {},
});

function ProjectContextWrapper(props: React.PropsWithChildren<{}>) {
  const { isLoggedIn, token } = useContext(AuthContext);

  const [projects, setProjects] = useState<ProjectType[]>([]);
  useEffect(() => {
    if (isLoggedIn) {
      const fetchProjects = async () => {
        try {
          const response = await axios.get(`${apiUrl}/projects`, {
            headers: { Authorization: token },
          });
          setProjects(response.data.projects);
        } catch (error) {
          console.log(error);
        }
      };
      fetchProjects();
    }
  }, [token, isLoggedIn]);

  const handleDeleteProject = async (projectId: Id) => {
    try {
      await axios.delete(`${apiUrl}/projects/${projectId}`, {
        headers: { Authorization: token },
      });
      if (!projects) return;
      setProjects((prev) => {
        return prev.filter((project) => project._id !== projectId);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        handleDeleteProject,
        setProjects,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}

export { ProjectContextWrapper, ProjectContext };

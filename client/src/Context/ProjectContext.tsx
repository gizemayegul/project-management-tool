import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ProjectContextType } from "../utils/types";
import { apiUrl } from "../utils/config";

import axios from "axios";

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  setProjects: () => {},
});

function ProjectContextWrapper(props: React.PropsWithChildren<{}>) {
  const { isLoggedIn, token } = useContext(AuthContext);

  const [projects, setProjects] = useState(null);
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

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects: setProjects as React.Dispatch<
          React.SetStateAction<any[] | null>
        >,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}

export { ProjectContextWrapper, ProjectContext };

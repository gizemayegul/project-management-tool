import { createContext, useState, useEffect } from "react";
// import { useContext } from "react";
// import { AuthContext } from "./AuthContext";
import axios from "axios";

type ProjectContextType = {
  projects: [] | null;
  setProjects: React.Dispatch<React.SetStateAction<null | any[]>>;
};
const ProjectContext = createContext<ProjectContextType>({
  projects: null,
  setProjects: () => {},
});
const API_URL = import.meta.env.VITE_SERVER_URL;

function ProjectContextWrapper(props: React.PropsWithChildren<{}>) {
  const localStoreToken = localStorage.getItem("token");

  const [projects, setProjects] = useState(null);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects/projects`, {
          headers: { Authorization: localStoreToken },
        });
        console.log(response.data.projects);
        setProjects(response.data.projects);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, []);

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

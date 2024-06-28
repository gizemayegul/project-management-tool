import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ProjectContextType, Id, ProjectType } from "../utils/types";
import { apiUrl } from "../utils/config";
import { useNavigate } from "react-router-dom";

import axios, { AxiosError } from "axios";

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  setProjects: () => {},
  handleDeleteProject: () => {},
  submitHandler: () => {},
  setProjectName: () => {},
  projectName: "",
});

function ProjectContextWrapper(props: React.PropsWithChildren<{}>) {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [projectName, setProjectName] = useState<string>("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const navigate = useNavigate();
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

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    setCreateProject?: (createProject: boolean) => void
  ) => {
    e.preventDefault();
    const createProject = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/projects/createproject`,
          { projectName: projectName },
          {
            headers: { Authorization: token },
          }
        );
        if (response.status === 200) {
          setProjects((prev) => [...prev, response.data]);
          setProjectName("");

          navigate(`/projects/${response.data._id}`);
          if (setCreateProject) {
            setCreateProject(false);
          }
        }
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err, "errorr");
        }
      }
    };
    createProject();

    //TODO : projects page is not updated directly maybe it is better move them inside context
  };

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
        submitHandler,
        setProjectName,
        projectName,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}

export { ProjectContextWrapper, ProjectContext };

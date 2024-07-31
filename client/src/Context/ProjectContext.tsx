import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Id, ProjectType } from "../utils/types";
import { ProjectContextType } from "./context";
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
  handleFavoriteProject: () => {},
  setFavoriteProjects: () => {},
  favoriteProjects: [],
  favChange: null,
  dropdown: false,
  setDropdown: () => {},
});

function ProjectContextWrapper(props: React.PropsWithChildren<{}>) {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [projectName, setProjectName] = useState<string>("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<ProjectType[]>([]);
  const [favChange, setFavChange] = useState<boolean | null>(null);
  const [dropdown, setDropdown] = useState<boolean>(false);

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
  }, [token, isLoggedIn, favChange]);

  useEffect(() => {
    const fetchFavoriteProjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/projects/favorites`, {
          headers: { Authorization: token },
        });
        setFavoriteProjects(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavoriteProjects();
  }, [favChange]);

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
          setDropdown((prev) => !prev);

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

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  const handleFavoriteProject = async (projectId: Id) => {
    const response = await axios.put(
      `${apiUrl}/projects/${projectId}/favorite`,
      {
        projectId,
      },
      { headers: { Authorization: token } }
    );
    console.log(response.data);
    setFavChange(response.data);
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
        handleFavoriteProject,
        favoriteProjects,
        setFavoriteProjects,
        setDropdown,
        dropdown,
        favChange,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}

export { ProjectContextWrapper, ProjectContext };

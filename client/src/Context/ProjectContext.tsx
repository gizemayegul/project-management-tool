import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Id, ProjectType } from "../utils/types";
import { ProjectContextType } from "./context";
import { apiUrl } from "../utils/config";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  setProjects: () => {},
  handleDeleteProject: () => {},
  handleFavoriteProject: () => {},
  setFavoriteProjects: () => {},
  favoriteProjects: [],
  favChange: null,
  dropdown: false,
  setDropdown: () => {},
  background: false,
  setBackGround: () => {},
});

function ProjectContextWrapper(props: React.PropsWithChildren<{}>) {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<ProjectType[]>([]);
  const [favChange, setFavChange] = useState<boolean | null>(null);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [background, setBackGround] = useState<boolean>(false);

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
  }, [token, isLoggedIn, favChange, background]);

  useEffect(() => {
    if (token === null) return;
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
  }, [favChange, token]);

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
    setFavChange(response.data);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        handleDeleteProject,
        setProjects,
        background,
        handleFavoriteProject,
        favoriteProjects,
        setFavoriteProjects,
        setDropdown,
        dropdown,
        favChange,
        setBackGround,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}

export { ProjectContextWrapper, ProjectContext };

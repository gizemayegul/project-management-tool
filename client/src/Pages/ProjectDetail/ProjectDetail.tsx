import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;
interface ProjectsDetails {
  projectDetail: object | string;
  projectName: string;
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [projectDetail, setprojectDetail] = useState<ProjectsDetails | null>();
  const localStoreToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/projects/projects/${projectId}`,
          {
            headers: { Authorization: localStoreToken },
          }
        );
        console.log(response.data[0]);
        setprojectDetail(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, [projectId]);
  return <div>{projectDetail && projectDetail.projectName}</div>;
}

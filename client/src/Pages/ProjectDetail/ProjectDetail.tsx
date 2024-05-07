import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_SERVER_URL;
interface ProjectsDetails {
  projectDetail: object | string;
  projectName: string;
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [projectDetail, setprojectDetail] = useState<ProjectsDetails | null>();
  const localStoreToken = localStorage.getItem("token");
  const navigate = useNavigate();

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
  return (
    <div>
      {projectDetail && projectDetail.projectName}
      <button
        className=" bg-indigo-600  text-white hover:bg-indigo-500  hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        type="submit"
        onClick={() => {
          navigate(`/projects/${projectId}/boards/createboard`);
        }}
      >
        {" "}
        Create Board
      </button>{" "}
    </div>
  );
}

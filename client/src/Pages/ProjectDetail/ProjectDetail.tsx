import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Boards from "../Boards/Boards";
import CreateButton from "../../Components/CreateButton/CreateButton";

const API_URL = import.meta.env.VITE_SERVER_URL;
type ProjectsDetails = {
  projectDetail: object | string;
  projectName: string;
};

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
      <div>{projectDetail && projectDetail.projectName}</div>
      <h1>Boardds</h1>
      <CreateButton
        name={"Create new Board"}
        toNavigate={`/projects/${projectId}/boards/createboard`}
      />
      <div>
        <Boards />
      </div>
    </div>
  );
}

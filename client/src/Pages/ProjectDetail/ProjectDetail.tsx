import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Boards from "../../Components/Boards/Boards";
import CreateButton from "../../Components/CreateButton/CreateButton";
import { headers, apiUrl } from "../../utils/config";
import { ProjectsDetails } from "../../utils/types";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [projectDetail, setprojectDetail] = useState<ProjectsDetails | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects/${projectId}`, {
          headers: headers,
        });
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

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import CreateButton from "../../Components/CreateButton/CreateButton";
import { apiUrl } from "../../utils/config";
import { ProjectsDetails } from "../../utils/types";
import Boards from "../../Components/Boards/Boards";
import Drawer from "../../Components/Drawer/Drawer";
import { ProjectContext } from "../../Context/ProjectContext";
import Loading from "../../Components/Loading/Loading";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [projectDetail, setprojectDetail] = useState<ProjectsDetails | null>();
  const { token } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const { handleDeleteProject, setProjects } = useContext(ProjectContext);
  const [projectName, setProjectName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects/${projectId}`, {
          headers: { Authorization: token },
        });
        setprojectDetail(response.data[0]);
        setProjectName(response.data[0].projectName);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, [projectId]);
  const handleProjectName = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/projects/${projectId}`,
        { projectName: projectName },
        {
          headers: { Authorization: token },
        }
      );
      setProjects((prev) => {
        return prev.map((project) => {
          if (project._id === projectId) {
            return response.data;
          }
          return project;
        });
      });
    } catch (err: any) {
      console.log(err);
    }
  };
  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4">
      <div
        className="h-20 w-full rounded-md bg-base-300 min-w-80
 flex justify-between items-center px-4 mb-3 mt-3 min-h-max flex-wrap max-sm:flex-nowrap max-sm:space-x-1 max-sm:justify-between"
      >
        {projectName && !show && <div>{projectName}</div>}
        {show && (
          <div className={`flex align-bottom space-x-4 `}>
            <input
              className="input input-bordered w-full "
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
            />
            <button
              onClick={() => {
                setShow(false);
                handleProjectName();
                setIsDrawerOpen(undefined);
              }}
              className="btn sm:mx-0 bg-indigo-600 text-white hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium max-sm:w-2/5 max-sm:px-8 max-sm:text-sm max-sm:p-0"
            >
              Change Name
            </button>
          </div>
        )}
        <div className="flex items-center justify-between space-x-4">
          <CreateButton
            name={"Create Board"}
            toNavigate={`/projects/${projectId}/boards/createboard`}
          />
          <Drawer
            id={String(projectId)}
            showDelete={true}
            setShow={setShow}
            handleDelete={handleDeleteProject}
            show={show}
            type="projects"
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        </div>
      </div>

      <h1 className="divide-x-4">Your Boards</h1>

      <div>
        <Boards />
      </div>
    </div>
  );
}

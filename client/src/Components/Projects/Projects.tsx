import { useContext } from "react";
import { ProjectContext } from "../../Context/ProjectContext";
import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/20/solid";

export default function Projects() {
  const { projects, handleDeleteProject } = useContext(ProjectContext);

  return (
    <div className="flex">
      {/* <CreateButton
        name={"Create new Project"}
        toNavigate={"/createaproject"}
      /> */}
      <div className="flex flex-wrap">
        {Array.isArray(projects) &&
          projects.map((project) => (
            <div
              key={project._id}
              className="card bg-base-100 image-full w-60 shadow-xl mx-3 my-3"
            >
              <figure>
                <img src={project.imageUrl} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="card-actions justify-between w-full">
                  <Link to={`/projects/${project._id}`}>
                    <button className="btn btn-sm">
                      {project.projectName}
                    </button>
                  </Link>

                  <div
                    onClick={() => {
                      handleDeleteProject(project._id);
                    }}
                  >
                    <TrashIcon className="text-red-500 h-4 mt-1.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

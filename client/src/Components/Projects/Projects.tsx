import { useContext } from "react";
import { ProjectContext } from "../../Context/ProjectContext";
import { Link } from "react-router-dom";
import CreateButton from "../CreateButton/CreateButton";
import { Project } from "../../utils/types";

export default function Projects() {
  const { projects } = useContext(ProjectContext);

  return (
    <div className="flex">
      <h1>Projects</h1>
      {/* <CreateButton
        name={"Create new Project"}
        toNavigate={"/createaproject"}
      /> */}

      {Array.isArray(projects) &&
        projects.map((project: Project) => (
          <Link to={`/projects/${project._id}`}>
            <div
              key={project._id}
              className="card card-compact bg-base-100 w-96 shadow-xl m-3 mt-10"
            >
              <figure>
                <img src={project.imageUrl} alt="Shoes" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{project.projectName}</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}

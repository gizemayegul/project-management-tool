import { useContext } from "react";
import { ProjectContext } from "../../Context/ProjectContext";
// import CreateProject from "../CreateProject/CreateProject";
// import ProjectButton from "../../Components/ProjectButton/ProjectButton";
import { Link } from "react-router-dom";
import CreateButton from "../../Components/CreateButton/CreateButton";

export default function Projects() {
  interface Project {
    projectName: string;
    _id: number;
    updatedAt: string;
    createdAt: string;
    imageUrl: string;
  }
  const { projects } = useContext(ProjectContext);
  console.log(projects);
  // return (
  //   <>
  //     <ProjectButton />
  //     {Array.isArray(projects) &&
  //       projects.map((project: Project, index: number) => (
  //         <div key={index}>{project.projectName}</div>
  //       ))}
  //   </>
  // );
  return (
    <div className="px-20">
      <CreateButton
        name={"Create new Project"}
        toNavigate={"/createaproject"}
      />
      <h1>Projects</h1>

      <ul role="list" className="divide-y divide-gray-100">
        {Array.isArray(projects) &&
          projects.map((project: Project) => (
            <Link key={project._id} to={`/projects/${project._id}`}>
              <li className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={project.imageUrl}
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {project.projectName}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {project.updatedAt}{" "}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    {project.createdAt}
                  </p>
                  {/* {person.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen{" "}
                  <time dateTime={person.lastSeenDateTime}>
                    {person.lastSeen}
                  </time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )} */}
                </div>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
}

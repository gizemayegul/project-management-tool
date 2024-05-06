import { useContext } from "react";
import { ProjectContext } from "../../Context/ProjectContext";

export default function Projects() {
  interface Project {
    projectName: string;
  }
  const { projects } = useContext(ProjectContext);
  console.log(projects);
  return (
    <>
      {Array.isArray(projects) &&
        projects.map((project: Project, index: number) => (
          <div key={index}>{project.projectName}</div>
        ))}
    </>
  );
}

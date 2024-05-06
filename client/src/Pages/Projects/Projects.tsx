import { useContext } from "react";
import { ProjectContext } from "../../Context/ProjectContext";
import CreateProject from "../CreateProject/CreateProject";
import ProjectButton from "../../Components/ProjectButton/ProjectButton";

export default function Projects() {
  interface Project {
    projectName: string;
  }
  const { projects } = useContext(ProjectContext);
  console.log(projects);
  return (
    <>
      <ProjectButton />
      {Array.isArray(projects) &&
        projects.map((project: Project, index: number) => (
          <div key={index}>{project.projectName}</div>
        ))}
    </>
  );
}

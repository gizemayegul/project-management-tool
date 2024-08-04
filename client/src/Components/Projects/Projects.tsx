import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../Context/ProjectContext";
import Card from "../Card/Card";
export default function Projects() {
  const { projects } = useContext(ProjectContext);

  return (
    <div className="flex">
      <div className="flex flex-wrap">
        {Array.isArray(projects) &&
          projects.map((project) => (
            <Card key={project._id} cardType="project" card={project} />
          ))}
      </div>
    </div>
  );
}

import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Empty from "../../Components/Empty/Empty";
import { ProjectContext } from "../../Context/ProjectContext";
import Projects from "../../Components/Projects/Projects";
import AllBoards from "../../Components/AllBoards/AllBoards";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);

  return (
    <div className="flexflex-col divide-y">
      <h1>
        Welcome {user && user.name}{" "}
        {!projects?.length && "you haven't created a new project yet,"}
      </h1>

      {!projects?.length && <Empty />}
      <div>
        <h2>Projects</h2>
        <Projects />
      </div>
      <div>
        <h2>Boards</h2>
        <AllBoards />
      </div>
    </div>
  );
}

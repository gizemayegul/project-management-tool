import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Empty from "../../Components/Empty/Empty";
import { ProjectContext } from "../../Context/ProjectContext";
import Projects from "../../Components/Projects/Projects";
import BoardsAll from "../../Components/BoardsAll/BoardsAll";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);

  return (
    <div className="flex flex-col">
      <h1>
        Welcome {user && user.name}{" "}
        {!projects?.length && "you haven't created a new project yet,"}
      </h1>

      {!projects?.length && <Empty />}
      <div>
        <Projects />
      </div>
      <div>
        <BoardsAll />
      </div>
    </div>
  );
}

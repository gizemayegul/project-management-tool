import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Empty from "../../Components/Empty/Empty";
import { ProjectContext } from "../../Context/ProjectContext";
import Projects from "../../Components/Projects/Projects";
import AllBoards from "../../Components/Boards/Boards";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);

  return (
    <div className="flex flex-col py-4">
      <h1>Welcome {user && user.name}</h1>
      <div className="flex flex-col mt-6">
        {projects.length === 0 && (
          <div>
            <h1>You haven't created a Project yet Let's get start</h1>
            <Link to="/createaproject">
              <button className="btn"> Create A Project</button>
            </Link>
          </div>
        )}
      </div>
      {projects.length > 0 && (
        <div className="flex flex-col divide-y py-10 ">
          <div className="mb-6">
            <h2>Projects</h2>
            <Projects />
          </div>
          <div className="mt-6">
            <h2 className="mt-4">Boards</h2>
            <AllBoards />
          </div>
        </div>
      )}

      {!projects?.length && (
        <div>
          <Empty />
        </div>
      )}
    </div>
  );
}

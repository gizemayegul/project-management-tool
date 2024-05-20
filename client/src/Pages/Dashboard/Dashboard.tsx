import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Empty from "../../Components/Empty/Empty";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../../Context/ProjectContext";
import ProjectButton from "../../Components/CreateButton/CreateButton";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);

  const navigate = useNavigate();

  return (
    <div>
      <h1>
        Welcome {user && user.name}{" "}
        {!projects?.length && "you haven't created a new project yet,"}
      </h1>
      <ProjectButton
        name={"Create new Project"}
        toNavigate={"/createaproject"}
      />
      {!projects?.length && <Empty />}
    </div>
  );
}

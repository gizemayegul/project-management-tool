import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Empty from "../../Components/Empty/Empty";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between content-center flex-col ">
        <h1>
          Welcome {user && user.name} you haven't created a new project yet,
        </h1>
        <button
          onClick={() => {
            navigate("/createaproject");
          }}
          className=" bg-indigo-600  text-white hover:bg-indigo-500  hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
          Create a New project
        </button>{" "}
      </div>
      <Empty />
    </div>
  );
}

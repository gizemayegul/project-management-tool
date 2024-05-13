import { useNavigate } from "react-router-dom";

export default function ProjectButton() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className=" bg-indigo-600  text-white hover:bg-indigo-500  hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        type="submit"
        onClick={() => {
          navigate("/createaproject");
        }}
      >
        {" "}
        Create a New project
      </button>{" "}
    </div>
  );
}

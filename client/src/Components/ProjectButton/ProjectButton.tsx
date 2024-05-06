import { useNavigate } from "react-router-dom";

export default function ProjectButton() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between content-center flex-col ">
      <button
        onClick={() => {
          navigate("/createaproject");
        }}
        className=" bg-indigo-600  text-white hover:bg-indigo-500  hover:text-white rounded-md px-3 py-2 text-sm font-medium"
      >
        Create a New project
      </button>{" "}
    </div>
  );
}

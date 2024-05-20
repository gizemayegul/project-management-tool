import { useNavigate } from "react-router-dom";

type Create = {
  name: string;
  toNavigate: string;
};

export default function CreateButton({
  name,
  toNavigate,
}: Create): React.ReactElement {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className=" bg-indigo-600  text-white hover:bg-indigo-500  hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        type="submit"
        onClick={() => {
          navigate(toNavigate);
        }}
      >
        {" "}
        {name}{" "}
      </button>{" "}
    </div>
  );
}

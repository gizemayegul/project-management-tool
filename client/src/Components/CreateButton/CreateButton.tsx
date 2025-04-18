import { useNavigate } from "react-router-dom";
import { Create } from "../../utils/types";

export default function CreateButton({
  name,
  toNavigate,
}: Create): React.ReactElement {
  const navigate = useNavigate();
  return (
    <>
      <button
        className="btn sm:mx-0 bg-indigo-600 text-white hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium max-sm:w-2/5 max-sm:px-8 max-sm:text-sm max-sm:p-0"
        onClick={() => {
          navigate(toNavigate);
        }}
      >
        {name}
      </button>
    </>
  );
}

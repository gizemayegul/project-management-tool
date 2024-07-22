import { PencilIcon } from "@heroicons/react/20/solid";

export default function Edit({ show }: { show?: boolean }) {
  return (
    <div className="flex ">
      <PencilIcon className="hover:text-red-500 h-4 mt-1.5" />
      {show && <div>Edit</div>}
    </div>
  );
}

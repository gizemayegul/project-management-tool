import { PencilIcon } from "@heroicons/react/20/solid";

export default function Edit({ show }: { show?: boolean }) {
  return (
    <div className="flex items-center">
      <div>
        <PencilIcon className="hover:text-red-500 h-3 mt-1.5" />
      </div>
      {show && <div>Edit</div>}
    </div>
  );
}

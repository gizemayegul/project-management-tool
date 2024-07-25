import DeleteModal from "../DeleteModal/DeleteModal";
import { Id } from "../../utils/types";
import Edit from "../Edit/Edit";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";

type propTypes = {
  id: Id;
  handleDelete: (id: Id) => void;
  modal: string;
  showDelete: boolean;
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function Drawer({
  id,
  handleDelete,
  modal,
  showDelete,
  show,
  setShow,
}: propTypes) {
  return (
    <div>
      <div className="drawer drawer-end z-30">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer-4">
            <Cog8ToothIcon className="h-6" />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <DeleteModal
                handleDelete={handleDelete}
                id={id}
                modal={id}
                showDelete={showDelete}
              />
            </li>
            <li
              className="flex"
              onClick={() => {
                setShow(!show);
              }}
            >
              <Edit show={true} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

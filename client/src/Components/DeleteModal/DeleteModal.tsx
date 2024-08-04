import { Id } from "../../utils/types";
import { TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type ModalProps = {
  handleDelete(id: Id | undefined, id1: Id | undefined): void;
  modal: string | number;
  id?: Id;
  id1?: Id;
  showDelete?: boolean;
};

export default function DeleteModal({
  handleDelete,
  modal,
  showDelete,
  id,
  id1,
}: ModalProps) {
  const notify = () => toast.success("Deleted!");

  return (
    <div
      onClick={() =>
        (
          document.getElementById(String(modal)) as HTMLDialogElement
        )?.showModal?.()
      }
    >
      <TrashIcon className="pb-1 h-4 mt-1.5 " />
      {showDelete && <div className="mx-1">Delete</div>}

      <dialog
        id={String(modal)}
        className="modal modal-bottom sm:modal-middle z-30"
      >
        <div className="modal-box">
          <p className="py-4Are you sure you want to delete?">
            Are you sure you want to delete?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mx-2">Cancel</button>
              <button
                onClick={() => {
                  handleDelete(id, id1);

                  notify();
                }}
                className="btn bg-red-500  text-white mx-2"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

import { Id } from "../../utils/types";
import { TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type ModalProps = {
  handleDelete(id: Id, id1: Id): void;
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
    <div onClick={() => document.getElementById(modal)?.showModal?.()}>
      <TrashIcon className="pb-1 h-4 mt-1.5 " />
      {showDelete && <div className="mx-1">Delete</div>}

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id={modal} className="modal modal-bottom sm:modal-middle z-30">
        <div className="modal-box">
          {/* <h3 className="font-bold text-lg text-black">Hello!</h3> */}
          <p className="py-4Are you sure you want to delete?">
            Are you sure you want to delete?
          </p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <form method="dialog">
              <button className="btn mx-2">Cancel</button>
              <button
                onClick={() => {
                  handleDelete(id, id1);
                  console.log("DeleteModal: Calling handleDelete for ID:", id); // Debug log

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

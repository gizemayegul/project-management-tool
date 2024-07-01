import { Id } from "../../utils/types";
import { TrashIcon } from "@heroicons/react/20/solid";
type ModalProps = {
  handleDelete(id: Id, id1?: Id): void;
  modal: string;
  id: Id;
  id1?: Id;
};

export default function DeleteModal({
  handleDelete,
  modal,
  id,
  id1,
}: ModalProps) {
  return (
    <div>
      <div
        onClick={() => document.getElementById(modal as Modal)?.showModal?.()}
      >
        <TrashIcon className="hover:text-red-500 h-4 mt-1.5"></TrashIcon>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <dialog id={modal} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            {/* <h3 className="font-bold text-lg text-black">Hello!</h3> */}
            <p className="py-4 text-black">Are you sure you want to delete?</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn mx-2">Cancel</button>
                <button
                  onClick={() => {
                    handleDelete(id, id1);
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
    </div>
  );
}

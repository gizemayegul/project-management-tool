import React from "react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { CardType, Id } from "../../utils/types";

type Card = {
  handleDelete: (cardId: Id) => void;
  card: CardType;
  cardType?: string;
};
export default function Card({ handleDelete, card, cardType }: Card) {
  return (
    <div className="card bg-base-100  image-full w-60 shadow-xl mx-3 my-3">
      {cardType === "board" && (
        <>
          <figure>
            <img src={card.imageUrl} alt="Shoes" />
          </figure>
          <div className="card-body p-3">
            <div className="card-actions justify-between">
              <Link to={`/projects/${card.projectId}/boards/${card._id}`}>
                <div className="text-white px-1 rounded-sm">
                  {card.boardName}
                </div>
              </Link>
              <Link to={`/projects/${card.projectId}`}>
                <div className="badge badge-accent">
                  {" "}
                  <u>{card.projectName}</u>
                </div>
              </Link>

              <div
                onClick={() =>
                  document.getElementById("my_modal_5").showModal()
                }
              >
                <TrashIcon className="text-red-500 h-4 mt-1.5"></TrashIcon>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog
                  id="my_modal_5"
                  className="modal modal-bottom sm:modal-middle"
                >
                  <div className="modal-box">
                    {/* <h3 className="font-bold text-lg text-black">Hello!</h3> */}
                    <p className="py-4 text-black">
                      Are you sure you want to delete?
                    </p>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn mx-2">Close</button>
                        <button
                          onClick={() => {
                            handleDelete(card._id);
                          }}
                          className="btn btn-error text-white mx-2"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
        </>
      )}
      {cardType === "project" && (
        <>
          <figure>
            <img src={card.imageUrl} alt="Shoes" />
          </figure>
          <div className="card-body p-3">
            <div className="card-actions justify-between w-full">
              <Link to={`/projects/${card._id}`}>
                <div className="text-white">
                  <u>{card.projectName}</u>
                </div>
              </Link>
              <div
                onClick={() =>
                  document.getElementById("my_modal_6").showModal()
                }
              >
                <TrashIcon className="text-red-500 h-4 mt-1.5"></TrashIcon>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog
                  id="my_modal_6"
                  className="modal modal-bottom sm:modal-middle"
                >
                  <div className="modal-box">
                    {/* <h3 className="font-bold text-lg text-black">Hello!</h3> */}
                    <p className="py-4 text-black">
                      Are you sure you want to delete?
                    </p>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn mx-2">Close</button>
                        <button
                          onClick={() => {
                            handleDelete(card._id);
                          }}
                          className="btn btn-error text-white mx-2"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

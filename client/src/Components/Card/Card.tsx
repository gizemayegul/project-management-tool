import { Link } from "react-router-dom";
import { CardType, Id } from "../../utils/types";
import DeleteModal from "../DeleteModal/DeleteModal";

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

              {/* <DeleteModal
                handleDelete={handleDelete}
                id={card._id}
                modal="my_modal_5"
              /> */}
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
              {/* <DeleteModal
                handleDelete={handleDelete}
                id={card._id}
                modal="my_modal_6"
              /> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

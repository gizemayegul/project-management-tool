import { Link } from "react-router-dom";
import { CardType } from "../../utils/types";
import { HeartIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { BoardContext } from "../../Context/BoardContext";
import { ProjectContext } from "../../Context/ProjectContext";

type Card = {
  card: CardType;
  cardType?: string;
};
export default function Card({ card, cardType }: Card) {
  const { handleFavoriteBoard } = useContext(BoardContext);
  const { handleFavoriteProject } = useContext(ProjectContext);

  return (
    <div className="card bg-base-100 max-h-25 image-full w-60 shadow-xl mx-3 my-3 ">
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

              <div
                className="h-16 bg-transparent"
                onClick={() => {
                  handleFavoriteBoard(card._id);
                }}
              >
                <HeartIcon
                  className="h-6"
                  fill={`${card.favorite ? "red" : "white"}`}
                />
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
          <div className="card-body p-3 z-0">
            <div className="card-actions justify-between w-full">
              <Link to={`/projects/${card._id}`}>
                <div className="text-white">
                  <u>{card.projectName}</u>
                </div>
              </Link>
              <div
                className="h-16 bg-transparent"
                onClick={() => {
                  handleFavoriteProject(card._id);
                }}
              >
                <HeartIcon
                  className="h-6"
                  fill={`${card.favorite ? "red" : "white"}`}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

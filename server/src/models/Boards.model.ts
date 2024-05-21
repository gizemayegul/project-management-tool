import { Schema, model } from "mongoose";

const boardsSchema = new Schema(
  {
    boardName: {
      type: String,
      default: "My New Board",
      required: [true, "Board name is required"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
    },
    imageUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4WmAlrjjUTOOYs35vGliGHYUdtUkXyQ-t9cyThMmGX0Uh4gtmZ0lkJE8ixZIRSSmgJzI&usqp=CAU",
    },
    boardColumns: {
      type: [
        {
          statusName: String,
          _id: { type: Schema.Types.ObjectId, auto: true },
        },
      ],
      default: [
        { statusName: "Todo" },
        { statusName: "Inprogress" },
        { statusName: "Done" },
      ],
    },
  },

  {
    timestamps: true,
  }
);

const Boards = model("Boards", boardsSchema);
export default Boards;

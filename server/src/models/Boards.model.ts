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
    boardInitialColumns: {
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

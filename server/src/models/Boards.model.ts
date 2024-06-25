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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4WmAlrjjUTOOYs35vGliGHYUdtUkXyQ-t9cyThMmGX0Uh4gtmZ0lkJE8ixZIRSSmgJzI&usqp=CAU",
    },
    columns: [{ type: Schema.Types.ObjectId, ref: "Column" }],
  },

  {
    timestamps: true,
  }
);

const Boards = model("Boards", boardsSchema);
export default Boards;

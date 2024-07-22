import { Schema, model } from "mongoose";
const ColumnsSchema = new Schema(
  {
    columnName: {
      type: String,
      default: "Untitled",
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Boards",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
    },
    tasks: [
      {
        taskName: {
          type: String,
          default: "Untitled",
        },

        taskPriority: {
          type: String,
          default: "P3",
          enum: ["P1", "P2", "P3"],
        },
      },

      {
        timestamps: true,
      },
    ],
    index: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "#000000",
    },
  },
  {
    timestamps: true,
  }
);
const Columns = model("Columns", ColumnsSchema);
export default Columns;
